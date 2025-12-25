import type { EventContext } from "@cloudflare/workers-types";
import { loginUser, type Env } from "../auth";

/**
 * 登录接口。
 * 路由：POST /api/auth/login
 * @param context 上下文
 */
export async function onRequestPost(
  context: EventContext<Env, string, unknown>
): Promise<Response> {
  try {
    const payload = await context.request.json();
    const result = await loginUser(context.env, payload);
    return Response.json({ ok: true, user: result }, { status: 200 });
  } catch (error) {
    return Response.json(
      { ok: false, message: error instanceof Error ? error.message : "登录失败" },
      { status: 400 }
    );
  }
}
