// utils/crypto.js
import { MlKem768 } from "mlkem";

/**************************************
 * Helper: Byte <-> Base64
 **************************************/
export function bytesToBase64(bytes) {
  return Buffer.from(bytes).toString("base64");
}

export function base64ToBytes(b64) {
  return new Uint8Array(Buffer.from(b64, "base64"));
}

/**************************************
 * IndexedDB (secure key storage)
 **************************************/
export async function loadUserKeys() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("pqcSecureDB", 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("keys")) {
        db.createObjectStore("keys", { keyPath: "username" });
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("keys", "readonly");
      const store = tx.objectStore("keys");

      const username =
        typeof window !== "undefined"
          ? localStorage.getItem("username")
          : null;

      if (!username) return resolve(null);

      const getReq = store.get(username);

      getReq.onsuccess = () => {
        resolve(getReq.result || null);
      };
      getReq.onerror = reject;
    };

    request.onerror = reject;
  });
}

export async function saveUserKeys(username, publicKeyBase64, secretKeyBase64) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("pqcSecureDB", 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("keys")) {
        db.createObjectStore("keys", { keyPath: "username" });
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("keys", "readwrite");
      const store = tx.objectStore("keys");

      store.put({
        username,
        publicKeyBase64,
        secretKeyBase64,
      });

      tx.oncomplete = resolve;
      tx.onerror = reject;
    };

    request.onerror = reject;
  });
}

/**************************************
 * KEM KEY GENERATION (ML-KEM-768)
 **************************************/
export async function generateKEMKeypair() {
  const kem = new MlKem768();
  const [publicKey, secretKey] = await kem.generateKeyPair();

  return {
    publicKeyBase64: bytesToBase64(publicKey),
    secretKeyBase64: bytesToBase64(secretKey),
  };
}

/**************************************
 * KEM Encap (Sender)
 **************************************/
export async function encapsulate(publicKeyBase64) {
  const kem = new MlKem768();
  const pkBytes = base64ToBytes(publicKeyBase64);

  const [capsule, sharedSecret] = await kem.encap(pkBytes);

  return {
    kemCiphertextBase64: bytesToBase64(capsule),
    sharedSecretBase64: bytesToBase64(sharedSecret),
  };
}

/**************************************
 * KEM Decap (Receiver)
 **************************************/
export async function decapsulate(kemCiphertextBase64, secretKeyBase64) {
  const kem = new MlKem768();

  const capsuleBytes = base64ToBytes(kemCiphertextBase64);
  const secretKeyBytes = base64ToBytes(secretKeyBase64);

  const sharedSecret = await kem.decap(capsuleBytes, secretKeyBytes);

  return bytesToBase64(sharedSecret);
}

/**************************************
 * AES-GCM Encryption
 **************************************/
export async function aesEncrypt(plaintext, sharedSecretBase64) {
  const keyBytes = base64ToBytes(sharedSecretBase64);

  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    "AES-GCM",
    false,
    ["encrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  return {
    ciphertextBase64: bytesToBase64(new Uint8Array(encrypted)),
    ivBase64: bytesToBase64(iv),
  };
}

/**************************************
 * AES-GCM Decryption
 **************************************/
export async function aesDecrypt(ciphertextBase64, ivBase64, sharedSecretBase64) {
  const ciphertext = base64ToBytes(ciphertextBase64);
  const iv = base64ToBytes(ivBase64);
  const keyBytes = base64ToBytes(sharedSecretBase64);

  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    "AES-GCM",
    false,
    ["decrypt"]
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}

/**************************************
 * High-level Encrypt-for-Recipient
 **************************************/
export async function encryptForRecipient(recipientPublicKeyBase64, message) {
  // 1) KEM encaps → get shared secret
  const { kemCiphertextBase64, sharedSecretBase64 } = await encapsulate(
    recipientPublicKeyBase64
  );

  // 2) AES encrypt message using shared secret
  const { ciphertextBase64, ivBase64 } = await aesEncrypt(
    message,
    sharedSecretBase64
  );

  return {
    kemCiphertextBase64,
    ciphertextBase64,
    ivBase64,
  };
}

/**************************************
 * High-level Decrypt Incoming Message
 **************************************/
export async function decryptIncomingMessage(msg, myKeys) {
  if (!myKeys?.secretKeyBase64) return null;

  try {
    // 1) KEM decap → recover shared secret
    const sharedSecretBase64 = await decapsulate(
      msg.kemCiphertext,
      myKeys.secretKeyBase64
    );

    // 2) AES decrypt
    const plaintext = await aesDecrypt(
      msg.ciphertext,
      msg.iv,
      sharedSecretBase64
    );

    return plaintext;
  } catch (err) {
    console.error("❌ Failed to decrypt message:", err);
    return null;
  }
}