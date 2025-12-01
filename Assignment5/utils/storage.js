// utils/storage.js
// Secure IndexedDB for PQC secret key + local sent messages

const DB_NAME = "pqcSecureDB";
const DB_VERSION = 2;           // bump version for auto-upgrade
const KEYS_STORE = "keys";
const SENT_STORE = "sentMessages";
const SECRET_KEY_ID = "pqcSecretKey";

// ----------------------------
// OPEN DB WITH AUTO-UPGRADE
// ----------------------------
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = request.result;

      console.log("🔧 IndexedDB upgrade triggered:", event.oldVersion, "→", event.newVersion);

      // Create missing stores safely
      if (!db.objectStoreNames.contains(KEYS_STORE)) {
        console.log("📌 Creating store:", KEYS_STORE);
        db.createObjectStore(KEYS_STORE);
      }

      if (!db.objectStoreNames.contains(SENT_STORE)) {
        console.log("📌 Creating store:", SENT_STORE);
        db.createObjectStore(SENT_STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ----------------------------
// SAVE PQC SECRET KEY
// ----------------------------
export async function saveSecretKey(secretKeyBase64) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(KEYS_STORE, "readwrite");
    tx.objectStore(KEYS_STORE).put(secretKeyBase64, SECRET_KEY_ID);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

// ----------------------------
// LOAD PQC SECRET KEY
// ----------------------------
export async function loadSecretKey() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(KEYS_STORE, "readonly");
    const req = tx.objectStore(KEYS_STORE).get(SECRET_KEY_ID);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

// ----------------------------
// SAVE OUTGOING PLAINTEXT MSG
// ----------------------------
export async function saveSentMessage(obj) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SENT_STORE, "readwrite");
    tx.objectStore(SENT_STORE).put(obj);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

// ----------------------------
// LOAD ALL SENT MESSAGES
// ----------------------------
export async function loadSentMessages(sender, receiver) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(SENT_STORE, "readonly");
    const store = tx.objectStore(SENT_STORE);

    const result = [];
    const cursor = store.openCursor();

    cursor.onsuccess = (e) => {
      const c = e.target.result;
      if (c) {
        const msg = c.value;
        if (msg.sender === sender && msg.receiver === receiver) {
          result.push(msg);
        }
        c.continue();
      } else {
        resolve(result);
      }
    };

    cursor.onerror = () => reject(cursor.error);
  });
}