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
