
"use client";

import { useEffect, useState } from "react";

const courses = [
  {
    title: "Python ile Programlamaya Giriş",
    source: "BTK Akademi",
    category: "Yazılım",
    level: "Başlangıç",
    score: 96,
    type: "Video + Uygulama",
    color: "from-blue-500/20 to-cyan-500/10",
    icon: "⌨️",
  },
  {
    title: "Veri Bilimi ve Makine Öğrenmesi",
    source: "MIT OpenCourseWare",
    category: "Yapay Zekâ",
    level: "Orta",
    score: 94,
    type: "Ders + Materyal",
    color: "from-purple-500/20 to-indigo-500/10",
    icon: "🧠",
  },
  {
    title: "Siber Güvenliğe Giriş",
    source: "Cisco Networking Academy",
    category: "Siber Güvenlik",
    level: "Başlangıç",
    score: 91,
    type: "Video + Test",
    color: "from-emerald-500/20 to-teal-500/10",
    icon: "🛡️",
  },
  {
    title: "Veritabanı Yönetim Sistemleri",
    source: "Harvard CS50",
    category: "Veri Bilimi",
    level: "Orta",
    score: 89,
    type: "Ders + Proje",
    color: "from-orange-500/20 to-amber-500/10",
    icon: "🗄️",
  },
];

