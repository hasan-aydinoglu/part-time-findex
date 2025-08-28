// app/job/[id].tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getJobById } from "../lib/jobs";

const PROFILE_KEY = "user_profile_v1";

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const job = useMemo(() => (id ? getJobById(String(id)) : undefined), [id]);

  const [loadingApply, setLoadingApply] = useState(false);

  if (!job) {
    return (
      <View style={[s.screen, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: "white", marginBottom: 12 }}>İlan bulunamadı.</Text>
        <TouchableOpacity onPress={() => router.back()} style={s.secondaryBtn}>
          <Text style={s.secondaryText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleQuickApply = async () => {
    try {
      setLoadingApply(true);

      // Profilden CV oku
      const raw = await AsyncStorage.getItem(PROFILE_KEY);
      const profile = raw ? JSON.parse(raw) : null;

      if (!profile || !profile.cvUri) {
        Alert.alert(
          "CV Bulunamadı",
          "Hızlı başvuru için önce Profil sayfasından PDF CV yükleyin.",
          [
            { text: "İptal", style: "cancel" },
            { text: "Profile Git", onPress: () => router.push("/profile") },
          ]
        );
        return;
      }

      // DEMO: FormData ile örnek gönderim (API adresini kendine göre değiştir)
      // const form = new FormData();
      // form.append("jobId", String(job.id));
      // form.append("title", job.title);
      // form.append("company", job.company);
      // form.append("fullName", profile.fullName ?? "");
      // form.append("email", profile.email ?? "");
      // form.append("phone", profile.phone ?? "");
      // form.append("cv", {
      //   // @ts-ignore RN file shape
      //   uri: profile.cvUri,
      //   name: profile.cvName ?? "cv.pdf",
      //   type: "application/pdf",
      // });
      // const res = await fetch("https://api.ornek.com/apply", {
      //   method: "POST",
      //   headers: { "Content-Type": "multipart/form-data" },
      //   body: form,
      // });
      // if (!res.ok) throw new Error("Başvuru gönderilemedi");

      // DEMO sonuç:
      await new Promise((r) => setTimeout(r, 900));
      Alert.alert("Başvuru Alındı ✅", `"${job.title}" pozisyonu için başvurun gönderildi.`);
      router.back();
    } catch (e: any) {
      Alert.alert("Hata", e?.message ?? "Başvuru sırasında hata oluştu.");
    } finally {
      setLoadingApply(false);
    }
  };

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <View style={s.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="chevron-back" size={20} color="#e5e7eb" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>İlan Detayı</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={s.card}>
        <View style={s.cardHeader}>
          <View style={s.logoWrap}>
            {job.logo ? (
              <Image source={{ uri: job.logo }} style={s.logo} />
            ) : (
              <Ionicons name="briefcase" size={20} color="#94a3b8" />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.jobTitle}>{job.title}</Text>
            <Text style={s.company}>{job.company}</Text>
          </View>
        </View>

        <View style={s.metaRow}>
          <View style={s.metaPill}>
            <Ionicons name="location-outline" size={14} color="#93c5fd" />
            <Text style={s.metaText}>{job.location}</Text>
          </View>
          <View style={s.metaPill}>
            <MaterialCommunityIcons name="briefcase-clock" size={14} color="#fef3c7" />
            <Text style={s.metaText}>{job.type}</Text>
          </View>
          <View style={s.metaPill}>
            <Ionicons name="time-outline" size={14} color="#fca5a5" />
            <Text style={s.metaText}>{job.postedAt}</Text>
          </View>
        </View>

        {!!job.salary && (
          <View style={[s.badgePay, { alignSelf: "flex-start", marginTop: 6 }]}>
            <Ionicons name="cash-outline" size={14} color="#065f46" />
            <Text style={s.badgePayText}>{job.salary}</Text>
          </View>
        )}

        <Text style={s.desc}>{job.desc}</Text>

        <View style={s.tagRow}>
          {job.tags.map((t) => (
            <View key={t} style={s.tag}>
              <Text style={s.tagText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        onPress={handleQuickApply}
        disabled={loadingApply}
        style={[s.applyBtn, loadingApply && { opacity: 0.6 }]}
      >
        {loadingApply ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={s.applyText}>⚡ Hızlı Başvur (CV ile)</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0f172a" },

  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  backBtn: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { color: "#e5e7eb", fontWeight: "700", fontSize: 16 },

  card: {
    backgroundColor: "#0b1220",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 12 },
  logoWrap: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: "#111827", alignItems: "center", justifyContent: "center", overflow: "hidden",
  },
  logo: { width: 40, height: 40 },

  jobTitle: { color: "#e5e7eb", fontSize: 18, fontWeight: "700" },
  company: { color: "#93a1b2", fontSize: 13, marginTop: 2 },

  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6, marginBottom: 8 },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#0f172a",
    borderColor: "#1f2937",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  metaText: { color: "#cbd5e1", fontSize: 12 },

  badgePay: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "rgba(16,185,129,0.12)",
    borderColor: "rgba(16,185,129,0.3)",
    borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999,
  },
  badgePayText: { color: "#34d399", fontSize: 12, fontWeight: "700" },

  desc: { color: "#a3a3a3", marginTop: 10, lineHeight: 20 },

  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 12 },
  tag: {
    backgroundColor: "rgba(59,130,246,0.12)",
    borderColor: "rgba(59,130,246,0.3)",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: { color: "#93c5fd", fontSize: 12 },

  applyBtn: {
    marginTop: 14, backgroundColor: "#2563eb", paddingVertical: 14, borderRadius: 12, alignItems: "center",
  },
  applyText: { color: "white", fontWeight: "700", fontSize: 16 },
});
