export interface AuthDao {
  createAuthToken(userAlias: string, ttlSeconds: number): Promise<string>;

  validateAuthToken(token: string): Promise<string | null>;

  revokeAuthToken(token: string): Promise<void>;

  revokeAllForUser(userAlias: string): Promise<void>;
}
