-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1:3306
-- Üretim Zamanı: 23 Ara 2024, 07:32:26
-- Sunucu sürümü: 9.1.0
-- PHP Sürümü: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `klinik`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `admins`
--

DROP TABLE IF EXISTS `admins`;
CREATE TABLE IF NOT EXISTS `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `admins`
--

INSERT INTO `admins` (`id`, `username`, `password`) VALUES
(1, 'admin', 'Admin35');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `hizmetler`
--

DROP TABLE IF EXISTS `hizmetler`;
CREATE TABLE IF NOT EXISTS `hizmetler` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ad` varchar(100) NOT NULL,
  `ucret` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `hizmetler`
--

INSERT INTO `hizmetler` (`id`, `ad`, `ucret`) VALUES
(1, 'Diş Temizliği', 600.00),
(2, 'Dolgu Tedavisi', 800.00),
(3, 'Diş Çekimi', 600.00),
(4, 'Diş Beyazlatma', 1000.00),
(5, 'Kanal Tedavisi', 1200.00),
(6, 'Ortodonti', 1500.00),
(7, 'Çene Cerrahisi', 2500.00),
(8, 'Protez', 2000.00),
(9, 'Diş Eti Tedavisi', 700.00),
(10, 'Kontrol', 100.00),
(16, 'Muayene', 0.00);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `odemeler`
--

DROP TABLE IF EXISTS `odemeler`;
CREATE TABLE IF NOT EXISTS `odemeler` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hasta_ad` varchar(100) NOT NULL,
  `odenen_tutar` decimal(10,2) NOT NULL,
  `fatura_tarihi` date DEFAULT NULL,
  `islem_tarihi` date DEFAULT NULL,
  `odeme_turu` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `odemeler`
--

INSERT INTO `odemeler` (`id`, `hasta_ad`, `odenen_tutar`, `fatura_tarihi`, `islem_tarihi`, `odeme_turu`) VALUES
(1, 'Ali Can', 500.00, '2024-01-11', '2024-01-11', 'Nakit'),
(2, 'Ayşe Demir', 800.00, '2024-01-10', '2024-01-10', 'Kredi Kartı'),
(3, 'Mehmet Kaya', 600.00, '2024-01-11', '2024-01-11', 'Kredi Kartı'),
(4, 'Fatma Yılmaz', 1000.00, '2024-01-12', '2024-01-12', 'Kredi Kartı'),
(5, 'Ahmet Kurt', 1200.00, '2024-01-13', '2024-01-13', 'Nakit'),
(7, 'Kemal Aksoy', 2500.00, '2024-01-15', '2024-01-15', 'Kredi Kartı'),
(9, 'Murat Eren', 700.00, '2024-01-17', '2024-01-17', 'Kredi Kartı'),
(55, 'Ali Kan', 1000.00, '2024-12-23', '2024-12-23', 'Nakit');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `personeller`
--

DROP TABLE IF EXISTS `personeller`;
CREATE TABLE IF NOT EXISTS `personeller` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ad_soyad` varchar(100) NOT NULL,
  `telefon` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `maas` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `personeller`
--

INSERT INTO `personeller` (`id`, `ad_soyad`, `telefon`, `email`, `maas`) VALUES
(1, 'Ahmet Yılmaz', '05533215235', 'ahmetyilmaz@gmail.com', 1000.00),
(2, 'Fatma Kaya', '05345678902', 'fatma.kaya@gmail.com', 1000.00),
(3, 'Mehmet Demir', '05345678903', 'mehmet.demir@gmail.com', 1000.00),
(4, 'Ayşe Kurt', '05345678904', 'ayse.kurt@gmail.com', 1000.00),
(5, 'Ali Çelik', '05345678905', 'ali.celik@gmail.com', 1000.00),
(6, 'Zeynep Taş', '05345678906', 'zeynep.tas@gmail.com', 1000.00),
(7, 'Murat Aksoy', '05345678907', 'murat.aksoy@gmail.com', 1000.00),
(8, 'Elif Öz', '05345678908', 'elif.oz@gmail.com', 1000.00),
(9, 'Kemal Can', '05345678909', 'kemal.can@gmail.com', 1000.00);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `randevular`
--

DROP TABLE IF EXISTS `randevular`;
CREATE TABLE IF NOT EXISTS `randevular` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hasta_ad` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefon` varchar(15) DEFAULT NULL,
  `hizmet_id` int DEFAULT NULL,
  `personel_id` int DEFAULT NULL,
  `randevu_tarihi` date DEFAULT NULL,
  `randevu_saati` time DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `hizmet_id` (`hizmet_id`),
  KEY `personel_id` (`personel_id`)
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `randevular`
--

INSERT INTO `randevular` (`id`, `hasta_ad`, `email`, `telefon`, `hizmet_id`, `personel_id`, `randevu_tarihi`, `randevu_saati`) VALUES
(1, 'Ali Can', 'ali.can@gmail.com', '05341234567', 1, 1, '2024-01-12', '10:00:00'),
(2, 'Ayşe Demir', 'ayse.demir@gmail.com', '05341234568', 2, 2, '2024-01-11', '11:00:00'),
(3, 'Mehmet Kaya', 'mehmet.kaya@gmail.com', '05341234569', 3, 1, '2024-01-12', '12:00:00'),
(4, 'Fatma Yılmaz', 'fatma.yilmaz@gmail.com', '05341234570', 4, 4, '2024-01-13', '13:00:00'),
(5, 'Ahmet Kurt', 'ahmet.kurt@gmail.com', '05341234571', 5, 5, '2024-01-14', '14:00:00'),
(7, 'Kemal Aksoy', 'kemal.aksoy@gmail.com', '05341234573', 7, 7, '2024-01-16', '16:00:00'),
(9, 'Murat Eren', 'murat.eren@gmail.com', '05341234575', 9, 9, '2024-01-19', '18:00:00'),
(74, 'Elif Yıldırım', 'elif.yildirim@gmail.com', '5551110012', 2, 2, '2024-12-18', '11:30:00');

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `randevular`
--
ALTER TABLE `randevular`
  ADD CONSTRAINT `randevular_ibfk_1` FOREIGN KEY (`hizmet_id`) REFERENCES `hizmetler` (`id`),
  ADD CONSTRAINT `randevular_ibfk_2` FOREIGN KEY (`personel_id`) REFERENCES `personeller` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
