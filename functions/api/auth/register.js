import { registerUser } from "../auth";

/**
 * 注册接口。
 * 路由：POST /api/auth/register
 * @param {{ request: Request, env: Record<string, any> }} context 上下文
 */
export async function onRequestPost(context) {
  try {
    const payload = await context.request.json();
    const result = await registerUser(context.env, payload);
    return Response.json({ ok: true, user: result }, { status: 201 });
  } catch (error) {
    return Response.json(
      { ok: false, message: error instanceof Error ? error.message : "注册失败" },
      { status: 400 }
    );
  }
}

