function getCorrespondent(country: string): string {
    const correspondents: { [key: string]: string } = {
      CONGO: "MTN_MOMO_COG",
      SENEGAL: "MTN_MOMO_SEN",
      GABON: "MTN_MOMO_GAB",
    };
    return correspondents[country] || "UNKNOWN";
  }
  
  function getRecipientPhone(country: string): string {
    const recipientPhones: { [key: string]: string } = {
      CONGO: "242055555555",
      SENEGAL: "221770000000",
      GABON: "241060606060",
    };
    return recipientPhones[country] || "";
  }
  