export async function obtainAccessToken(): Promise<string | null> {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
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
            grant_type: "client_credentials",
            client_id: clientId,
            client_secret: clientSecret,
          }),
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        console.log("Oauth information :", data);
        return data.access_token;
      } else {
        const errorData = await response.json();
        console.error("Error obtaining token:", response.statusText, errorData);
        return null;
      }
    } catch (error) {
      console.error("Network error while obtaining token:", error);
      return null;
    }
}

/* export async function getAccessTokenForRequest(): Promise<string | null> {
    console.log("Generating new access token for request...");
    return await obtainAccessToken();
  } */