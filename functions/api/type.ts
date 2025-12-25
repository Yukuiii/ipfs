/**
 * 用户凭证结构定义（输入）。
 * 说明：用于注册/登录时提交的最小字段集合。
 */
export interface UserCredentials {
  /**
   * 用户名。
   */
  username: string;

  /**
   * 密码。
   */
  password: string;
}

/**
 * 用户实体结构定义（兼容别名）。
 * 说明：保留 `User` 名称，便于现有引用继续工作。
 */
export type User = UserCredentials;

/**
 * 用户存储结构定义（持久化）。
 * 说明：用于 D1 表记录，包含密码哈希与创建时间。
 */
export interface UserRecord {
  /**
   * 用户名。
   */
  username: string;

  /**
   * 密码哈希（包含算法/迭代次数/盐/派生值）。
   */
  passwordHash: string;

  /**
   * 创建时间戳（毫秒）。
   */
  createdAt: number;
}
