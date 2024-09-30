let cachedAccessToken: string | null = null;
let tokenExpiryTime: number | null = null;

async function refreshAccessTokenOrange(): Promise<string | null> {
  const refreshToken = process.env.REFRESH_TOKEN;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const grantType = process.env.GRANT_TYPE;

  if (!refreshToken || !grantType || !clientId || !clientSecret) {
    console.error("Missing one or more required environment variables.");
    return null;
  }

  try {
    const response = await fetch(
      "https://api.sandbox.orange-sonatel.com/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: grantType,
          refresh_token: refreshToken,
          client_id: clientId,
          client_secret: clientSecret,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();

      cachedAccessToken = data.access_token;
      tokenExpiryTime = Date.now() + data.expires_in * 1000;

      console.log("New access token:", cachedAccessToken);
      console.log(
        "Token expiry time:",
        new Date(tokenExpiryTime).toISOString()
      );
      return cachedAccessToken;
    } else {
      const errorData = await response.json();
      console.error("Error refreshing token:", response.statusText, errorData);
      return null;
    }
  } catch (error) {
    console.error("Network error while refreshing token:", error);
    return null;
  }
}

export async function getValidAccessToken(): Promise<string | null> {
  // Si le token est déjà en cache et valide
  if (cachedAccessToken && tokenExpiryTime && Date.now() < tokenExpiryTime) {
    return cachedAccessToken;
  }

  // Si le token est expiré ou non présent, le rafraîchir
  console.log("Access token expired or not present. Refreshing...");
  return await refreshAccessTokenOrange();
}
