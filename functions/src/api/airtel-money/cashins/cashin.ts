
async function performCashIn(
  amount: any,
  beneficiaryId: any,
  accessToken: any
) {
  const apiUrl = "https://sandblox/standard/v2/cashin/";

  try {
    const requestBody = {
      amount: amount,
      beneficiary_id: beneficiaryId,
      // other parameters required by the API
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to perform cash-in: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error performing cash-in:", error);
    throw error;
  }
}
