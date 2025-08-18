import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
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

const SEED_JOBS = [
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

const CATEGORIES = [
  "Tümü",
  "Yiyecek/İçecek",
  "Lojistik",
  "Dijital Pazarlama",
  "Perakende",
  "Eğitim",
  "Müşteri Hizmetleri",
];

const formatTL = (n) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(n);

export default function App() {
  return (
    <PaperProvider>
      <Main />
    </PaperProvider>
  );
}

function Main() {
  const [jobs, setJobs] = useStoredState("jobs", SEED_JOBS);
  const [favs, setFavs] = useStoredState("favs", []);

  const [q, setQ] = useState("");
  const [city, setCity] = useState("Tümü");
  const [cat, setCat] = useState("Tümü");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [minPay, setMinPay] = useState("0");
  const [sort, setSort] = useState("new");

  const cities = useMemo(
    () => ["Tümü", ...Array.from(new Set(jobs.filter((j) => !j.remote).map((j) => j.city)))],
    [jobs]
  );

  const filtered = useMemo(() => {
    let list = [...jobs];
    if (q.trim()) {
      const t = q.toLowerCase();
      list = list.filter((j) =>
        [j.title, j.company, j.description, j.category].join(" ").toLowerCase().includes(t)
      );
    }
    if (city !== "Tümü") list = list.filter((j) => j.city === city && !j.remote);
    if (cat !== "Tümü") list = list.filter((j) => j.category === cat);
    if (remoteOnly) list = list.filter((j) => j.remote);
    const min = Number(minPay) || 0;
    list = list.filter((j) => j.hourly >= min);
    if (sort === "new") list.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
    if (sort === "pay") list.sort((a, b) => b.hourly - a.hourly);
    return list;
  }, [jobs, q, city, cat, remoteOnly, minPay, sort]);

  const toggleFav = (id) =>
    setFavs((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <Appbar.Header style={{ backgroundColor: "#0f172a" }}>
        <Appbar.Content
          title="Part-Time Finder"
          subtitle="Expo (React Native)"
          color="white"
        />
        <Appbar.Action
          icon="refresh"
          color="white"
          onPress={() => {
            setJobs(SEED_JOBS);
            setFavs([]);
          }}
        />
      </Appbar.Header>

      {/* Filtreler */}
      <View style={{ padding: 12 }}>
        <TextInput
          mode="outlined"
          placeholder="Pozisyon, şirket, anahtar kelime"
          value={q}
          onChangeText={setQ}
          left={<TextInput.Icon icon="magnify" />}
        />
        <View style={{ height: 8 }} />

        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, backgroundColor: "#1f2937", borderRadius: 8 }}>
            <Picker
              selectedValue={city}
              onValueChange={setCity}
              style={{ color: "white" }}
              dropdownIconColor="white"
            >
              {cities.map((c) => (
                <Picker.Item key={c} label={c} value={c} />
              ))}
            </Picker>
          </View>
          <View style={{ width: 8 }} />
          <View style={{ flex: 1, backgroundColor: "#1f2937", borderRadius: 8 }}>
            <Picker
              selectedValue={cat}
              onValueChange={setCat}
              style={{ color: "white" }}
              dropdownIconColor="white"
            >
              {["Tümü", ...CATEGORIES.slice(1)].map((c) => (
                <Picker.Item key={c} label={c} value={c} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={{ height: 8 }} />
        <View
          style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
        >
          <Text style={{ color: "white" }}>Sadece Remote</Text>
          <Switch value={remoteOnly} onValueChange={setRemoteOnly} />
        </View>

        <View style={{ height: 8 }} />
        <TextInput
          mode="outlined"
          label="Min. Saatlik (₺)"
          keyboardType="numeric"
          value={minPay}
          onChangeText={setMinPay}
        />

        <View style={{ height: 8 }} />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Chip
            mode={sort === "new" ? "flat" : "outlined"}
            selected={sort === "new"}
            onPress={() => setSort("new")}
          >
            En Yeni
          </Chip>
          <View style={{ width: 8 }} />
          <Chip
            mode={sort === "pay" ? "flat" : "outlined"}
            selected={sort === "pay"}
            onPress={() => setSort("pay")}
          >
            Ücrete Göre
          </Chip>
          <View style={{ flex: 1 }} />
          <Button
            mode="outlined"
            onPress={() => {
              setQ("");
              setCity("Tümü");
              setCat("Tümü");
              setRemoteOnly(false);
              setMinPay("0");
              setSort("new");
            }}
          >
            Temizle
          </Button>
        </View>
      </View>

      <Divider />

      {/* Liste */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 12 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <Card style={{ backgroundColor: "#111827" }}>
            <Card.Title
              title={item.title}
              subtitle={`${item.company} • ${
                item.remote ? "Remote" : item.city
              } • ${item.shifts.join(", ")}`}
              titleStyle={{ color: "white" }}
              subtitleStyle={{ color: "#9ca3af" }}
            />
            <Card.Content>
              <Text style={{ color: "#e5e7eb", marginBottom: 8 }}>{item.description}</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {formatTL(item.hourly)}/saat
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <Button
                    mode={isFav(favs, item.id) ? "contained" : "outlined"}
                    onPress={() => toggleFav(item.id)}
                  >
                    {isFav(favs, item.id) ? "Kaydedildi" : "Kaydet"}
                  </Button>
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
  );
}

function isFav(favs, id) {
  return favs.includes(id);
}

function useStoredState(key, initialValue) {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(key);
        if (raw) setState(JSON.parse(raw));
      } catch {}
    })();
  }, [key]);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(state));
      } catch {}
    })();
  }, [key, state]);

  return [state, setState];
}
