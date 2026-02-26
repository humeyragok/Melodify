# 🎵 Melodify - Spotify Clone

Modern, tam özellikli bir müzik streaming uygulaması. Next.js 14, Prisma, PostgreSQL ve Jamendo API kullanılarak geliştirilmiştir.

![Melodify](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Docker-336791?style=flat-square&logo=postgresql)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)

## Projemi bu bağlantıdan deneyebilirsiniz https://melodify-seven.vercel.app

## ✨ Özellikler

###  Müzik Oynatma
- Tam özellikli müzik player (çal/durdur, ileri/geri, ses kontrolü)
- Progress bar ile şarkı ilerlemesi
- Kuyruk yönetimi (queue)
- Şarkılar arası otomatik geçiş

###  İçerik Yönetimi
- **Ana Sayfa**: Tüm şarkıları görüntüleme
- **Arama**: Şarkı ve sanatçı arama
- **Beğenilen Şarkılar**: Favori şarkılarını kaydet
- **Playlist Yönetimi**: Özel playlist'ler oluştur ve yönet
- **Admin Paneli**: Şarkı ve sanatçı ekleme

###  Kullanıcı Yönetimi
- Güvenli kayıt ve giriş sistemi (NextAuth.js)
- Şifre hashleme (bcrypt)
- Session yönetimi

###  Arayüz
- Modern ve responsive tasarım
- Spotify-benzeri kullanıcı arayüzü
- Smooth animasyonlar ve hover efektleri
- Mobile uyumlu

##  Teknolojiler

### Frontend
- **Next.js 14** - React framework
- **Tailwind CSS** - Styling
- **Zustand** - State management

### Backend
- **Next.js API Routes** - RESTful API
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Veritabanı (Docker)
- **NextAuth.js** - Authentication

### Dış Servisler
- **Jamendo API** - Ücretsiz müzik kaynağı

##  Gereksinimler

- Node.js 18+ 
- Docker ve Docker Compose
- npm veya yarn

##  Kurulum

### 1. Projeyi klonlayın
```bash
git clone https://github.com/humeyragok/melodify.git
cd melodify
```

### 2. Bağımlılıkları yükleyin
```bash
npm install
```

### 3. Environment değişkenlerini ayarlayın

`.env` dosyası oluşturun:
```env
DATABASE_URL="postgresql://spotify_user:spotify_pass_2024@localhost:5432/spotify_db"
NEXTAUTH_SECRET=mysecretkey123456789
NEXTAUTH_URL=http://localhost:3000
JAMENDO_CLIENT_ID=your_jamendo_client_id_here
```

**Jamendo Client ID almak için:**
1. https://devportal.jamendo.com/ adresine gidin
2. Kayıt olun
3. Yeni bir uygulama oluşturun
4. Client ID'yi `.env` dosyasına ekleyin

### 4. Docker ile PostgreSQL'i başlatın
```bash
docker-compose up -d
```

### 5. Veritabanını oluşturun
```bash
npx prisma migrate dev
npx prisma generate
```

### 6. Uygulamayı başlatın
```bash
npm run dev
```

Tarayıcınızda http://localhost:3000 adresini açın.

##  Kullanım

### İlk Kullanım

1. **Kayıt Olun**: Ana sayfadan "Kayıt Ol" butonuna tıklayın
2. **Giriş Yapın**: Email ve şifrenizle giriş yapın
3. **Admin Olun** (Opsiyonel):
```bash
   npx prisma studio
```
   - User tablosunu açın
   - Kullanıcınızın `role` değerini `admin` yapın

### Şarkı Ekleme

**Yöntem 1: Jamendo API ile (Önerilen)**
1. Admin paneline gidin (`/admin`)
2. "🎵 Jamendo'dan 50 Şarkı Ekle" butonuna tıklayın
3. Şarkılar otomatik olarak eklenecektir

**Yöntem 2: Manuel Ekleme**
1. Admin paneline gidin
2. Önce bir sanatçı ekleyin
3. Sonra şarkı ekleyin (MP3 URL gerekli)

### Temel Kullanım

- **Şarkı Çalma**: Ana sayfada şarkıya tıklayın
- **Arama**: Arama sayfasından şarkı/sanatçı arayın
- **Beğenme**: Player'daki kalp ikonuna (❤️) tıklayın
- **Playlist Oluşturma**: Kitaplık sayfasından "Playlist Oluştur"
- **Playlist'e Ekleme**: Şarkı kartındaki ➕ butonuna tıklayın

##  Proje Yapısı
```
melodify/
├── app/
│   ├── admin/          # Admin paneli
│   ├── home/           # Ana sayfa
│   ├── search/         # Arama sayfası
│   ├── liked/          # Beğenilen şarkılar
│   ├── library/        # Playlist'ler
│   ├── playlist/[id]/  # Playlist detay
│   ├── login/          # Giriş
│   ├── register/       # Kayıt
│   └── api/            # API routes
├── components/
│   ├── Player.js       # Müzik player
│   ├── Sidebar.js      # Yan menü
│   └── SongCard.js     # Şarkı kartı
├── store/
│   └── usePlayerStore.js  # Zustand store
├── prisma/
│   └── schema.prisma   # Database şeması
├── lib/
│   └── prisma.js       # Prisma client
└── docker-compose.yml  # PostgreSQL
```

##  Veritabanı Şeması
```prisma
- User (Kullanıcılar)
- Artist (Sanatçılar)
- Album (Albümler)
- Song (Şarkılar)
- Playlist (Playlistler)
- LikedSong (Beğenilen şarkılar)
- PlaylistSong (Playlist-Şarkı ilişkisi)
```

## 📄 Lisans

Bu proje MIT lisansı altındadır.

##  Geliştirici

**Hümeyra Gök**
- GitHub: [@humeyragok](https://github.com/humeyragok)

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
