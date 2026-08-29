// ============================================================
// Shared read-only data helpers for the public site.
// Public pages import from here so that everything edited in admin.html
// (menu items, meal pricing, gallery, opening hours, contact info) shows
// up on the live site automatically — no code edits needed.
//
// Every function fails soft: if Firestore isn't reachable, or the config
// in firebase-config.js is still the placeholder, these just return an
// empty result and the calling page falls back to its own static HTML
// (see the fallback logic at the bottom of rangoli-buffet.html).
// ============================================================

import { db } from './firebase-config.js';
import {
  collection, query, orderBy, getDocs, doc, getDoc, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Active buffet menu items (dish cards), in display order.
export async function getMenuItems() {
  try {
    const q = query(collection(db, 'menuItems'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(m => m.active !== false);
  } catch (err) {
    console.error('Could not load menu items:', err);
    return [];
  }
}

// The 4 meal-period pricing cards (Dinner, Lunch cum Hi-Tea, Sunday Hi-Tea, Brunch).
export async function getMealPricing() {
  try {
    const q = query(collection(db, 'mealPricing'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(m => m.active !== false);
  } catch (err) {
    console.error('Could not load meal pricing:', err);
    return [];
  }
}

// Gallery photos (image URL + caption), in display order.
export async function getGalleryImages() {
  try {
    const q = query(collection(db, 'gallery'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('Could not load gallery:', err);
    return [];
  }
}

// Opening hours + contact info doc. Returns null if it hasn't been saved
// yet from admin.html's Settings tab — callers fall back to the values
// already hard-coded in each page's footer/JSON-LD.
export async function getSiteSettings() {
  try {
    const snap = await getDoc(doc(db, 'settings', 'site'));
    if (snap.exists()) return snap.data();
  } catch (err) {
    console.error('Could not load site settings:', err);
  }
  return null;
}

// Writes a new booking/enquiry from the public "Plan Your Visit" form.
// Always created with status 'pending' — only the logged-in admin can
// change that afterward (enforced by Firestore rules, see ADMIN-SETUP.md).
export async function submitBooking(data) {
  await addDoc(collection(db, 'bookings'), {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}
