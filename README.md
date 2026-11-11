
# OpenLearn AI

Açık eğitim kaynaklarını keşfetmek, indekslemek ve analiz etmek için Python tabanlı prototip.

## Kurulum

Python 3.10 veya üzeri önerilir.

### 1. Sanal ortam oluştur

```bash
python -m venv .venv
```

### 2. Sanal ortamı etkinleştir

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

### 3. Paketleri yükle

```bash
pip install -r requirements.txt
```

### 4. Uygulamayı çalıştır

```bash
streamlit run main.py
```

## Özellikler

- 11 eğitim kaynağı
- Ders arama ve filtreleme
- Alaka puanlama
- Kalite göstergesi
- Görsel ön izleme
- Kaynak bağlantıları
- CSV indeksleme
- Web sayfası metadata toplama

## Geliştirme planı

- Sentence Transformers entegrasyonu
- Gerçek anlamsal arama
- Gelişmiş öneri motoru
- Kaynak başına özel veri toplayıcılar
- Lisans analizi
- Kullanıcı profili
