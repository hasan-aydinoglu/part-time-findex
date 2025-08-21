// app/_layout.tsx
import { Redirect, Slot, useSegments } from "expo-router";
import React from "react";

/** Geçici (in-memory) oturum durumu. Kalıcı istersen AsyncStorage'a çevirebiliriz. */
let __SESSION = false;
export const setSession = (v: boolean) => { __SESSION = v; };
export const getSession = () => __SESSION;

export default function RootLayout() {
  const segments = useSegments();               // ["login"] veya ["profile"] gibi
  const authed = getSession();
  const first = segments[0];                    // ilk segment

  // Oturum YOKSA: login dışındaki sayfalara girilirse /login'e yönlendir
  if (!authed) {
    if (first === "login") {
      return <Slot />;                          // /login'deyiz, sayfayı göster
    }
    return <Redirect href="/login" />;          // başka sayfadaysak login'e
  }

  // Oturum VARSA: /login'e gelinirse ana sayfaya yönlendir
  if (authed && first === "login") {
    return <Redirect href="/" />;
  }

  // Normal akış: sayfaları göster
  return <Slot />;
}
