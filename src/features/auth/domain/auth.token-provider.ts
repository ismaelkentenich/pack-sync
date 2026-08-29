export interface AuthTokenProvider {
  getIdToken(
    forceRefresh?: boolean,
  ): Promise<string | null>;
}
