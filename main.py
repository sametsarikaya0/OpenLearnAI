
import streamlit as st
import pandas as pd
import requests
from bs4 import BeautifulSoup
import re
import hashlib
import time
import xml.etree.ElementTree as ET
from urllib.parse import urljoin

st.set_page_config(
    page_title="OpenLearn AI",
    page_icon="🎓",
    layout="wide"
)

st.markdown("""
<style>
.stApp {
    background-color: #0b1020;
}
.block-container {
    max-width: 1450px;
    padding-top: 2rem;
}
.hero {
    padding: 28px;
    border-radius: 18px;
    background: linear-gradient(120deg,#172846,#111827);
    border: 1px solid #29364e;
}
.hero h1 {
    color: white;
    font-size: 38px;
}
.hero p {
    color: #aabbd5;
}
.course {
    padding: 18px;
    border-radius: 14px;
    border: 1px solid #29364e;
    background: #121a2b;
    margin-bottom: 12px;
}
</style>
""", unsafe_allow_html=True)

SOURCES = [
    {"name": "MIT OpenCourseWare", "url": "https://ocw.mit.edu/", "sitemap": "https://ocw.mit.edu/sitemap.xml", "language": "English"},
    {"name": "OpenLearn", "url": "https://www.open.edu/openlearn/", "sitemap": "https://www.open.edu/sitemap.xml", "language": "English"},
    {"name": "OER Commons", "url": "https://www.oercommons.org/", "sitemap": "https://www.oercommons.org/sitemap.xml", "language": "English"},
    {"name": "OpenStax", "url": "https://openstax.org/", "sitemap": "https://openstax.org/sitemap.xml", "language": "English"},
    {"name": "Khan Academy", "url": "https://www.khanacademy.org/", "sitemap": "https://www.khanacademy.org/sitemap.xml", "language": "Multiple"},
    {"name": "Saylor Academy", "url": "https://www.saylor.org/", "sitemap": "https://www.saylor.org/sitemap.xml", "language": "English"},
    {"name": "edX", "url": "https://www.edx.org/", "sitemap": "https://www.edx.org/sitemap.xml", "language": "Multiple"},
    {"name": "Anadolu Üniversitesi eKampüs", "url": "https://ekampus.anadolu.edu.tr/", "sitemap": "", "language": "Türkçe"},
    {"name": "BTK Akademi", "url": "https://www.btkakademi.gov.tr/", "sitemap": "", "language": "Türkçe"},
    {"name": "HEMBA", "url": "https://hemba.gov.tr/", "sitemap": "", "language": "Türkçe"},
    {"name": "TÜBİTAK Bilim Genç", "url": "https://bilimgenc.tubitak.gov.tr/", "sitemap": "https://bilimgenc.tubitak.gov.tr/sitemap.xml", "language": "Türkçe"}
]

SEED_COURSES = [
    {
        "title": "Introduction to Computer Science and Programming in Python",
        "description": "Python programlama, algoritmik düşünme ve bilgisayar bilimine giriş.",
        "url": "https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/",
        "source": "MIT OpenCourseWare",
        "language": "English",
        "image": "",
        "license": "Sayfa bazında kontrol edilmeli"
    },
    {
        "title": "Introduction to Algorithms",
        "description": "Algoritmalar, veri yapıları ve problem çözme temelleri.",
        "url": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2020/",
        "source": "MIT OpenCourseWare",
        "language": "English",
        "image": "",
        "license": "Sayfa bazında kontrol edilmeli"
    },
    {
        "title": "Getting started with Python",
        "description": "Python programlama diline giriş ve temel programlama kavramları.",
        "url": "https://www.open.edu/openlearn/science-maths-technology/computing-ict/getting-started-python/content-section-0",
        "source": "OpenLearn",
        "language": "English",
        "image": "",
        "license": "Sayfa bazında kontrol edilmeli"
    },
    {
        "title": "Computer programming",
        "description": "Programlama ve bilgisayar biliminin temel kavramlarını öğrenin.",
        "url": "https://www.khanacademy.org/computing/computer-programming",
        "source": "Khan Academy",
        "language": "English",
        "image": "",
        "license": "Sayfa bazında kontrol edilmeli"
    },
    {
        "title": "OpenStax Computer Science resources",
        "description": "Açık ders kitapları ve bilim, matematik, teknoloji alanlarında öğrenme materyalleri.",
        "url": "https://openstax.org/subjects",
        "source": "OpenStax",
        "language": "English",
        "image": "",
        "license": "Kitap bazında lisans kontrol edilmeli"
    },
    {
        "title": "BTK Akademi eğitim kataloğu",
        "description": "Yazılım, bilişim, siber güvenlik ve dijital yetkinlik eğitimleri.",
        "url": "https://www.btkakademi.gov.tr/portal",
        "source": "BTK Akademi",
        "language": "Türkçe",
        "image": "",
        "license": "Platform koşulları kontrol edilmeli"
    },
    {
        "title": "Anadolu Üniversitesi eKampüs",
        "description": "Açıköğretim ders materyalleri ve öğrenme içerikleri.",
        "url": "https://ekampus.anadolu.edu.tr/",
        "source": "Anadolu Üniversitesi eKampüs",
        "language": "Türkçe",
        "image": "",
        "license": "Platform koşulları kontrol edilmeli"
    },
    {
        "title": "HEMBA eğitim kataloğu",
        "description": "Halk eğitimi ve kişisel gelişim alanlarında çevrim içi eğitimler.",
        "url": "https://hemba.gov.tr/",
        "source": "HEMBA",
        "language": "Türkçe",
        "image": "",
        "license": "Platform koşulları kontrol edilmeli"
    },
    {
        "title": "Bilim Genç",
        "description": "Bilim ve teknoloji konularında Türkçe öğrenme içerikleri.",
        "url": "https://bilimgenc.tubitak.gov.tr/",
        "source": "TÜBİTAK Bilim Genç",
        "language": "Türkçe",
        "image": "",
        "license": "İçerik bazında lisans kontrol edilmeli"
    },
    {
        "title": "Online courses",
        "description": "Üniversitelerden çevrim içi dersler ve eğitim programları.",
        "url": "https://www.edx.org/",
        "source": "edX",
        "language": "Multiple",
        "image": "",
        "license": "Kurs bazında kontrol edilmeli"
    },
    {
        "title": "Open educational resources",
        "description": "Açık eğitim kaynakları ve ders materyalleri kataloğu.",
        "url": "https://www.oercommons.org/",
        "source": "OER Commons",
        "language": "English",
        "image": "",
        "license": "Kaynak bazında lisans kontrol edilmeli"
    },
    {
        "title": "Saylor Academy courses",
        "description": "Bilgisayar bilimleri, işletme ve matematik alanlarında ücretsiz kurslar.",
        "url": "https://www.saylor.org/",
        "source": "Saylor Academy",
        "language": "English",
        "image": "",
        "license": "Kurs bazında kontrol edilmeli"
    }
]

