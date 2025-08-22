import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { setSession } from "./_layout"; // önceki layout'taki in-memory session

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);

  const canSubmit = email.trim().length > 0 && pass.length >= 4;

  const handleLogin = () => {
    if (!canSubmit) return;
    setSession(true);      // demo oturum
    router.replace("/");   // index.tsx'e geç
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
      <View style={s.passwordRow}>
        <TextInput
          value={pass}
          onChangeText={setPass}
          placeholder="••••••••"
          placeholderTextColor="#6b7280"
          secureTextEntry={!showPass}
          style={[s.input, { flex: 1, marginBottom: 0 }]}
        />
        <TouchableOpacity onPress={() => setShowPass((v) => !v)} style={s.showBtn}>
          <Text style={{ color: "#93c5fd" }}>{showPass ? "Gizle" : "Göster"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        disabled={!canSubmit}
        style={[s.primaryBtn, !canSubmit && { opacity: 0.5 }]}
      >
        <Text style={s.primaryText}>Giriş Yap</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signup")} style={s.secondaryBtn}>
        <Text style={s.secondaryText}>Üye Ol</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => alert("Demo: Şifre sıfırlama linki gönderildi.")}>
        <Text style={s.forgotText}>Şifremi Unuttum</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: "#0f172a", padding: 20, justifyContent: "center",
  },
  title: {
    color: "white", fontSize: 24, fontWeight: "700", marginBottom: 24, textAlign: "center",
  },
  label: { color: "#cbd5e1", marginBottom: 6, marginTop: 8 },
  input: {
    backgroundColor: "#111827", color: "white", borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: "#1f2937",
    marginBottom: 12,
  },
  passwordRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  showBtn: {
    paddingHorizontal: 12, paddingVertical: 12, borderRadius: 10, backgroundColor: "#0b1220",
    borderWidth: 1, borderColor: "#1f2937",
  },
  primaryBtn: {
    backgroundColor: "#2563eb", paddingVertical: 14, borderRadius: 12, alignItems: "center",
    marginTop: 8,
  },
  primaryText: { color: "white", fontWeight: "700", fontSize: 16 },
  secondaryBtn: {
    paddingVertical: 14, borderRadius: 12, alignItems: "center",
    marginTop: 12, borderWidth: 1, borderColor: "#2563eb",
  },
  secondaryText: { color: "#93c5fd", fontWeight: "700", fontSize: 16 },
  forgotText: { color: "#9ca3af", textAlign: "center", marginTop: 14 },
});
