/**
 * 用户凭证请求 DTO。
 * 说明：用于注册/登录时提交的最小字段集合。
 */
export interface UserCredentialsRequestDto {
  /**
   * 用户名。
   */
  username: string;

  /**
   * 密码。
   */
  password: string;
}
