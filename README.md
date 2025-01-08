# Beyaz Işık Klinik Yönetim Sistemi

**Beyaz Işık Klinik Yönetim Sistemi**, klinik operasyonlarını dijitalleştirmek ve verimliliği artırmak amacıyla geliştirilmiş bir tam yığın (full-stack) web uygulamasıdır. Bu proje, personel yönetimi, randevu düzenleme, hizmetlerin takibi ve ödeme işlemleri gibi temel işlevleri tek bir platformda birleştirir.

---


## Özellikler
- **Admin Girişi**: Klinik yöneticilerinin sisteme güvenli bir şekilde giriş yapmasını sağlar.
- **Dashboard**: Aktif randevular, finansal durum ve personel iş yükü gibi önemli bilgilerin görselleştirilmesi.
- **Personel Yönetimi**: Personel bilgilerini ekleme, güncelleme, silme ve listeleme.
- **Randevu Yönetimi**: Hasta randevularını oluşturma, düzenleme ve silme.
- **Hizmet Yönetimi**: Klinik tarafından sunulan hizmetlerin takibi ve düzenlenmesi.
- **Ödeme Yönetimi**: Ödeme işlemlerinin kayıt altına alınması ve raporlanması.

---
## Kullanılan Teknolojiler
- JavaScript
- Node.js
- Express.js
- MySQL
- HTML
- CSS



## Proje Yapısı 
- `/backend`          -> Backend dosyaları
- `/functions`        -> Modüler backend işlemleri (hizmet, randevu, ödeme vb.)
  - `hizmet.js`       -> Hizmet işlemleri backend kodları
  - `index.js`        -> Dashboard işlemleri
  - `login.js`        -> Admin giriş işlemleri
  - `odeme.js`        -> Ödeme işlemleri
  - `ortak.js`        -> Ortak yardımcı fonksiyonlar
  - `personel.js`     -> Personel yönetimi işlemleri
  - `randevu.js`      -> Randevu işlemleri
- `/node_modules`     -> Node.js bağımlılıkları
- `/frontend`         -> Kullanıcı arayüzü (frontend) dosyaları
  - `/wwwroot`        -> Statik dosyalar (CSS, JS, medya)
    - `background.mp4`-> Arka plan videosu
    - `logo.png`      -> Klinik logosu
  - `hizmet.html`     -> Hizmet yönetimi ekranı
  - `index.html`      -> Ana sayfa (Dashboard)
  - `login.html`      -> Admin giriş ekranı
  - `odeme.html`      -> Ödeme yönetimi ekranı
  - `personel.html`   -> Personel yönetimi ekranı
  - `randevu.html`    -> Randevu yönetimi ekranı
  - `style.css`       -> Genel stil dosyası
  - `login.css`       -> Giriş ekranı için özel stil
- `/sql ve readme`    -> SQL ve proje dokümantasyon dosyaları
  - `benioku.txt`     -> Proje açıklamaları
  - `klinik.sql`      -> Veritabanı tanımları ve başlangıç verileri
- `package.json`      -> Node.js proje yapılandırması ve bağımlılık bilgileri
- `package-lock.json` -> Node.js bağımlılık sürüm bilgileri
- `server.js`         -> Ana sunucu dosyası


## Kurulum
1. Repoyu klonlayın.
  
2. Veritabanını oluşturun ve `sql` klasöründeki `klinik.sql` dosyasını içeri aktarın.

3. `npm install` ile Node.js bağımlılıklarını yükleyin.

3. Terminale `node server.js` yazarak uygulamayı başlatın.

5. Tarayıcınızda http://localhost:3001 adresine gidin.


## Kullanım
1. Giriş Yapın: `login.html` üzerinden  kullanıcı adı **admin** ve şifre **Admin35.** giriş yapın.
2. Dashboard: `index.html` üzerinden finansal ve operasyonel verilere ulaşın.
3. Personel, randevu, hizmet ve ödeme yönetim menülerinden işlemlerinizi gerçekleştirin..

## Amaç

---

> **Bu proje,Dokuz Eylül Üniversitesi Yönetim Bilişim Sistemleri Bölümü Bilişim Sistemleri Analizi ve Tasarımı Dersi Dönem Proje Ödevi olarak kullanıcı dostu bir yönetim aracı ile klinik personelinin iş yükünü hafifletmek ve hasta memnuniyetini artırmak amacıyla tasarlanmıştır..**

🚀 **Geliştiriciler:**  [Onur KANBOLAT](https://github.com/onurknblt) - [Hasan Erdem](https://github.com/hasanerdemgit) 
📧 **E-posta adresleri:** onurknblt@gmail.com - mailhasanerdem@gmail.com 
📅 **Tarih:** Ocak 2025
