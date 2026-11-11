# Vault — offline password viewer

A single HTML file (`index.html`) that decrypts the passwords the old Home
Allowance app saved, using only your **master key**. No login, no server, no
internet: it works opened straight from your computer.

## Use it

1. **Get your vault file once.** In the Firebase Console, open
   *Realtime Database → Data*, click the **⋮** menu, then **Export JSON**.
   (Exporting the whole database is fine; the page finds the saved passwords
   inside it and ignores everything else.)
2. Open `index.html` in Chrome, choose the exported `.json` file, enter your
   master key, then click **Unlock**.

**Optional, master key only:** paste the exported JSON between
`<script type="application/json" id="vault-data">` and `</script>` in
`index.html`. The file picker disappears and the page asks only for the key.
Keep that copy private: it holds your encrypted passwords, which could be
brute-forced offline if the master key is weak.

## Security

- Decryption happens in the browser (WebCrypto), compatible with the CryptoJS
  AES ciphertext the app wrote. Verified against CryptoJS output.
- A Content-Security-Policy allows only this page's own script (pinned by
  SHA-256) and blocks **all** network connections.
- The key and decrypted passwords live in memory only. Nothing is saved.
  Locks after 5 minutes idle (or 1 minute in a background tab); copied values
  are cleared from the clipboard after 30 seconds.

## Editing

Change `src/main.js` or `src/template.html`, then run `node build.mjs` to
regenerate `index.html` and its CSP hash.