DB_FILE = "courses.csv"

def load_data():
    try:
        return pd.read_csv(DB_FILE).fillna("")
    except Exception:
        return pd.DataFrame(SEED_COURSES)

def save_data(df):
    df.drop_duplicates(subset=["url"]).to_csv(
        DB_FILE, index=False, encoding="utf-8-sig"
    )

def tokenize(text):
    return set(re.findall(
        r"[a-zA-ZçğıöşüÇĞİÖŞÜ0-9+#.-]{2,}",
        str(text).lower()
    ))

def relevance_score(query, row):
    words = tokenize(query)
    title = tokenize(row["title"])
    description = tokenize(row["description"])

    if not words:
        return 0

    title_hits = len(words & title)
    description_hits = len(words & description)
    coverage = len(words & (title | description)) / len(words)

    return min(
        100,
        round(coverage * 65 + min(title_hits, 4) * 8
              + min(description_hits, 5) * 3)
    )

def quality_score(row):
    score = 35

    if len(str(row["description"])) >= 100:
        score += 20
    if str(row["image"]).startswith("http"):
        score += 10
    if str(row["url"]).startswith("https://"):
        score += 15
    if row["source"]:
        score += 10
    if row["license"] and "kontrol" not in str(row["license"]).lower():
        score += 10

    return min(score, 100)

def get_sitemap_urls(sitemap, limit=35):
    if not sitemap:
        return []

    try:
        response = requests.get(sitemap, timeout=12)
        response.raise_for_status()

        root = ET.fromstring(response.content)
        ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}

        urls = [
            item.text
            for item in root.findall(".//sm:loc", ns)
            if item.text
        ]

        return urls[:limit]

    except Exception:
        return []

def extract_page(url, source):
    try:
        response = requests.get(
            url,
            headers={"User-Agent": "OpenLearnAI/0.1"},
            timeout=12
        )

        if response.status_code != 200:
            return None

        if "text/html" not in response.headers.get("content-type", ""):
            return None

        soup = BeautifulSoup(response.text, "html.parser")

        for tag in soup(["script", "style", "noscript", "svg"]):
            tag.decompose()

        title = soup.title.get_text(strip=True) if soup.title else ""

        if not title:
            h1 = soup.find("h1")
            title = h1.get_text(strip=True) if h1 else ""

        description_tag = (
            soup.find("meta", attrs={"name": "description"})
            or soup.find("meta", attrs={"property": "og:description"})
        )

        description = (
            description_tag.get("content", "")
            if description_tag else ""
        )

        image_tag = soup.find("meta", attrs={"property": "og:image"})
        image = (
            urljoin(url, image_tag.get("content", ""))
            if image_tag and image_tag.get("content")
            else ""
        )

        if not title:
            return None

        return {
            "title": title[:180],
            "description": description[:700],
            "url": url.split("#")[0],
            "source": source["name"],
            "language": source["language"],
            "image": image,
            "license": "Kontrol gerekli"
        }

    except Exception:
        return None

