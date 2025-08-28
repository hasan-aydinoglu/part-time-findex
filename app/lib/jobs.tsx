// app/lib/jobs.ts
export type Job = {
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
  
  export const JOBS: Job[] = [
    {
      id: "1",
      title: "Barista",
      company: "Moonbeam Coffee",
      logo: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=256&q=80&auto=format&fit=crop",
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
      logo: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=256&q=80&auto=format&fit=crop",
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
      logo: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=256&q=80&auto=format&fit=crop",
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
      logo: "https://images.unsplash.com/photo-1556745753-b2904692b3cd?w=256&q=80&auto=format&fit=crop",
      location: "Beşiktaş, İstanbul",
      type: "On-site",
      salary: "₺230 /saat",
      postedAt: "1g önce",
      tags: ["Akşam", "Hafta içi", "Öğrenci"],
      desc: "Kasada müşteri karşılaması, reyon düzeni ve stok takibi.",
    },
  ];
  
  export const getJobById = (id: string) => JOBS.find((j) => j.id === id);
  