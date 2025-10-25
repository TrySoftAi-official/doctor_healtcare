import Cookies from 'js-cookie';

export class TokenManager {
  private static readonly TOKEN_KEY = 'access_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';

  /**
   * Get the access token from cookies
   */
  static getToken(): string | null {
    return Cookies.get(this.TOKEN_KEY) || null;
  }

  /**
   * Set the access token in cookies
   */
  static setToken(token: string, expiresInDays: number = 7): void {
    Cookies.set(this.TOKEN_KEY, token, {
      expires: expiresInDays,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
  }

  /**
   * Get the refresh token from cookies
   */
  static getRefreshToken(): string | null {
    return Cookies.get(this.REFRESH_TOKEN_KEY) || null;
  }

  /**
   * Set the refresh token in cookies
   */
  static setRefreshToken(token: string, expiresInDays: number = 30): void {
    Cookies.set(this.REFRESH_TOKEN_KEY, token, {
      expires: expiresInDays,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
  }

  /**
   * Remove all tokens from cookies
   */
  static clearTokens(): void {
    Cookies.remove(this.TOKEN_KEY, { path: '/' });
    Cookies.remove(this.REFRESH_TOKEN_KEY, { path: '/' });
  }

  /**
   * Check if user is authenticated (has valid token)
   */
  static isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Basic JWT token validation (check if it's not expired)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  /**
   * Get token expiration time
   */
  static getTokenExpiration(): Date | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(): boolean {
    const expiration = this.getTokenExpiration();
    if (!expiration) return true;
    return new Date() > expiration;
  }
}

