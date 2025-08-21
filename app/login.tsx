// app/login.tsx
import { useRouter } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { setSession } from "./_layout";

export default function LoginScreen() {
  const router = useRouter();

  const handleLogin = () => {
    setSession(true);     // oturumu aç
    router.replace("/");  // index.tsx'e geç
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Login</Text>
      <Button title="Giriş Yap" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", justifyContent: "center", alignItems: "center", padding: 16 },
  title: { fontSize: 22, color: "white", marginBottom: 16 },
});
