// ============================================================
// FIREBASE CONFIG — replace with YOUR project's values.
// Find these in the Firebase Console:
// Project Settings (gear icon) > General > Your apps > Web app > SDK setup and config
//
// These values are safe to be public — they identify your project,
// they are not secret keys. Security is enforced by Firestore rules
// (see ADMIN-SETUP.md), not by hiding this file.
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ⚠️ PLACEHOLDER VALUES — this needs its own Firebase project. Create one at
// console.firebase.google.com (e.g. "arena-karachi"), enable Firestore +
// Authentication (Email/Password), then paste that project's config values
// in below. Full walkthrough in ADMIN-SETUP.md.
const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_PROJECT.firebaseapp.com",
  projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "REPLACE_WITH_YOUR_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
// Note: no Firebase Storage / Cloudinary wired up here — gallery photos and
// menu-item photos are added by pasting an image URL in the admin panel
// (e.g. a link to a photo already hosted somewhere), not by uploading files.
// This avoids needing Firebase's paid Blaze plan or a separate Cloudinary
// account just to get the admin panel working. If Arena wants direct file
// uploads later, Lauren's site (lauren_site_v2) shows the Cloudinary pattern
// to copy in.

// ------------------------------------------------------------
// Menu categories, opening hours, and gallery are all editable from
// admin.html and live in Firestore, so nobody has to touch this file or
// any HTML/CSS to make everyday changes (new menu item, price change,
// new opening hours, etc).
//
// The constants below are only a ONE-TIME fallback: the first time the
// site loads and no settings/hours document exists yet in Firestore, the
// admin Settings tab pre-fills its form with these values, and the public
// pages fall back to the values already hard-coded in the HTML. After the
// first save in admin.html, Firestore takes over.
// ------------------------------------------------------------
export const MEAL_PERIODS = [
  { id: "dinner", label: "Rangoli Dinner Buffet" },
  { id: "lunch-hitea", label: "Lunch cum Hi-Tea Buffet" },
  { id: "sunday-hitea", label: "Sunday Hi-Tea Buffet" },
  { id: "brunch", label: "Weekend Brunch" },
];
