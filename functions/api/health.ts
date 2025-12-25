/**
 * Pages Functions 健康检查接口。
 * 用于本地 `wrangler pages dev` 或线上预览时验证 Functions 已生效。
 */
export async function onRequestGet(): Promise<Response> {
  return Response.json({ ok: true });
}
