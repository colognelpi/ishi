# Firebase Setup, Email Notifications & Deployment Guide

This project is already provisioned with Cloud Firestore, Firebase Authentication (Google Sign-In), and hardened Firestore Security Rules (`firestore.rules`).

---

## 1. Personalization & Photos (`src/config/personalization.ts`)
- Edit `creatorName`, `recipientName`, `websiteTitle`, `invitationId`, `backgroundMusicUrl`, and `copy` (including the love letter) directly in `src/config/personalization.ts`.
- To replace photos permanently in code, put your JPG/PNG files in `public/photos/` and update `imageUrl` in `memoryPairs` (6 pairs) and `galleryPhotos` (10 slots).
- You can also upload/replace photos and edit captions interactively right in the browser using the **Customize Photos** button in Memory Lane and **Customize Album** in Our Little Gallery.

---

## 2. How Firebase Is Connected (For Reference or Self-Hosting)
1. **Create a Firebase Project**: Open [Firebase Console](https://console.firebase.google.com/) and create a project (or use the provisioned project in `firebase-applet-config.json`).
2. **Register Web App**: Project Settings -> Your apps -> Web (`</>`) -> copy the config object.
3. **Enable Cloud Firestore**: Build -> Firestore Database -> Create database.
4. **Enable Firebase Authentication**: Build -> Authentication -> Sign-in method -> Enable **Google**.
5. **Create Ishaac's Admin Account**:
   - Visit `/admin` on your site and sign in with your Google account.
   - To authorize your account if using a different Google email than the bootstrapped email in `firestore.rules`, copy the UID shown on `/admin` and create a document in Firestore at:
     `admins/{YOUR_UID}` with field `{ role: "admin" }`.
6. **Connect Firebase to React**: The app reads `firebase-applet-config.json` in `src/firebase.ts` using `getFirestore(app, firebaseConfig.firestoreDatabaseId)` and `getAuth(app)`.
7. **Deploy Security Rules**: `firestore.rules` is already configured and deployed. If you customize `firestore.rules` later, run `firebase deploy --only firestore:rules`.

---

## 3. Optional Email Notifications (`functions/index.js`)
Ready-to-deploy Cloud Function code is included in `functions/index.js`:
- Sends `"Someone just said YES! Your little story might be beginning."` when `answer === "YES"`.
- Sends `"Your invitation has received a response."` when `answer === "NO"`.

To enable email notifications:
1. Upgrade your Firebase project to the **Blaze** plan (required for Cloud Functions outbound network/SMTP).
2. Install Firebase CLI and function dependencies:
   ```bash
   cd functions && npm install && cd ..
   ```
3. Set your SMTP secrets (e.g., Gmail App Password or Resend/Mailgun SMTP):
   ```bash
   firebase functions:secrets:set SMTP_HOST
   firebase functions:secrets:set SMTP_USER
   firebase functions:secrets:set SMTP_PASS
   firebase functions:secrets:set NOTIFY_EMAIL
   ```
4. Deploy the Cloud Function:
   ```bash
   firebase deploy --only functions
   ```

---

## 4. Deploying & Testing Before Sharing with Irish
1. Build the production bundle: `npm run build`.
2. Deploy to Firebase Hosting (ensure `firebase.json` rewrites `**` to `/index.html` so `/admin` loads cleanly) or share via AI Studio.
3. Open `/` and walk through the full flow (Catch My Heart -> Memory Lane -> Gallery -> Confession).
4. Open `/admin` in a separate tab (or another device), sign in with Google, and confirm your test response appears in real time.
5. Click **Reset Test Submission** in `/admin` so the invitation returns to `"Still waiting for a little answer..."` before sending the link to Irish!
