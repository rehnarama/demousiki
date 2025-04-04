import { AuthOptions, getServerSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import SpotifyProvider from "next-auth/providers/spotify";
import assert from "node:assert";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const AUTH_SECRET = process.env.AUTH_SECRET;
const SPOTIFY_ID = process.env.SPOTIFY_ID;
const SPOTIFY_SECRET = process.env.SPOTIFY_SECRET;
assert(SPOTIFY_ID);
assert(SPOTIFY_SECRET);

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: JWT) {
  assert(token.refreshToken, "Can't refresh token without refresh_token");
  assert(SPOTIFY_ID);
  assert(SPOTIFY_SECRET);

  try {
    const url = `${SPOTIFY_TOKEN_URL}?${new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: token.refreshToken,
    })}`;

    const authorization =
      "Basic " +
      Buffer.from(SPOTIFY_ID + ":" + SPOTIFY_SECRET).toString("base64");

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: authorization,
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpiresAt: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    } satisfies JWT;
  } catch (error) {
    console.error(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: AuthOptions = {
  secret: AUTH_SECRET,
  providers: [
    SpotifyProvider({
      clientId: SPOTIFY_ID,
      clientSecret: SPOTIFY_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        assert(account.expires_at, "expires_at is required");

        return {
          ...token,
          accessToken: account.access_token,
          accessTokenExpiresAt: account.expires_at * 1000,
          refreshToken: account.refresh_token,
        } satisfies JWT;
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpiresAt) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      assert(typeof token?.accessToken === "string");
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

export const getSession = () => getServerSession(authOptions);
