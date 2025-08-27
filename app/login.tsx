import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { setSession } from "./_layout";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const canSubmit = email.trim().length > 0 && pass.length >= 4;

  const handleLogin = () => {
    if (!canSubmit) return;
    setSession(true);
    router.replace("/"); // home
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Giriş Yap</Text>

      <Text style={s.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="ornek@mail.com"
        placeholderTextColor="#6b7280"
        keyboardType="email-address"
        autoCapitalize="none"
        style={s.input}
      />

      <Text style={s.label}>Şifre</Text>
      <TextInput
        value={pass}
        onChangeText={setPass}
        placeholder="••••••••"
        placeholderTextColor="#6b7280"
        secureTextEntry
        style={s.input}
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={!canSubmit}
        style={[s.primaryBtn, !canSubmit && { opacity: 0.5 }]}
      >
        <Text style={s.primaryText}>Giriş Yap</Text>
      </TouchableOpacity>

      {/* Karşılıklı link */}
      <TouchableOpacity onPress={() => router.replace("/signup")} style={s.linkWrap}>
        <Text style={s.linkText}>Hesabın yok mu? <Text style={s.linkStrong}>Üye ol</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", padding: 20, justifyContent: "center" },
  title: { color: "white", fontSize: 24, fontWeight: "700", marginBottom: 24, textAlign: "center" },
  label: { color: "#cbd5e1", marginBottom: 6, marginTop: 8 },
  input: {
    backgroundColor: "#111827", color: "white", borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: "#1f2937", marginBottom: 12,
  },
  primaryBtn: { backgroundColor: "#2563eb", paddingVertical: 14, borderRadius: 12, alignItems: "center", marginTop: 8 },
  primaryText: { color: "white", fontWeight: "700", fontSize: 16 },
  linkWrap: { marginTop: 16, alignItems: "center" },
  linkText: { color: "#9ca3af" },
  linkStrong: { color: "#93c5fd", fontWeight: "700" },
});
