"use client";
import InvoiceEditor from "../components/invoice-editor";
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import Tracker from "@openreplay/tracker";

const tracker = new Tracker({
  projectKey: "6gJ2SR6RHbh6HTp9fZMY",
  __DISABLE_SECURE_MODE: true,
});

const firebaseConfig = {
  apiKey: "AIzaSyCMS3Oq79l7dFXG_cqdWdl8YLsf8jh2SHw",
  authDomain: "freebillgenerator-df99c.firebaseapp.com",
  projectId: "freebillgenerator-df99c",
  storageBucket: "freebillgenerator-df99c.firebasestorage.app",
  messagingSenderId: "238687233245",
  appId: "1:238687233245:web:4d37e3f4ccb8014f096734",
  measurementId: "G-CZF00W5T5R",
};

const app = initializeApp(firebaseConfig);
isSupported().then((isSupported) => (isSupported ? getAnalytics(app) : null));
tracker.start();

export default function Page() {
  return <InvoiceEditor />;
}
