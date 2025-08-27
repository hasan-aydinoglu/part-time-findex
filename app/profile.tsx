import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";


type Profile = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  about: string;
  skills: string[]; 
  cvUri?: string;   
  cvName?: string;
  cvSize?: number; 
};

const PROFILE_KEY = "user_profile_v1";


export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile>({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    about: "",
    skills: [],
  });
  const [skillsInput, setSkillsInput] = useState("");

  const canSave = useMemo(() => {
    return profile.fullName.trim() && profile.email.trim();
  }, [profile]);

 
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(PROFILE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Profile;
          setProfile(parsed);
          setSkillsInput(parsed.skills?.join(", ") ?? "");
        }
      } catch {
       
      }
    })();
  }, []);

  const handlePickCV = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf"],
        multiple: false,
        copyToCacheDirectory: true,
      });
      if (res.canceled) return;

      const file = res.assets[0];
    
      const target = FileSystem.documentDirectory + `cv_${Date.now()}.pdf`;
      await FileSystem.copyAsync({ from: file.uri, to: target });

      setProfile((p) => ({
        ...p,
        cvUri: target,
        cvName: file.name ?? "cv.pdf",
        cvSize: file.size ?? undefined,
      }));
      Alert.alert("CV Yüklendi", file.name ?? "cv.pdf");
    } catch (e) {
      Alert.alert("Hata", "CV seçilirken bir hata oluştu.");
    }
  };

  const handleRemoveCV = async () => {
    if (!profile.cvUri) return;
    try {
      const info = await FileSystem.getInfoAsync(profile.cvUri);
      if (info.exists) {
        await FileSystem.deleteAsync(profile.cvUri, { idempotent: true });
      }
    } catch {}
    setProfile((p) => ({ ...p, cvUri: undefined, cvName: undefined, cvSize: undefined }));
  };

  const handleSave = async () => {
    try {
      const cleanSkills =
        skillsInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean) ?? [];

      const payload: Profile = { ...profile, skills: cleanSkills };
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(payload));
      setProfile(payload);
      Alert.alert("Kaydedildi", "Profil bilgileriniz kaydedildi.");
    } catch {
      Alert.alert("Hata", "Profil kaydedilemedi.");
    }
  };

  
  const handleUploadToServer = async () => {
    if (!profile.cvUri) {
      Alert.alert("Uyarı", "Lütfen önce bir CV yükleyin.");
      return;
    }

    try {
      const form = new FormData();
      form.append("fullName", profile.fullName);
      form.append("email", profile.email);
      form.append("phone", profile.phone);
      form.append("location", profile.location);
      form.append("about", profile.about);
      form.append("skills", JSON.stringify(profile.skills ?? []));

     
      form.append("cv", {
      
        uri: profile.cvUri,
        name: profile.cvName ?? "cv.pdf",
        type: "application/pdf",
      });


      Alert.alert("Demo", "Burada fetch ile sunucuya gönderebilirsin.");
    } catch (e: any) {
      Alert.alert("Hata", e?.message ?? "Yükleme sırasında sorun oluştu.");
    }
  };

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Text style={s.header}>👤 Profil</Text>
      <Text style={s.sub}>Bilgilerini doldur, CV’ni yükle ve kaydet.</Text>

      
      <Section title="Genel Bilgiler">
        <LabeledInput
          label="Ad Soyad *"
          value={profile.fullName}
          onChangeText={(t) => setProfile((p) => ({ ...p, fullName: t }))}
        />
        <LabeledInput
          label="E-posta *"
          keyboardType="email-address"
          autoCapitalize="none"
          value={profile.email}
          onChangeText={(t) => setProfile((p) => ({ ...p, email: t }))}
        />
        <LabeledInput
          label="Telefon"
          keyboardType="phone-pad"
          value={profile.phone}
          onChangeText={(t) => setProfile((p) => ({ ...p, phone: t }))}
        />
        <LabeledInput
          label="Konum"
          value={profile.location}
          onChangeText={(t) => setProfile((p) => ({ ...p, location: t }))}
        />
        <LabeledInput
          label="Hakkımda"
          multiline
          value={profile.about}
          onChangeText={(t) => setProfile((p) => ({ ...p, about: t }))}
        />
        <LabeledInput
          label="Beceriler (virgülle ayır)"
          placeholder="Barista, Kasa, Sosyal Medya..."
          value={skillsInput}
          onChangeText={setSkillsInput}
        />
        {!!profile.skills?.length && (
          <View style={s.tagsRow}>
            {profile.skills.map((sk) => (
              <View key={sk} style={s.tag}>
                <Text style={s.tagText}>{sk}</Text>
              </View>
            ))}
          </View>
        )}
      </Section>

      {/* CV */}
      <Section title="CV (PDF)">
        {profile.cvUri ? (
          <View style={s.cvBox}>
            <Ionicons name="document-text-outline" size={22} color="#93c5fd" />
            <View style={{ flex: 1 }}>
              <Text style={s.cvName}>{profile.cvName ?? "cv.pdf"}</Text>
              {!!profile.cvSize && (
                <Text style={s.cvSub}>{prettyBytes(profile.cvSize)}</Text>
              )}
            </View>
            <TouchableOpacity onPress={handleRemoveCV} style={s.cvBtnDanger}>
              <Ionicons name="trash-outline" size={18} color="#fecaca" />
              <Text style={s.cvBtnDangerText}>Kaldır</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={handlePickCV} style={s.cvBtn}>
            <Ionicons name="cloud-upload-outline" size={18} color="#93c5fd" />
            <Text style={s.cvBtnText}>PDF Yükle</Text>
          </TouchableOpacity>
        )}
      </Section>

      {/* Actions */}
      <View style={s.actions}>
        <TouchableOpacity
          onPress={handleSave}
          disabled={!canSave}
          style={[s.primaryBtn, !canSave && { opacity: 0.5 }]}
        >
          <Text style={s.primaryText}>Kaydet</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleUploadToServer} style={s.secondaryBtn}>
          <Text style={s.secondaryText}>Sunucuya Gönder (Demo)</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      <View style={{ gap: 10 }}>{children}</View>
    </View>
  );
}

