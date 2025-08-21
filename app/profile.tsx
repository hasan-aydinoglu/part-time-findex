import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import { setSession } from "./_layout";

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    setSession(false);       // çıkış yap
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Profil Sayfası</Text>
      <Button title="Çıkış Yap" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, marginBottom: 20 },
});