def crawl_sources(progress):
    collected = []
    logs = []

    for index, source in enumerate(SOURCES):
        urls = get_sitemap_urls(source["sitemap"])

        if not urls:
            urls = [source["url"]]

        count = 0

        for url in urls:
            result = extract_page(url, source)

            if result:
                collected.append(result)
                count += 1

            time.sleep(0.15)

        logs.append(f"{source['name']}: {count} kayıt")

        progress.progress((index + 1) / len(SOURCES))

    return pd.DataFrame(collected), logs

if "courses" not in st.session_state:
    st.session_state.courses = load_data()

df = st.session_state.courses.copy()

st.markdown("""
<div class="hero">
<h1>🎓 OpenLearn AI</h1>
<p>Açık eğitim kaynaklarını keşfet, analiz et ve öğrenme yolunu oluştur.</p>
</div>
""", unsafe_allow_html=True)

st.sidebar.title("OpenLearn AI")
page = st.sidebar.radio(
    "Menü",
    ["Keşfet ve Ara", "Kaynaklar", "İndeksleme", "Hakkında"]
)

st.sidebar.metric("İndeksli kayıt", len(df))
st.sidebar.metric("Kaynak sayısı", len(SOURCES))

if page == "Keşfet ve Ara":

    st.title("🔎 Eğitim keşfet")

    query = st.text_input(
        "Ne öğrenmek istiyorsun?",
        placeholder="Örn: Python, siber güvenlik, veri bilimi..."
    )

    col1, col2 = st.columns(2)

    with col1:
        sources = ["Tüm kaynaklar"] + sorted(
            df["source"].astype(str).unique().tolist()
        )
        source_filter = st.selectbox("Kaynak seç", sources)

    with col2:
        languages = ["Tüm diller"] + sorted(
            df["language"].astype(str).unique().tolist()
        )
        language_filter = st.selectbox("Dil seç", languages)

    results = df.copy()

    if source_filter != "Tüm kaynaklar":
        results = results[results["source"] == source_filter]

    if language_filter != "Tüm diller":
        results = results[results["language"] == language_filter]

    if query.strip():
        results["relevance"] = results.apply(
            lambda row: relevance_score(query, row), axis=1
        )
        results = results.sort_values(
            "relevance", ascending=False
        )
    else:
        results["relevance"] = 0

    st.write(f"Bulunan sonuç: {len(results)}")

    for _, row in results.iterrows():

        quality = quality_score(row)

        with st.container(border=True):

            left, right = st.columns([5, 1])

            with left:
                st.subheader(row["title"])
                st.caption(
                    f"{row['source']} | {row['language']}"
                )
                st.write(row["description"])

                if row["image"]:
                    st.image(row["image"], width=180)

                st.link_button(
                    "Eğitime git ↗",
                    row["url"]
                )

            with right:
                st.metric(
                    "Alaka",
                    f"{int(row['relevance'])}/100"
                )
                st.metric(
                    "Kalite",
                    f"{quality}/100"
                )

elif page == "Kaynaklar":

    st.title("🌐 Eğitim kaynakları")

    for source in SOURCES:
        st.markdown(
            f"- [{source['name']}]({source['url']}) "
            f"({source['language']})"
        )

elif page == "İndeksleme":

    st.title("🗂️ Ders indeksleme")

    st.warning(
        "Tarama sadece erişilebilir sitemap ve HTML sayfalarını "
        "deneyebilir. Platformların kullanım koşullarına ve robots.txt "
        "kurallarına uyulmalıdır."
    )

    if st.button("İndekslemeyi başlat", type="primary"):

        progress = st.progress(0)

        with st.spinner("Kaynaklar taranıyor..."):
            new_data, logs = crawl_sources(progress)

        if not new_data.empty:

            combined = pd.concat(
                [df, new_data],
                ignore_index=True
            )

            combined = combined.drop_duplicates(
                subset=["url"],
                keep="last"
            )

            save_data(combined)
            st.session_state.courses = combined

            st.success(
                f"İndeks güncellendi. Toplam kayıt: {len(combined)}"
            )

        else:
            st.warning("Yeni veri bulunamadı.")

        for log in logs:
            st.write(log)

    st.dataframe(df, use_container_width=True)

    st.download_button(
        "CSV indeksini indir",
        df.to_csv(index=False).encode("utf-8-sig"),
        "openlearn_courses.csv",
        "text/csv"
    )

elif page == "Hakkında":

    st.title("OpenLearn AI hakkında")

    st.write("""
    OpenLearn AI, açık eğitim kaynaklarını tek bir merkezde
    toplamayı amaçlayan Python tabanlı bir eğitim keşif sistemidir.

    Özellikler:

    - Eğitim kaynaklarını listeleme
    - Ders arama ve filtreleme
    - Alaka puanlama
    - Kalite göstergesi
    - Görsel ön izleme
    - Ders bağlantılarını indeksleme
    - CSV veritabanı

    Bu sürümde puanlama anahtar kelime tabanlıdır.
    Gelişmiş yapay zekâ özellikleri sonraki sürümlerde eklenecektir.
    """)

st.caption("OpenLearn AI | Prototype v0.1")
