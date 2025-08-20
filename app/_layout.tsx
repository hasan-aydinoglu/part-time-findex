import { Slot, usePathname, useRouter } from "expo-router";
import * as React from "react";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { getSession } from "../lib/auth";

/**
 * Basit auth gate:
 * - Oturum YOKSA: (tabs) yollarına girmek isterse /login'e atar
 * - Oturum VARSA: /login'deyse ana sayfaya (/) atar
 */
export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      const sess = await getSession();
      setHasSession(!!sess);
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!ready || hasSession === null) return;
    const inAuth = pathname?.startsWith("/login");
    const inTabs = pathname === "/" || pathname?.startsWith("/(tabs)");

    if (!hasSession && inTabs) {
      router.replace("/login");
    } else if (hasSession && inAuth) {
      router.replace("/");
    }
  }, [ready, hasSession, pathname]);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0f172a", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
        <Text style={{ color: "white", marginTop: 12 }}>Yükleniyor…</Text>
      </View>
    );
  }

  return <Slot />;
}
