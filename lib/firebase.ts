import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Firebase 앱 초기화 (이미 초기화된 인스턴스가 있다면 재사용)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firestore 초기화
const db = getFirestore(app);

// Auth 초기화
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Analytics는 브라우저(클라이언트) 환경에서만 작동하도록 방어 코드 적용
let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, analytics, db, auth, googleProvider };

