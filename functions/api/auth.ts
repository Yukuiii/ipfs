import type { D1Database } from "@cloudflare/workers-types";
import type { UserCredentialsRequestDto } from "./type";

/**
 * Cloudflare Pages Functions 环境变量类型。
 */
export interface Env {
  /** D1 数据库绑定 */
  DB: D1Database;
}

/**
 * 用户登录结果。
 */
export interface LoginResult {
  username: string;
}

const PASSWORD_HASH_ALGO = "pbkdf2_sha256";
const PASSWORD_HASH_ITERATIONS = 150_000;
const PASSWORD_HASH_SALT_BYTES = 16;
const PASSWORD_HASH_DERIVED_BITS = 256;

/**
 * 将 Uint8Array 转为 base64 字符串。
 * @param bytes 字节数组
 * @returns base64
 */
function bytesToBase64(bytes: Uint8Array): string {
  // 这里数据量很小（盐与派生值），可直接构造二进制字符串后 btoa。
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

/**
 * 将 base64 字符串转为 Uint8Array。
 * @param base64 base64
 * @returns 字节数组
 */
function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * 常量时间比较，避免根据字符差异提前返回导致的侧信道风险。
 * @param a 数组 a
 * @param b 数组 b
 * @returns 是否相等
 */
function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

/**
 * 生成随机盐。
 * @returns 盐
 */
function generateSalt(): Uint8Array {
  const salt = new Uint8Array(PASSWORD_HASH_SALT_BYTES);
  crypto.getRandomValues(salt);
  return salt;
}

/**
 * 使用 PBKDF2-SHA256 派生密钥。
 * @param password 明文密码
 * @param salt 盐
 * @param iterations 迭代次数
 * @returns 派生结果
 */
async function pbkdf2Sha256(
  password: string,
  salt: Uint8Array,
  iterations: number
): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: "SHA-256",
    },
    baseKey,
    PASSWORD_HASH_DERIVED_BITS
  );

  return new Uint8Array(derivedBits);
}

/**
 * 生成密码哈希（用于存储）。
 * 格式：`pbkdf2_sha256$iterations$saltBase64$hashBase64`
 * @param password 明文密码
 * @returns 哈希串
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password || typeof password !== "string") {
    throw new TypeError("密码不能为空");
  }

  const salt = generateSalt();
  const derived = await pbkdf2Sha256(password, salt, PASSWORD_HASH_ITERATIONS);
  return [
    PASSWORD_HASH_ALGO,
    String(PASSWORD_HASH_ITERATIONS),
    bytesToBase64(salt),
    bytesToBase64(derived),
  ].join("$");
}

/**
 * 校验密码是否匹配存储的哈希。
 * @param password 明文密码
 * @param storedHash 存储的哈希串
 * @returns 是否匹配
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  if (!password || typeof password !== "string") {
    throw new TypeError("密码不能为空");
  }
  if (!storedHash || typeof storedHash !== "string") {
    throw new TypeError("密码哈希不能为空");
  }

  const parts = storedHash.split("$");
  if (parts.length !== 4) return false;

  const [algo, iterationsRaw, saltB64, hashB64] = parts;
  if (algo !== PASSWORD_HASH_ALGO) return false;

  const iterations = Number(iterationsRaw);
  if (!Number.isFinite(iterations) || iterations <= 0) return false;

  const salt = base64ToBytes(saltB64);
  const expected = base64ToBytes(hashB64);
  const derived = await pbkdf2Sha256(password, salt, iterations);
  return constantTimeEqual(derived, expected);
}

/**
 * 获取 D1 数据库绑定。
 * @param env 环境变量
 * @returns D1 数据库对象
 */
function getDb(env: Env): D1Database {
  if (!env || !env.DB || typeof env.DB.prepare !== "function") {
    throw new Error("未配置 D1 绑定：请在 wrangler.toml 中绑定 d1_databases 到 DB");
  }
  return env.DB;
}

/**
 * 注册用户（写入 D1）。
 * @param env 环境变量（需包含 DB）
 * @param params 注册参数
 * @returns 注册结果
 */
export async function registerUser(
  env: Env,
  params: UserCredentialsRequestDto
): Promise<LoginResult> {
  const { username, password } = params;

  const db = getDb(env);
  const exists = await db
    .prepare("SELECT 1 AS ok FROM users WHERE username = ? LIMIT 1")
    .bind(username)
    .first<{ ok: number }>();
  if (exists?.ok) {
    throw new Error("用户名已存在");
  }

  const passwordHash = await hashPassword(password);
  const createdAt = Date.now();
  await db
    .prepare(
      "INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)"
    )
    .bind(username, passwordHash, createdAt)
    .run();

  return { username };
}

/**
 * 登录用户（校验 D1 中的密码哈希）。
 * @param env 环境变量（需包含 DB）
 * @param params 登录参数
 * @returns 登录结果
 */
export async function loginUser(
  env: Env,
  params: UserCredentialsRequestDto
): Promise<LoginResult> {
  const { username, password } = params;

  const db = getDb(env);
  const record = await db
    .prepare("SELECT username, password_hash FROM users WHERE username = ?")
    .bind(username)
    .first<{ username: string; password_hash: string }>();

  if (!record) {
    // 为避免泄露用户名是否存在，统一返回同一错误。
    throw new Error("用户名或密码错误");
  }

  const ok = await verifyPassword(password, record.password_hash);
  if (!ok) {
    throw new Error("用户名或密码错误");
  }

  return { username: record.username };
}
