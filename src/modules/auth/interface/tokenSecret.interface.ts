export interface TokenSecretResolver {
  resolve(type: string): string;
}
