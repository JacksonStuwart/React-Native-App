# Vault (read-only viewer for the old app's passwords)

A single static page (`index.html`) that signs in to the `homeallowance-ff1fa`
Firebase project, reads `Users/{uid}/keys` from the Realtime Database, and
decrypts each entry **in the browser** with the master key you type. No
libraries, no third-party scripts; decryption uses WebCrypto in a format
compatible with the CryptoJS AES ciphertext the React Native app wrote.

- Nothing is stored: the login token, master key and decrypted values live in
  memory only. Reloading the tab signs you out; it auto-locks after 5 minutes idle.
- `vercel.json` sets a strict Content-Security-Policy that only allows this
  page's own script (pinned by SHA-256) and only talks to Firebase Auth and the
  project's Realtime Database.

Open `index.html` directly, or deploy this folder to any static host.
After editing `src/`, run `node build.mjs` to regenerate `index.html` and the CSP hash.
