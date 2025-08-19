// app/(tabs)/index.tsx
import * as React from "react";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
  Appbar,
  Button,
  Card,
  Chip,
  Divider,
  Provider as PaperProvider,
  Switch,
  Text,
  TextInput,
} from "react-native-paper";

type Job = {
  id: number;
  title: string;
  company: string;
  city: string;
  remote: boolean;
  category: string;
  hourly: number;
  postedAt: string;
  shifts: string[];
  description: string;
};

const SEED_JOBS: Job[] = [
  {
    id: 1,
    title: "Barista (Hafta Sonu)",
    company: "Bean&Co.",
    city: "İstanbul",
    remote: false,
    category: "Yiyecek/İçecek",
    hourly: 220,
    postedAt: new Date().toISOString(),
    shifts: ["Cmt", "Paz"],
    description: "Üçüncü dalga kahvecide hafta sonu vardiyası.",
  },
  {
    id: 2,
    title: "Depo Görevlisi (Akşam)",
    company: "HızlıLojistik",
    city: "Ankara",
    remote: false,
    category: "Lojistik",
    hourly: 200,
    postedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    shifts: ["Hafta içi", "Akşam"],
    description: "Sipariş toplama ve paketleme.",
  },
  {
    id: 3,
    title: "Sosyal Medya Asistanı (Remote)",
    company: "Glow Agency",
    city: "İzmir",
    remote: true,
    category: "Dijital Pazarlama",
    hourly: 260,
    postedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    shifts: ["Esnek"],
    description: "Kısa video kurgu ve metin.",
  },
  {
    id: 4,
    title: "Satış Destek (Öğrenci Uygun)",
    company: "TeknoShop",
    city: "Bursa",
    remote: false,
    category: "Perakende",
    hourly: 210,
    postedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    shifts: ["Hafta içi", "Gündüz"],
    description: "Mağazada müşteri karşılama, stok.",
  },
  {
    id: 5,
    title: "Kurye (Saatlik)",
    company: "HızlıGetir",
    city: "İstanbul",
    remote: false,
    category: "Lojistik",
    hourly: 300,
    postedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    shifts: ["Esnek"],
    description: "Motosiklet ile bölge içi teslimat.",
  },
];

const CATEGORIES = ["Tümü", "Yiyecek/İçecek", "Lojistik", "Dijital Pazarlama", "Perakende"];

const formatTL = (n: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(
    n
  );

export default function HomeTab() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Tümü");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [sort, setSort] = useState<"new" | "pay">("new");
  const [minPay, setMinPay] = useState("");

  const filtered = useMemo(() => {
    let list = [...SEED_JOBS];
    if (q.trim()) {
      const t = q.toLowerCase();
      list = list.filter((j) => [j.title, j.company, j.description, j.category].join(" ").toLowerCase().includes(t));
    }
    if (cat !== "Tümü") list = list.filter((j) => j.category === cat);
    if (remoteOnly) list = list.filter((j) => j.remote);
    const min = Number(minPay) || 0;
    list = list.filter((j) => j.hourly >= min);
    if (sort === "new") list.sort((a, b) => +new Date(b.postedAt) - +new Date(a.postedAt));
    if (sort === "pay") list.sort((a, b) => b.hourly - a.hourly);
    return list;
  }, [q, cat, remoteOnly, minPay, sort]);

  return (
    <PaperProvider>
      <View style={styles.root}>
        {/* HEADER */}
        <Appbar.Header mode="center-aligned" style={styles.header}>
          <Appbar.Content title="Part-Time Finder" subtitle="İlanları keşfet" color="#fff" />
          <Appbar.Action
            icon="refresh"
            color="#fff"
            onPress={() => {
              setQ("");
              setCat("Tümü");
              setRemoteOnly(false);
              setMinPay("");
              setSort("new");
            }}
          />
        </Appbar.Header>

        {/* FILTERS */}
        <View style={styles.section}>
          <TextInput
            mode="outlined"
            placeholder="Pozisyon, şirket, anahtar kelime"
            value={q}
            onChangeText={setQ}
            left={<TextInput.Icon icon="magnify" />}
          />
          <View style={styles.gap8} />

          <View style={styles.row}>
            <Text style={styles.label}>Kategori:</Text>
            <View style={styles.chips}>
              {CATEGORIES.map((c) => (
                <Chip
                  key={c}
                  style={styles.chip}
                  selected={cat === c}
                  mode={cat === c ? "flat" : "outlined"}
                  onPress={() => setCat(c)}
                >
                  {c}
                </Chip>
              ))}
            </View>
          </View>

          <View style={styles.gap8} />

          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <Text style={styles.label}>Sadece Remote</Text>
              <View style={{ width: 8 }} />
              <Switch value={remoteOnly} onValueChange={setRemoteOnly} />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Min ₺</Text>
              <View style={{ width: 8 }} />
              <TextInput
                mode="outlined"
                value={minPay}
                onChangeText={setMinPay}
                keyboardType="numeric"
                style={{ width: 100 }}
              />
            </View>
          </View>

          <View style={styles.gap8} />

          <View style={styles.row}>
            <Text style={styles.label}>Sırala:</Text>
            <View style={styles.chips}>
              <Chip
                style={styles.chip}
                selected={sort === "new"}
                mode={sort === "new" ? "flat" : "outlined"}
                onPress={() => setSort("new")}
              >
                En Yeni
              </Chip>
              <Chip
                style={styles.chip}
                selected={sort === "pay"}
                mode={sort === "pay" ? "flat" : "outlined"}
                onPress={() => setSort("pay")}
              >
                Ücrete Göre
              </Chip>
            </View>
            <View style={{ flex: 1 }} />
            <Button
              mode="outlined"
              onPress={() => {
                setQ("");
                setCat("Tümü");
                setRemoteOnly(false);
                setMinPay("");
                setSort("new");
              }}
            >
              Temizle
            </Button>
          </View>
        </View>

        <Divider />

        {/* LIST */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Title
                title={item.title}
                subtitle={`${item.company} • ${item.remote ? "Remote" : item.city} • ${item.shifts.join(", ")}`}
                titleStyle={{ color: "white" }}
                subtitleStyle={{ color: "#9ca3af" }}
              />
              <Card.Content>
                <Text style={{ color: "#e5e7eb", marginBottom: 8 }}>{item.description}</Text>
                <View style={styles.rowBetween}>
                  <Text style={{ color: "white", fontWeight: "bold" }}>{formatTL(item.hourly)}/saat</Text>
                  <View style={styles.row}>
                    <Button mode="outlined" onPress={() => {}}>Kaydet</Button>
                    <View style={{ width: 8 }} />
                    <Button mode="contained" onPress={() => alert("Demo: Başvuru gönderildi!")}>
                      Başvur
                    </Button>
                  </View>
                </View>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                  <Chip mode="outlined">{item.category}</Chip>
                </View>
              </Card.Content>
            </Card>
          )}
          ListEmptyComponent={
            <Text style={{ color: "white", textAlign: "center", marginTop: 24 }}>
              Kriterlere uygun ilan yok.
            </Text>
          }
        />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0f172a" },
  header: { backgroundColor: "#0f172a" },
  section: { padding: 12 },
  gap8: { height: 8 },
  row: { flexDirection: "row", alignItems: "center" },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  chips: { flexDirection: "row", flexWrap: "wrap" as const, gap: 8 },
  chip: { marginRight: 0 },
  label: { color: "white", marginRight: 8 },
  list: { padding: 12 },
  card: { backgroundColor: "#111827" },
});
