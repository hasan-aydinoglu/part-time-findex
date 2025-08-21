import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Job = {
  id: string;
  title: string;
  company: string;
  logo?: string;        
  location: string;
  type: "Part-time" | "Remote" | "Hybrid" | "On-site";
  salary?: string;
  postedAt: string;     
  tags: string[];
  desc: string;
};

const MOCK_JOBS: Job[] = [
  {
    id: "1",
    title: "Barista",
    company: "Moonbeam Coffee",
    logo:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=256&q=80&auto=format&fit=crop",
    location: "Kadıköy, İstanbul",
    type: "On-site",
    salary: "₺220 - ₺260 /saat",
    postedAt: "2s önce",
    tags: ["Hafta sonu", "Öğrenci", "Esnek"],
    desc: "Yoğun saatlerde baristalık, kasa ve temel hazırlık işleri.",
  },
  {
    id: "2",
    title: "Kurye (E-Scooter)",
    company: "HızlıGetir",
    logo:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=256&q=80&auto=format&fit=crop",
    location: "Üsküdar, İstanbul",
    type: "Hybrid",
    salary: "₺350 - ₺500 /gün",
    postedAt: "Dün",
    tags: ["Ehliyet Yok", "Gündüz", "Prim"],
    desc: "Kısa mesafe e-scooter ile teslimatlar. Ekipman sağlanır.",
  },
  {
    id: "3",
    title: "Sosyal Medya Asistanı",
    company: "Nova Digital",
    logo:
      "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=256&q=80&auto=format&fit=crop",
    location: "Remote",
    type: "Remote",
    salary: "₺200 - ₺240 /saat",
    postedAt: "3g önce",
    tags: ["Evden", "Video", "Canva"],
    desc: "Reels/TikTok kurguları, basit görsel hazırlama, metin yazımı.",
  },
  {
    id: "4",
    title: "Kasiyer (Akşam)",
    company: "Mini Market",
    logo:
      "https://images.unsplash.com/photo-1556745753-b2904692b3cd?w=256&q=80&auto=format&fit=crop",
    location: "Beşiktaş, İstanbul",
    type: "On-site",
    salary: "₺230 /saat",
    postedAt: "1g önce",
    tags: ["Akşam", "Hafta içi", "Öğrenci"],
    desc: "Kasada müşteri karşılaması, reyon düzeni ve stok takibi.",
  },
];

const CATEGORIES = ["Hepsi", "On-site", "Remote", "Hybrid", "Part-time"];

export default function HomeScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("Hepsi");
  const [refreshing, setRefreshing] = useState(false);

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_JOBS.filter((j) => {
      const byCat = activeCat === "Hepsi" ? true : j.type === (activeCat as Job["type"]);
      const byQuery =
        !q ||
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.tags.some((t) => t.toLowerCase().includes(q));
      return byCat && byQuery;
    });
  }, [query, activeCat]);

  const onRefresh = () => {
    setRefreshing(true);
    // burada API yenilemesi yapılabilir
    setTimeout(() => setRefreshing(false), 800);
  };

  const renderJob = ({ item }: { item: Job }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={() => {
        // İleride detay sayfasına gidebilirsin: router.push(`/job/${item.id}`)
      }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.logoWrap}>
          {item.logo ? (
            <Image source={{ uri: item.logo }} style={styles.logo} />
          ) : (
            <Ionicons name="briefcase" size={20} color="#94a3b8" />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.company}>{item.company}</Text>
        </View>
        {item.salary ? (
          <View style={styles.badgePay}>
            <Ionicons name="cash-outline" size={14} color="#065f46" />
            <Text style={styles.badgePayText}>{item.salary}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaPill}>
          <Ionicons name="location-outline" size={14} color="#93c5fd" />
          <Text style={styles.metaText}>{item.location}</Text>
        </View>
        <View style={styles.metaPill}>
          <MaterialCommunityIcons name="briefcase-clock" size={14} color="#fef3c7" />
          <Text style={styles.metaText}>{item.type}</Text>
        </View>
        <View style={styles.metaPill}>
          <Ionicons name="time-outline" size={14} color="#fca5a5" />
          <Text style={styles.metaText}>{item.postedAt}</Text>
        </View>
      </View>

      <Text numberOfLines={2} style={styles.desc}>
        {item.desc}
      </Text>

      <View style={styles.tagRow}>
        {item.tags.map((t) => (
          <View key={t} style={styles.tag}>
            <Text style={styles.tagText}>{t}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      {/* Üst Başlık + Profil kısayolu */}
      <View style={styles.header}>
        <View>
          <Text style={styles.hi}>Merhaba 👋</Text>
          <Text style={styles.subtitle}>Bugün senin için {MOCK_JOBS.length} ilan bulduk</Text>
        </View>
        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => router.push("/profile")}
        >
          <Ionicons name="person-circle-outline" size={28} color="#e5e7eb" />
        </TouchableOpacity>
      </View>

      {/* Arama kutusu */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color="#94a3b8" />
        <TextInput
          placeholder="Pozisyon, şirket, konum ara…"
          placeholderTextColor="#94a3b8"
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={18} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Kategori filtreleri */}
      <FlatList
        data={CATEGORIES}
        horizontal
        keyExtractor={(i) => i}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        style={{ marginBottom: 8 }}
        renderItem={({ item }) => {
          const active = item === activeCat;
          return (
            <TouchableOpacity
              onPress={() => setActiveCat(item)}
              style={[styles.catPill, active && styles.catPillActive]}
            >
              <Text style={[styles.catText, active && styles.catTextActive]}>{item}</Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* İlan listesi */}
      <FlatList
        data={data}
        keyExtractor={(it) => it.id}
        renderItem={renderJob}
        contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
        }
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 48 }}>
            <Ionicons name="search-outline" size={28} color="#64748b" />
            <Text style={{ color: "#94a3b8", marginTop: 8 }}>Sonuç bulunamadı</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0f172a" },
  header: {
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hi: { color: "#e5e7eb", fontSize: 20, fontWeight: "600" },
  subtitle: { color: "#9ca3af", marginTop: 2 },
  profileBtn: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  searchWrap: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: "white",
    paddingVertical: 4,
  },

  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#0b1220",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  catPillActive: {
    backgroundColor: "#1d4ed8",
    borderColor: "#1d4ed8",
  },
  catText: { color: "#9ca3af", fontSize: 13 },
  catTextActive: { color: "white", fontWeight: "600" },

  card: {
    backgroundColor: "#0b1220",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 12 },
  logoWrap: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: "#111827", alignItems: "center", justifyContent: "center", overflow: "hidden",
  },
  logo: { width: 40, height: 40 },

  jobTitle: { color: "#e5e7eb", fontSize: 16, fontWeight: "700" },
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

  desc: { color: "#a3a3a3", marginTop: 2, lineHeight: 18 },

  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 },
  tag: {
    backgroundColor: "rgba(59,130,246,0.12)",
    borderColor: "rgba(59,130,246,0.3)",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: { color: "#93c5fd", fontSize: 12 },
});
