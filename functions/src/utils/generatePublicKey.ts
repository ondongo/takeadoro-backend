async function getPublicKey(accessToken: any) {
  try {
    const response = await fetch(
      "https://api.sandbox.orange-sonatel.com/api/account/v1/publicKeys",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json", 
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching public key: ${response.statusText}`);
    }

    const data = await response.json();
    return data.key;
  } catch (error) {
    console.error("Error fetching public key:", error);
    throw error;
  }
}