function LabeledInput(props: React.ComponentProps<typeof TextInput> & { label: string }) {
  const { label, style, ...rest } = props;
  return (
    <View>
      <Text style={s.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#6b7280"
        style={[s.input, style]}
        {...rest}
      />
    </View>
  );
}

function prettyBytes(bytes?: number) {
  if (!bytes && bytes !== 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  let v = bytes;
  let u = 0;
  while (v >= 1024 && u < units.length - 1) {
    v /= 1024;
    u++;
  }
  return `${v.toFixed(1)} ${units[u]}`;
}


const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0f172a" },
  header: { color: "white", fontSize: 22, fontWeight: "700" },
  sub: { color: "#9ca3af", marginTop: 6, marginBottom: 16 },

  section: {
    backgroundColor: "#0b1220",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  sectionTitle: { color: "#e5e7eb", fontWeight: "700", marginBottom: 10 },

  label: { color: "#cbd5e1", marginBottom: 6 },
  input: {
    backgroundColor: "#111827",
    color: "white",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#1f2937",
  },

  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  tag: {
    backgroundColor: "rgba(59,130,246,0.12)",
    borderColor: "rgba(59,130,246,0.3)",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: { color: "#93c5fd", fontSize: 12 },

  cvBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 12,
    padding: 12,
  },
  cvName: { color: "#e5e7eb", fontWeight: "600" },
  cvSub: { color: "#9ca3af", marginTop: 2 },
  cvBtn: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(59,130,246,0.12)",
    borderColor: "rgba(59,130,246,0.3)",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 12,
  },
  cvBtnText: { color: "#93c5fd", fontWeight: "700" },
  cvBtnDanger: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    backgroundColor: "rgba(239,68,68,0.12)",
    borderColor: "rgba(239,68,68,0.3)",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  cvBtnDangerText: { color: "#fecaca", fontWeight: "700" },

  actions: { gap: 10, marginTop: 8 },
  primaryBtn: {
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryText: { color: "white", fontWeight: "700", fontSize: 16 },
  secondaryBtn: {
    backgroundColor: "#0b1220",
    borderWidth: 1,
    borderColor: "#1f2937",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryText: { color: "#cbd5e1", fontWeight: "600" },
});
