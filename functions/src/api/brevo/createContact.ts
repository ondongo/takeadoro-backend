
import { initializeBrevoClient } from "../../utils/brevoUtils";

var SibApiV3Sdk = require("sib-api-v3-sdk");

export const createBrevoContact = async (user: any) => {
  console.log("test========>", user);
  initializeBrevoClient();
  var apiInstance = new SibApiV3Sdk.ContactsApi();

  let firstName = "";
  let lastName = "";

  if (user.display_name) {
    const nameParts = user.display_name.split(" ");
    firstName = nameParts[0] || "";
    lastName = nameParts.slice(1).join(" ") || ""; // Concatène le reste des parties comme nom de famille
  }

  var createContact = new SibApiV3Sdk.CreateContact();

  createContact = {
    email: user.email,
    attributes: {
      FNAME: firstName,
      LNAME: lastName,
    },
    listIds: [11],
    emailBlacklisted: false,
    smsBlacklisted: false,
    updateEnabled: false,
  };

  /*   if (user.type != "") {
    if (user.type === "Freelance") {
      contactData.listIds.push(1);
    } else{
      contactData.listIds.push(2);
    }
  } else {
    contactData.listIds.push(3);
  } */

  /*  const headers = new Headers({
    "Content-Type": "application/json",
    "api-key": apiKey || "",
  });
 */


  
  /*   const response = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(contactData),
  }); */
  console.log(
    "Données envoyées à l'API Brevo:",
    JSON.stringify(createContact, null, 2)
  );

  try {
    const data = await apiInstance.createContact(createContact);
    console.log(
      "API called successfully. Returned data: " + JSON.stringify(data, null, 2)
    );
    return data;
  } catch (error) {
    console.error("Erreur lors de la création du contact:", error);
    throw new Error(`Erreur lors de la création du contact : ${error}`);
  }
};
