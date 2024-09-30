export async function getPublicKey(accessToken: any) {
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
    // Formater la clé publique pour s'assurer qu'elle est en format PEM
    const publicKeyPem = data.key;

    const formattedPublicKeyPem = `-----BEGIN PUBLIC KEY-----\n${publicKeyPem}\n-----END PUBLIC KEY-----`;

    console.log('Public Key PEM:', formattedPublicKeyPem);
    return formattedPublicKeyPem;
  } catch (error) {
    console.error("Error fetching public key:", error);
    throw error;
  }
}
