// src/routes/dashboard/+page.ts
export const load = async () => {
    const data = [
      {
        id: "1",
        name: "Undangan Internalisasi Nilai BerAKHLAK Provinsi",
        description: "Fail-fail umum untuk seluruh pegawai BPS Kabupaten Rokan Hilir",
        label: "Umum",
        link: "/files/umum",
        date: new Date().toISOString(), // serialize
        importance: false,
      },
      {
        id: "2",
        name: "Memo Dinas Internalisasi Nilai BerAKHLAK",
        description: "Fail-fail khusus untuk pegawai BPS Kabupaten Rokan Hilir",
        label: "Khusus",
        link: "/files/khusus",
        date: new Date().toISOString(),
        importance: false,
      },
      {
        id: "3",
        name: "Undangan Coaching Pilar 6 Zona Integritas",
        description: "Pengumuman terbaru di BPS Kabupaten Rokan Hilir",
        label: "Pengumuman",
        link: "/files/pengumuman",
        date: new Date().toISOString(),
        importance: true,
      },
    ];
  
    return {
      data
    };
  };
  