const categories = [
  "Tümü",
  "Yazılım",
  "Yapay Zekâ",
  "Siber Güvenlik",
  "Veri Bilimi",
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tümü");
  const [savedCourses, setSavedCourses] = useState<string[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [savedLoaded, setSavedLoaded] = useState(false);

  // Kayıtlı dersleri yükle
  useEffect(() => {
    try {
      const saved = localStorage.getItem("openlearn-saved");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSavedCourses(parsed.filter((item) => typeof item === "string"));
        }
      }
    } catch {
      console.error("Kayıtlı dersler okunamadı.");
    } finally {
      setSavedLoaded(true);
    }
  }, []);

  // Kayıtlı dersleri sakla
  useEffect(() => {
    if (!savedLoaded) return;

    localStorage.setItem(
      "openlearn-saved",
      JSON.stringify(savedCourses)
    );
  }, [savedCourses, savedLoaded]);

  // Favoriye ekle / çıkar
  const toggleSaved = (title: string) => {
    setSavedCourses((previous) =>
      previous.includes(title)
        ? previous.filter((item) => item !== title)
        : [...previous, title]
    );
  };

  // Menü geçişleri
  const goToCourses = (saved = false) => {
    setShowSaved(saved);

    setTimeout(() => {
      document.getElementById("courses")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 50);
  };

  // Ders filtreleme
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.source.toLowerCase().includes(search.toLowerCase()) ||
      course.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "Tümü" || course.category === category;

    const matchesSaved =
      !showSaved || savedCourses.includes(course.title);

    return matchesSearch && matchesCategory && matchesSaved;
  });

  return (
    <main className="min-h-screen bg-[#080b14] text-white">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-64 shrink-0 border-r border-white/[0.07] bg-[#0b0f1a] p-6 lg:flex lg:flex-col">

          <div className="mb-12 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-xl font-bold">
              O
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                OpenLearn<span className="text-violet-400">AI</span>
              </h1>
              <p className="text-[10px] tracking-[2px] text-gray-500">
                LEARN WITHOUT LIMITS
              </p>
            </div>
          </div>

          <p className="mb-4 text-[10px] font-semibold tracking-[2px] text-gray-500">
            MENÜ
          </p>

          <nav className="space-y-2 text-sm">

            <button
              onClick={() => {
                setShowSaved(false);
                setSearch("");
                setCategory("Tümü");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                !showSaved
                  ? "border border-violet-400/20 bg-violet-500/10 text-violet-300"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>⌂</span> Ana Sayfa
            </button>

            <button
              onClick={() => goToCourses(false)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                !showSaved
                  ? "text-gray-400 hover:bg-white/5 hover:text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>⌕</span> Ders Keşfet
            </button>

            <button
              onClick={() =>
                alert("Yapay Zekâ Asistanı sonraki geliştirme aşamasında eklenecek.")
              }
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              <span>✧</span> Yapay Zekâ Asistanı
            </button>

            <button
              onClick={() => goToCourses(true)}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition ${
                showSaved
                  ? "border border-violet-400/20 bg-violet-500/10 text-violet-300"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <span>♡</span> Kaydedilenler
              </span>

              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px]">
                {savedCourses.length}
              </span>
            </button>

          </nav>

          <div className="mt-auto rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-blue-500/5 p-5">
            <div className="mb-3 text-2xl">✦</div>
            <h3 className="mb-2 text-sm font-semibold">
              AI ile öğren
            </h3>
            <p className="text-xs leading-5 text-gray-400">
              Öğrenmek istediğin konuyu yaz. Sana en uygun açık eğitim
              kaynaklarını bulalım.
            </p>
          </div>

          <p className="mt-6 text-center text-[10px] text-gray-600">
            OPENLEARN AI © 2026
          </p>
        </aside>

        {/* MAIN CONTENT */}
        <section className="min-w-0 flex-1">

          {/* HEADER */}
          <header className="flex h-20 items-center justify-between border-b border-white/[0.07] px-6 md:px-10">
            <div>
              <p className="text-xs text-gray-500">
                Eğitim platformu
              </p>
              <p className="text-sm font-medium text-gray-200">
                Bilgiye giden yol burada.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400 sm:block">
                ● Sistem aktif
              </span>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#171d2c] font-semibold">
                S
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">

            {/* HERO */}
            {!showSaved && (
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#191b39] via-[#12162b] to-[#101827] p-7 md:p-12">

                <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-violet-600/20 blur-[90px]" />

                <div className="pointer-events-none absolute -bottom-40 right-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-[90px]" />

                <div className="relative max-w-3xl">

                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-xs text-violet-300">
                    ✦ AI DESTEKLİ AÇIK EĞİTİM PLATFORMU
                  </div>

                  <h2 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                    Öğrenmenin
                    <br />
                    <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                      yeni boyutunu
                    </span>
                    <br />
                    keşfet.
                  </h2>

                  <p className="mt-5 max-w-xl text-sm leading-7 text-gray-400 md:text-base">
                    Binlerce açık eğitim kaynağını tek yerde keşfet.
                    Yapay zekâ ile analiz et, karşılaştır ve kendine
                    en uygun öğrenme yolunu oluştur.
                  </p>

                  <div className="mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl border border-white/10 bg-[#090d19]/80 p-2 shadow-2xl shadow-black/20 sm:flex-row">

                    <div className="flex flex-1 items-center gap-3 px-3">
                      <span className="text-xl text-violet-400">
                        ⌕
                      </span>

                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Öğrenmek istediğin konuyu yaz..."
                        className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-gray-500"
                      />
                    </div>

                    <button
                      onClick={() => goToCourses(false)}
                      className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-3 text-sm font-semibold transition hover:brightness-125"
                    >
                      Kaynakları keşfet →
                    </button>

                  </div>

                  <p className="mt-4 text-xs text-gray-500">
                    ✧ Örnek: Python, Siber Güvenlik, Veri Bilimi, Yapay Zekâ
                  </p>

                </div>
              </div>
            )}

            {/* INFO CARDS */}
            {!showSaved && (
              <div className="my-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  ["01", "Açık erişim", "Ücretsiz kaynaklar"],
                  ["02", "AI Analiz", "İçerik değerlendirme"],
                  ["03", "Akıllı keşif", "Kişiselleştirilmiş öneri"],
                  ["04", "Tek platform", "Merkezi kaynak sistemi"],
                ].map((item) => (
                  <div
                    key={item[0]}
                    className="rounded-2xl border border-white/[0.07] bg-[#101522] p-5"
                  >
                    <p className="mb-4 text-xs text-violet-400">
                      {item[0]}
                    </p>
                    <h3 className="text-lg font-semibold">
                      {item[1]}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      {item[2]}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* COURSES */}
            <div id="courses" className="scroll-mt-8">

              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-semibold tracking-[2px] text-violet-400">
                    {showSaved ? "KİŞİSEL KÜTÜPHANEN" : "ÖĞRENME KÜTÜPHANESİ"}
                  </p>

                  <h2 className="text-2xl font-bold">
                    {showSaved ? "Kaydedilen dersler" : "Keşfedilecek dersler"}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    {showSaved
                      ? "Favorilerine eklediğin eğitim içerikleri."
                      : "İlgi alanına uygun eğitim içeriklerini keşfet."}
                  </p>
                </div>

                <span className="text-xs text-gray-500">
                  {filteredCourses.length} kaynak gösteriliyor
                </span>
              </div>

              {/* FILTERS */}
              <div className="mb-7 flex gap-2 overflow-x-auto pb-2">
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs transition ${
                      category === item
                        ? "border-violet-500 bg-violet-500/15 text-violet-300"
                        : "border-white/10 bg-[#111725] text-gray-400 hover:border-white/30"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* COURSE GRID */}
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

                {filteredCourses.map((course) => (
                  <article
                    key={course.title}
                    className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101522] transition duration-300 hover:-translate-y-1 hover:border-violet-500/40"
                  >

                    <div
                      className={`flex h-36 items-center justify-center bg-gradient-to-br ${course.color}`}
                    >
                      <span className="text-5xl transition duration-300 group-hover:scale-110">
                        {course.icon}
                      </span>
                    </div>

                    <div className="p-5">

                      <div className="mb-3 flex items-center justify-between">
                        <span className="rounded-md bg-white/5 px-2 py-1 text-[10px] text-gray-400">
                          {course.category}
                        </span>

                        <span className="text-xs text-gray-500">
                          {course.level}
                        </span>
                      </div>

                      <h3 className="min-h-12 text-sm font-semibold leading-6">
                        {course.title}
                      </h3>

                      <p className="mt-3 text-xs text-gray-500">
                        {course.source}
                      </p>

                      <div className="my-4 border-t border-white/[0.07]" />

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-gray-500">
                            İçerik uygunluğu
                          </p>

                          <p className="mt-1 text-sm font-bold text-emerald-400">
                            %{course.score}
                          </p>
                        </div>

                        <span className="text-[10px] text-gray-500">
                          {course.type}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleSaved(course.title)}
                        className={`mt-5 w-full rounded-xl border px-4 py-2.5 text-xs font-semibold transition ${
                          savedCourses.includes(course.title)
                            ? "border-pink-500/30 bg-pink-500/10 text-pink-400"
                            : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-violet-400/50 hover:text-violet-300"
                        }`}
                      >
                        {savedCourses.includes(course.title)
                          ? "♥ Kaydedildi"
                          : "♡ Kaydet"}
                      </button>

                    </div>
                  </article>
                ))}

              </div>

              {/* EMPTY STATE */}
              {filteredCourses.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-[#101522] p-12 text-center">

                  <div className="mb-4 text-4xl">
                    {showSaved ? "♡" : "⌕"}
                  </div>

                  <h3 className="text-lg font-semibold">
                    {showSaved
                      ? "Henüz kaydedilmiş dersin yok."
                      : "Aramana uygun ders bulunamadı."}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    {showSaved
                      ? "Beğendiğin dersleri Kaydet butonuyla buraya ekleyebilirsin."
                      : "Başka bir arama veya kategori deneyebilirsin."}
                  </p>

                  {showSaved && (
                    <button
                      onClick={() => goToCourses(false)}
                      className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-xs font-semibold hover:bg-violet-500"
                    >
                      Dersleri keşfet →
                    </button>
                  )}

                </div>
              )}

            </div>

            {/* FOOTER */}
            <footer className="mt-16 border-t border-white/[0.07] py-7 text-center text-xs text-gray-600">
              OpenLearnAI — Açık bilgi, sınırsız öğrenme.
            </footer>

          </div>
        </section>
      </div>
    </main>
  );
}
