import { getPublicKey } from "./generatePublicKey";

const forge = require("node-forge");

export async function encryptPassword(password: any, accessToken: any) {
  try {
    const publicKeyPem = await getPublicKey(accessToken);

    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

    // Chiffrer le mot de passe
    const encryptedPassword = publicKey.encrypt(password, "RSA-PSS");

    // Convertir le mot de passe chiffré en base64

    console.log("Tesstttstststs", forge.util.encode64(encryptedPassword));
    return forge.util.encode64(encryptedPassword);
  } catch (error) {
    console.error("Error encrypting password:", error);
    throw error;
  }
} 

/* const NodeRSA = require("node-rsa");

export async function encryptPassword(password: any, accessToken: any) {
  try {
    const publicKeyPem = await getPublicKey(accessToken);

    const key = new NodeRSA(publicKeyPem);
    const encryptedPassword = key.encrypt(password, "base64");

    console.log("Encrypted Password (Base64):", encryptedPassword);
    return encryptedPassword;
  } catch (error) {
    console.error("Error encrypting password:", error);
    throw error;
  }
}
 */