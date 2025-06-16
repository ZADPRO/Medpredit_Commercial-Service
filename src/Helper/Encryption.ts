import * as crypto from "crypto";

function encrypt(
  text: string | object,
  encryptStatus?: boolean
): string[] | { text: string | object } {
  // console.log("encrypt status line -----12", encryptStatus);

  if (!encryptStatus) {
    return { text }; // Return the original input if encryption is not enabled
  }

  console.log(" line ------- 14");

  const algorithm = "aes-256-cbc";
  const key = Buffer.from(process.env.ENCRYPTION_KEY as string, "hex");
  const iv = crypto.randomBytes(16);

  if (key.length !== 32) {
    throw new Error("Encryption key must be 32 bytes long");
  }

  const textToEncrypt = typeof text === "object" ? JSON.stringify(text) : text;

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(textToEncrypt, "utf-8", "hex");
  encrypted += cipher.final("hex");
  console.log("line -------- 29");
  return [iv.toString("hex"), encrypted];
}

export { encrypt };
