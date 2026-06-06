CREATE DATABASE  IF NOT EXISTS `cinebilet` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `cinebilet`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: cinebilet
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `biletler`
--

DROP TABLE IF EXISTS `biletler`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `biletler` (
  `BiletID` int NOT NULL AUTO_INCREMENT,
  `KullaniciID` int DEFAULT NULL,
  `EtkinlikID` int DEFAULT NULL,
  `Durum` enum('Aktif','Iptal') DEFAULT 'Aktif',
  `SatinAlmaTarihi` datetime DEFAULT CURRENT_TIMESTAMP,
  `koltuk_no` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`BiletID`),
  KEY `fk_bilet_kullanici` (`KullaniciID`),
  KEY `fk_bilet_etkinlik` (`EtkinlikID`),
  CONSTRAINT `fk_bilet_etkinlik` FOREIGN KEY (`EtkinlikID`) REFERENCES `etkinlikler` (`EtkinlikID`),
  CONSTRAINT `fk_bilet_kullanici` FOREIGN KEY (`KullaniciID`) REFERENCES `kullanicilar` (`KullaniciID`)
) ENGINE=InnoDB AUTO_INCREMENT=181 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `biletler`
--

LOCK TABLES `biletler` WRITE;
/*!40000 ALTER TABLE `biletler` DISABLE KEYS */;
INSERT INTO `biletler` VALUES (1,1,1,'Iptal','2026-05-13 13:58:46',NULL),(142,1,2,'Aktif','2026-05-30 20:23:29','C5'),(143,1,2,'Aktif','2026-05-30 20:23:29','C6'),(144,1,3,'Aktif','2026-05-30 20:26:57','D9'),(145,1,3,'Aktif','2026-05-30 20:26:57','D10'),(146,4,2,'Iptal','2026-05-30 20:44:59','D4'),(147,4,2,'Iptal','2026-05-30 20:44:59','D5'),(148,5,3,'Aktif','2026-05-30 20:45:49','A6'),(149,5,3,'Aktif','2026-05-30 20:45:49','A5'),(150,4,5,'Iptal','2026-05-31 17:08:31','C3'),(151,4,5,'Iptal','2026-05-31 17:08:31','C4'),(173,4,2,'Iptal','2026-06-01 23:10:49','B5'),(174,4,2,'Iptal','2026-06-01 23:10:49','B6'),(175,4,3,'Aktif','2026-06-01 23:11:56','D4'),(176,4,3,'Aktif','2026-06-01 23:11:56','D5'),(177,4,17,'Iptal','2026-06-01 23:23:07','C5'),(178,4,17,'Iptal','2026-06-01 23:23:07','C6'),(179,4,10,'Aktif','2026-06-01 23:29:26','F5'),(180,4,10,'Aktif','2026-06-01 23:29:26','F6');
/*!40000 ALTER TABLE `biletler` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_BiletIptal` AFTER UPDATE ON `biletler` FOR EACH ROW BEGIN
    -- Eğer bilet iptal edildiyse log tablosuna yaz
    IF OLD.Durum = 'Aktif' AND NEW.Durum = 'Iptal' THEN
        INSERT INTO IptalLoglari (BiletID) VALUES (OLD.BiletID);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_BiletSilmeLog` BEFORE DELETE ON `biletler` FOR EACH ROW BEGIN
    INSERT INTO SilinenBiletLog (BiletID, EtkinlikID, KullaniciID, Silinen_Islem_Detay)
    VALUES (
        OLD.BiletID, 
        OLD.EtkinlikID, 
        OLD.KullaniciID, 
        CONCAT('Bilet ID: ', OLD.BiletID, ' olan kayıt sistemden kaldırıldı.')
    );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `etkinlikkategori`
--

DROP TABLE IF EXISTS `etkinlikkategori`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `etkinlikkategori` (
  `EtkinlikID` int NOT NULL,
  `KategoriID` int NOT NULL,
  PRIMARY KEY (`EtkinlikID`,`KategoriID`),
  KEY `KategoriID` (`KategoriID`),
  CONSTRAINT `etkinlikkategori_ibfk_1` FOREIGN KEY (`EtkinlikID`) REFERENCES `etkinlikler` (`EtkinlikID`) ON DELETE CASCADE,
  CONSTRAINT `etkinlikkategori_ibfk_2` FOREIGN KEY (`KategoriID`) REFERENCES `kategoriler` (`KategoriID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `etkinlikkategori`
--

LOCK TABLES `etkinlikkategori` WRITE;
/*!40000 ALTER TABLE `etkinlikkategori` DISABLE KEYS */;
INSERT INTO `etkinlikkategori` VALUES (2,1),(3,1),(6,1),(17,1),(2,2),(5,2),(6,2),(17,2),(1,3),(4,3),(5,3),(7,3),(9,3),(11,3),(18,3),(1,4),(3,4),(7,4),(10,5),(8,6),(9,6),(10,6),(11,6),(12,7);
/*!40000 ALTER TABLE `etkinlikkategori` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `etkinlikler`
--

DROP TABLE IF EXISTS `etkinlikler`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `etkinlikler` (
  `EtkinlikID` int NOT NULL AUTO_INCREMENT,
  `EtkinlikAdi` varchar(100) DEFAULT NULL,
  `Fiyat` decimal(10,2) DEFAULT NULL,
  `SalonID` int DEFAULT NULL,
  `seans_saati` time DEFAULT NULL,
  `EtkinlikTarihi` date NOT NULL DEFAULT (curdate()),
  `Durum` enum('Aktif','Pasif') DEFAULT 'Aktif',
  PRIMARY KEY (`EtkinlikID`),
  KEY `fk_etkinlik_salon` (`SalonID`),
  CONSTRAINT `fk_etkinlik_salon` FOREIGN KEY (`SalonID`) REFERENCES `salonlar` (`SalonID`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `etkinlikler`
--

LOCK TABLES `etkinlikler` WRITE;
/*!40000 ALTER TABLE `etkinlikler` DISABLE KEYS */;
INSERT INTO `etkinlikler` VALUES (1,'Joker 2',120.00,2,'15:15:00','2026-06-01','Aktif'),(2,'Dune: Part Two',150.00,7,'15:15:00','2026-06-01','Aktif'),(3,'The Batman',140.00,6,'17:00:00','2026-06-01','Aktif'),(4,'Oppenheimer',160.00,7,'15:15:00','2026-06-01','Aktif'),(5,'Interstellar (IMAX)',200.00,8,'23:30:00','2026-06-01','Aktif'),(6,'Blade Runner 2049',130.00,3,'13:45:00','2026-06-01','Aktif'),(7,'Fight Club',110.00,7,'12:30:00','2026-06-01','Aktif'),(8,'Hamlet (Tiyatro)',250.00,3,'17:00:00','2026-06-01','Aktif'),(9,'Amadeus (Tiyatro)',300.00,1,'15:15:00','2026-06-01','Aktif'),(10,'Cimri (Tiyatro)',180.00,5,'17:00:00','2026-06-01','Aktif'),(11,'Bir Delinin Hatıra Defteri',150.00,2,'23:30:00','2026-06-01','Aktif'),(12,'Kuğu Gölü Balesi',350.00,4,'17:00:00','2026-06-01','Aktif'),(14,'Superman',200.00,1,'20:20:00','2026-06-01','Pasif'),(15,'Termiantor',150.00,7,'18:00:00','2026-06-01','Pasif'),(16,'The Odyssey',250.00,1,'12:00:00','2026-06-01','Pasif'),(17,'Terminator',300.00,2,'20:00:00','2026-06-02','Aktif'),(18,'Tarkan',225.00,6,'18:30:00','2026-02-01','Aktif');
/*!40000 ALTER TABLE `etkinlikler` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `filmyorumlari`
--

DROP TABLE IF EXISTS `filmyorumlari`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `filmyorumlari` (
  `YorumID` int NOT NULL AUTO_INCREMENT,
  `KullaniciID` int DEFAULT NULL,
  `EtkinlikID` int DEFAULT NULL,
  `Puan` int DEFAULT NULL,
  `YorumMetni` text,
  `YorumTarihi` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`YorumID`),
  KEY `fk_yorum_kullanici` (`KullaniciID`),
  KEY `fk_yorum_etkinlik` (`EtkinlikID`),
  CONSTRAINT `fk_yorum_etkinlik` FOREIGN KEY (`EtkinlikID`) REFERENCES `etkinlikler` (`EtkinlikID`),
  CONSTRAINT `fk_yorum_kullanici` FOREIGN KEY (`KullaniciID`) REFERENCES `kullanicilar` (`KullaniciID`),
  CONSTRAINT `filmyorumlari_chk_1` CHECK (((`Puan` >= 1) and (`Puan` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `filmyorumlari`
--

LOCK TABLES `filmyorumlari` WRITE;
/*!40000 ALTER TABLE `filmyorumlari` DISABLE KEYS */;
INSERT INTO `filmyorumlari` VALUES (1,1,1,5,'Güzel','2026-05-20 15:58:12'),(2,1,5,5,'İnanılmaz ','2026-05-20 16:26:34'),(3,1,11,3,'Gayet iyidi ','2026-05-20 21:39:29'),(4,1,7,4,'**********','2026-05-20 21:39:45'),(5,4,17,5,'Harika bir film kesinlikle izleyiniz ','2026-06-01 23:23:41');
/*!40000 ALTER TABLE `filmyorumlari` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `iptalloglari`
--

DROP TABLE IF EXISTS `iptalloglari`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `iptalloglari` (
  `LogID` int NOT NULL AUTO_INCREMENT,
  `BiletID` int DEFAULT NULL,
  `IptalTarihi` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`LogID`)
) ENGINE=InnoDB AUTO_INCREMENT=218 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `iptalloglari`
--

LOCK TABLES `iptalloglari` WRITE;
/*!40000 ALTER TABLE `iptalloglari` DISABLE KEYS */;
INSERT INTO `iptalloglari` VALUES (1,1,'2026-05-13 13:58:46'),(2,94,'2026-05-20 16:27:17'),(3,95,'2026-05-20 16:27:17'),(4,96,'2026-05-20 16:27:17'),(5,97,'2026-05-20 16:27:17'),(6,98,'2026-05-20 16:27:17'),(9,90,'2026-05-20 16:27:26'),(10,99,'2026-05-20 16:57:42'),(11,91,'2026-05-20 16:57:44'),(12,92,'2026-05-20 16:57:44'),(13,93,'2026-05-20 16:57:44'),(14,86,'2026-05-20 16:57:46'),(15,87,'2026-05-20 16:57:46'),(16,88,'2026-05-20 16:57:46'),(17,89,'2026-05-20 16:57:46'),(21,82,'2026-05-20 16:57:48'),(22,83,'2026-05-20 16:57:48'),(23,84,'2026-05-20 16:57:48'),(24,85,'2026-05-20 16:57:48'),(28,81,'2026-05-20 16:57:50'),(29,80,'2026-05-20 16:57:53'),(30,79,'2026-05-20 16:57:59'),(31,2,'2026-05-20 16:58:10'),(32,77,'2026-05-20 21:23:13'),(33,78,'2026-05-20 21:23:13'),(34,135,'2026-05-21 10:00:51'),(35,136,'2026-05-21 10:00:51'),(36,137,'2026-05-21 10:00:51'),(37,138,'2026-05-21 10:00:51'),(38,139,'2026-05-21 10:00:51'),(39,110,'2026-05-30 20:15:16'),(40,111,'2026-05-30 20:15:16'),(41,112,'2026-05-30 20:15:16'),(42,113,'2026-05-30 20:15:16'),(43,114,'2026-05-30 20:15:16'),(44,115,'2026-05-30 20:15:16'),(45,116,'2026-05-30 20:15:16'),(46,117,'2026-05-30 20:15:16'),(47,118,'2026-05-30 20:15:16'),(48,119,'2026-05-30 20:15:16'),(49,120,'2026-05-30 20:15:16'),(50,121,'2026-05-30 20:15:16'),(51,122,'2026-05-30 20:15:16'),(52,123,'2026-05-30 20:15:16'),(53,124,'2026-05-30 20:15:16'),(54,125,'2026-05-30 20:15:16'),(55,126,'2026-05-30 20:15:16'),(56,127,'2026-05-30 20:15:16'),(57,128,'2026-05-30 20:15:16'),(58,129,'2026-05-30 20:15:16'),(59,130,'2026-05-30 20:15:16'),(60,131,'2026-05-30 20:15:16'),(61,132,'2026-05-30 20:15:16'),(62,133,'2026-05-30 20:15:16'),(63,134,'2026-05-30 20:15:16'),(70,100,'2026-05-30 20:15:18'),(71,101,'2026-05-30 20:15:18'),(72,102,'2026-05-30 20:15:18'),(73,103,'2026-05-30 20:15:18'),(74,104,'2026-05-30 20:15:18'),(75,105,'2026-05-30 20:15:18'),(76,106,'2026-05-30 20:15:18'),(77,107,'2026-05-30 20:15:18'),(78,108,'2026-05-30 20:15:18'),(79,109,'2026-05-30 20:15:18'),(85,75,'2026-05-30 20:15:21'),(86,76,'2026-05-30 20:15:21'),(88,72,'2026-05-30 20:15:25'),(89,73,'2026-05-30 20:15:25'),(90,74,'2026-05-30 20:15:25'),(91,71,'2026-05-30 20:15:28'),(92,70,'2026-05-30 20:15:30'),(93,69,'2026-05-30 20:15:32'),(94,67,'2026-05-30 20:15:34'),(95,68,'2026-05-30 20:15:34'),(97,45,'2026-05-30 20:15:36'),(98,46,'2026-05-30 20:15:36'),(99,47,'2026-05-30 20:15:36'),(100,48,'2026-05-30 20:15:36'),(101,49,'2026-05-30 20:15:36'),(102,50,'2026-05-30 20:15:36'),(103,51,'2026-05-30 20:15:36'),(104,52,'2026-05-30 20:15:36'),(105,53,'2026-05-30 20:15:36'),(106,54,'2026-05-30 20:15:36'),(107,55,'2026-05-30 20:15:36'),(108,56,'2026-05-30 20:15:36'),(109,57,'2026-05-30 20:15:36'),(110,58,'2026-05-30 20:15:36'),(111,59,'2026-05-30 20:15:36'),(112,60,'2026-05-30 20:15:36'),(113,61,'2026-05-30 20:15:36'),(114,62,'2026-05-30 20:15:36'),(115,63,'2026-05-30 20:15:36'),(116,64,'2026-05-30 20:15:36'),(117,65,'2026-05-30 20:15:36'),(118,66,'2026-05-30 20:15:36'),(128,35,'2026-05-30 20:15:38'),(129,36,'2026-05-30 20:15:38'),(130,37,'2026-05-30 20:15:38'),(131,38,'2026-05-30 20:15:38'),(132,39,'2026-05-30 20:15:38'),(133,40,'2026-05-30 20:15:38'),(134,41,'2026-05-30 20:15:38'),(135,42,'2026-05-30 20:15:38'),(136,43,'2026-05-30 20:15:38'),(137,44,'2026-05-30 20:15:38'),(143,34,'2026-05-30 20:15:40'),(144,33,'2026-05-30 20:15:42'),(145,32,'2026-05-30 20:15:44'),(146,31,'2026-05-30 20:15:48'),(147,29,'2026-05-30 20:15:50'),(148,30,'2026-05-30 20:15:50'),(150,28,'2026-05-30 20:15:52'),(151,27,'2026-05-30 20:15:54'),(152,26,'2026-05-30 20:15:56'),(153,24,'2026-05-30 20:15:58'),(154,25,'2026-05-30 20:15:58'),(156,23,'2026-05-30 20:16:00'),(157,21,'2026-05-30 20:16:02'),(158,22,'2026-05-30 20:16:02'),(160,20,'2026-05-30 20:16:04'),(161,19,'2026-05-30 20:16:06'),(162,17,'2026-05-30 20:16:11'),(163,18,'2026-05-30 20:16:11'),(165,16,'2026-05-30 20:16:14'),(166,15,'2026-05-30 20:16:16'),(167,14,'2026-05-30 20:16:19'),(168,13,'2026-05-30 20:16:21'),(169,12,'2026-05-30 20:16:24'),(170,11,'2026-05-30 20:16:26'),(171,10,'2026-05-30 20:16:28'),(172,9,'2026-05-30 20:16:31'),(173,8,'2026-05-30 20:16:39'),(174,7,'2026-05-30 20:16:41'),(175,6,'2026-05-30 20:16:45'),(176,5,'2026-05-30 20:16:47'),(177,4,'2026-05-30 20:16:49'),(178,3,'2026-05-30 20:16:51'),(179,140,'2026-05-30 20:19:44'),(180,141,'2026-05-30 20:19:44'),(181,156,'2026-06-01 22:31:16'),(182,157,'2026-06-01 22:31:16'),(184,152,'2026-06-01 22:31:20'),(185,153,'2026-06-01 22:31:20'),(186,154,'2026-06-01 22:31:20'),(187,155,'2026-06-01 22:31:20'),(191,166,'2026-06-01 22:32:39'),(192,167,'2026-06-01 22:32:39'),(193,168,'2026-06-01 22:32:39'),(194,163,'2026-06-01 22:32:41'),(195,164,'2026-06-01 22:32:41'),(196,165,'2026-06-01 22:32:41'),(197,161,'2026-06-01 22:32:43'),(198,162,'2026-06-01 22:32:43'),(200,160,'2026-06-01 22:32:45'),(201,171,'2026-06-01 22:44:11'),(202,172,'2026-06-01 22:44:11'),(204,169,'2026-06-01 22:44:14'),(205,170,'2026-06-01 22:44:14'),(207,158,'2026-06-01 22:44:20'),(208,159,'2026-06-01 22:44:20'),(210,150,'2026-06-01 23:10:43'),(211,151,'2026-06-01 23:10:43'),(212,146,'2026-06-01 23:10:55'),(213,147,'2026-06-01 23:10:55'),(214,173,'2026-06-01 23:10:55'),(215,174,'2026-06-01 23:10:55'),(216,177,'2026-06-01 23:26:03'),(217,178,'2026-06-01 23:26:03');
/*!40000 ALTER TABLE `iptalloglari` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `islemloglari`
--

DROP TABLE IF EXISTS `islemloglari`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `islemloglari` (
  `LogID` int NOT NULL AUTO_INCREMENT,
  `KullaniciID` int DEFAULT NULL,
  `IslemTipi` varchar(50) DEFAULT NULL,
  `EskiBakiye` decimal(10,2) DEFAULT NULL,
  `YeniBakiye` decimal(10,2) DEFAULT NULL,
  `Tutar` decimal(10,2) DEFAULT NULL,
  `IslemTarihi` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`LogID`),
  KEY `KullaniciID` (`KullaniciID`),
  CONSTRAINT `islemloglari_ibfk_1` FOREIGN KEY (`KullaniciID`) REFERENCES `kullanicilar` (`KullaniciID`)
) ENGINE=InnoDB AUTO_INCREMENT=158 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `islemloglari`
--

LOCK TABLES `islemloglari` WRITE;
/*!40000 ALTER TABLE `islemloglari` DISABLE KEYS */;
INSERT INTO `islemloglari` VALUES (1,1,'BAKIYE_YUKLEME',120.00,620.00,500.00,'2026-05-13 17:19:53'),(2,1,'BILET_ALIM',620.00,460.00,160.00,'2026-05-13 17:20:05'),(3,1,'BILET_ALIM',460.00,300.00,160.00,'2026-05-13 17:20:06'),(4,1,'BILET_ALIM',300.00,140.00,160.00,'2026-05-13 17:20:07'),(5,1,'BAKIYE_YUKLEME',140.00,340.00,200.00,'2026-05-13 17:20:17'),(6,1,'BILET_ALIM',340.00,90.00,250.00,'2026-05-13 17:20:21'),(7,1,'BAKIYE_YUKLEME',90.00,10090.00,10000.00,'2026-05-13 17:20:38'),(8,1,'BILET_ALIM',10090.00,9740.00,350.00,'2026-05-13 17:20:41'),(9,1,'BILET_ALIM',9740.00,9390.00,350.00,'2026-05-13 17:20:42'),(10,1,'BILET_ALIM',9390.00,9040.00,350.00,'2026-05-13 17:20:43'),(11,1,'BILET_ALIM',9040.00,8690.00,350.00,'2026-05-13 17:20:44'),(12,1,'BILET_ALIM',8690.00,8340.00,350.00,'2026-05-13 17:20:44'),(13,1,'BILET_ALIM',8340.00,7990.00,350.00,'2026-05-13 17:20:45'),(14,1,'BILET_ALIM',7990.00,7840.00,150.00,'2026-05-13 17:24:01'),(15,1,'BILET_ALIM',7840.00,7690.00,150.00,'2026-05-13 17:24:02'),(16,1,'BILET_ALIM',7690.00,7540.00,150.00,'2026-05-13 17:24:02'),(17,1,'BILET_ALIM',7540.00,7390.00,150.00,'2026-05-13 17:24:03'),(18,1,'BILET_ALIM',7390.00,7240.00,150.00,'2026-05-13 17:24:04'),(19,1,'BILET_ALIM',7240.00,7090.00,150.00,'2026-05-13 17:24:04'),(20,1,'BILET_ALIM',7090.00,6930.00,160.00,'2026-05-13 17:25:18'),(21,1,'BILET_ALIM',6930.00,6770.00,160.00,'2026-05-13 17:25:19'),(22,1,'BILET_ALIM',6770.00,6610.00,160.00,'2026-05-13 17:25:20'),(23,1,'BILET_ALIM',6610.00,6450.00,160.00,'2026-05-13 17:25:21'),(24,1,'BILET_ALIM',6450.00,6290.00,160.00,'2026-05-13 17:25:21'),(25,1,'BILET_ALIM',6290.00,6140.00,150.00,'2026-05-13 17:25:30'),(26,1,'BILET_ALIM',6140.00,5990.00,150.00,'2026-05-13 17:25:33'),(27,1,'BILET_ALIM',5990.00,5870.00,120.00,'2026-05-20 15:42:07'),(28,1,'BILET_ALIM',5870.00,5750.00,120.00,'2026-05-20 15:58:06'),(29,1,'BILET_ALIM',5750.00,4550.00,1200.00,'2026-05-20 16:03:14'),(30,1,'BILET_ALIM',4550.00,1250.00,3300.00,'2026-05-20 16:06:21'),(31,1,'BILET_ALIM',1250.00,950.00,300.00,'2026-05-20 16:09:57'),(32,1,'BILET_ALIM',950.00,750.00,200.00,'2026-05-20 16:10:11'),(33,1,'BILET_ALIM',750.00,400.00,350.00,'2026-05-20 16:13:26'),(34,1,'BILET_ALIM',400.00,250.00,150.00,'2026-05-20 16:13:32'),(35,1,'BAKIYE_YUKLEME',250.00,1250.00,1000.00,'2026-05-20 16:13:45'),(36,1,'BILET_ALIM',1250.00,500.00,750.00,'2026-05-20 16:13:49'),(37,1,'BILET_ALIM',500.00,280.00,220.00,'2026-05-20 16:14:16'),(38,1,'BILET_ALIM',280.00,60.00,220.00,'2026-05-20 16:15:00'),(39,1,'BAKIYE_YUKLEME',60.00,10060.00,10000.00,'2026-05-20 16:15:16'),(40,1,'BILET_ALIM',10060.00,9950.00,110.00,'2026-05-20 16:15:19'),(41,1,'BILET_ALIM',9950.00,9770.00,180.00,'2026-05-20 16:17:05'),(42,1,'BILET_ALIM',9770.00,9590.00,180.00,'2026-05-20 16:17:10'),(43,1,'BILET_ALIM',9590.00,8870.00,720.00,'2026-05-20 16:17:17'),(44,1,'BILET_ALIM',8870.00,8150.00,720.00,'2026-05-20 16:17:37'),(45,1,'BILET_ALIM',8150.00,7900.00,250.00,'2026-05-20 16:21:09'),(46,1,'BILET_ALIM',7900.00,7300.00,600.00,'2026-05-20 16:21:11'),(47,1,'BILET_ALIM',7300.00,6050.00,1250.00,'2026-05-20 16:21:13'),(48,1,'BAKIYE_YUKLEME',6050.00,7300.00,1250.00,'2026-05-20 16:27:17'),(49,1,'BAKIYE_YUKLEME',7300.00,7550.00,250.00,'2026-05-20 16:27:26'),(50,1,'BILET_ALIM',7550.00,7430.00,120.00,'2026-05-20 16:30:15'),(51,1,'BAKIYE_YUKLEME',7430.00,7550.00,120.00,'2026-05-20 16:57:42'),(52,1,'BAKIYE_YUKLEME',7550.00,8150.00,600.00,'2026-05-20 16:57:44'),(53,1,'BAKIYE_YUKLEME',8150.00,8870.00,720.00,'2026-05-20 16:57:46'),(54,1,'BAKIYE_YUKLEME',8870.00,9590.00,720.00,'2026-05-20 16:57:48'),(55,1,'BAKIYE_YUKLEME',9590.00,9770.00,180.00,'2026-05-20 16:57:50'),(56,1,'BAKIYE_YUKLEME',9770.00,9950.00,180.00,'2026-05-20 16:57:53'),(57,1,'BAKIYE_YUKLEME',9950.00,10060.00,110.00,'2026-05-20 16:57:59'),(58,1,'BAKIYE_YUKLEME',10060.00,10180.00,120.00,'2026-05-20 16:58:10'),(59,1,'BAKIYE_YUKLEME',10180.00,10400.00,220.00,'2026-05-20 21:23:13'),(60,1,'BILET_ALIM',10400.00,9000.00,1400.00,'2026-05-20 21:30:59'),(61,1,'BILET_ALIM',9000.00,2750.00,6250.00,'2026-05-20 21:31:19'),(62,1,'BILET_ALIM',2750.00,2150.00,600.00,'2026-05-21 10:00:42'),(63,1,'BAKIYE_YUKLEME',2150.00,2750.00,600.00,'2026-05-21 10:00:51'),(64,1,'BAKIYE_YUKLEME',2750.00,9000.00,6250.00,'2026-05-30 20:15:16'),(65,1,'BAKIYE_YUKLEME',9000.00,10400.00,1400.00,'2026-05-30 20:15:18'),(66,1,'BAKIYE_YUKLEME',10400.00,10620.00,220.00,'2026-05-30 20:15:21'),(67,1,'BAKIYE_YUKLEME',10620.00,11370.00,750.00,'2026-05-30 20:15:25'),(68,1,'BAKIYE_YUKLEME',11370.00,11520.00,150.00,'2026-05-30 20:15:28'),(69,1,'BAKIYE_YUKLEME',11520.00,11870.00,350.00,'2026-05-30 20:15:30'),(70,1,'BAKIYE_YUKLEME',11870.00,12070.00,200.00,'2026-05-30 20:15:32'),(71,1,'BAKIYE_YUKLEME',12070.00,12370.00,300.00,'2026-05-30 20:15:34'),(72,1,'BAKIYE_YUKLEME',12370.00,15670.00,3300.00,'2026-05-30 20:15:36'),(73,1,'BAKIYE_YUKLEME',15670.00,16870.00,1200.00,'2026-05-30 20:15:38'),(74,1,'BAKIYE_YUKLEME',16870.00,16990.00,120.00,'2026-05-30 20:15:40'),(75,1,'BAKIYE_YUKLEME',16990.00,17110.00,120.00,'2026-05-30 20:15:42'),(76,1,'BAKIYE_YUKLEME',17110.00,17260.00,150.00,'2026-05-30 20:15:44'),(77,1,'BAKIYE_YUKLEME',17260.00,17410.00,150.00,'2026-05-30 20:15:48'),(78,1,'BAKIYE_YUKLEME',17410.00,17730.00,320.00,'2026-05-30 20:15:50'),(79,1,'BAKIYE_YUKLEME',17730.00,17890.00,160.00,'2026-05-30 20:15:52'),(80,1,'BAKIYE_YUKLEME',17890.00,18050.00,160.00,'2026-05-30 20:15:54'),(81,1,'BAKIYE_YUKLEME',18050.00,18210.00,160.00,'2026-05-30 20:15:56'),(82,1,'BAKIYE_YUKLEME',18210.00,18510.00,300.00,'2026-05-30 20:15:58'),(83,1,'BAKIYE_YUKLEME',18510.00,18660.00,150.00,'2026-05-30 20:16:00'),(84,1,'BAKIYE_YUKLEME',18660.00,18960.00,300.00,'2026-05-30 20:16:02'),(85,1,'BAKIYE_YUKLEME',18960.00,19110.00,150.00,'2026-05-30 20:16:04'),(86,1,'BAKIYE_YUKLEME',19110.00,19460.00,350.00,'2026-05-30 20:16:06'),(87,1,'BAKIYE_YUKLEME',19460.00,20160.00,700.00,'2026-05-30 20:16:11'),(88,1,'BAKIYE_YUKLEME',20160.00,20510.00,350.00,'2026-05-30 20:16:14'),(89,1,'BAKIYE_YUKLEME',20510.00,20860.00,350.00,'2026-05-30 20:16:16'),(90,1,'BAKIYE_YUKLEME',20860.00,21210.00,350.00,'2026-05-30 20:16:19'),(91,1,'BAKIYE_YUKLEME',21210.00,21460.00,250.00,'2026-05-30 20:16:21'),(92,1,'BAKIYE_YUKLEME',21460.00,21620.00,160.00,'2026-05-30 20:16:24'),(93,1,'BAKIYE_YUKLEME',21620.00,21780.00,160.00,'2026-05-30 20:16:26'),(94,1,'BAKIYE_YUKLEME',21780.00,21940.00,160.00,'2026-05-30 20:16:28'),(95,1,'BAKIYE_YUKLEME',21940.00,22090.00,150.00,'2026-05-30 20:16:31'),(96,1,'BAKIYE_YUKLEME',22090.00,22230.00,140.00,'2026-05-30 20:16:39'),(97,1,'BAKIYE_YUKLEME',22230.00,22370.00,140.00,'2026-05-30 20:16:41'),(98,1,'BAKIYE_YUKLEME',22370.00,22520.00,150.00,'2026-05-30 20:16:45'),(99,1,'BAKIYE_YUKLEME',22520.00,22670.00,150.00,'2026-05-30 20:16:47'),(100,1,'BAKIYE_YUKLEME',22670.00,22850.00,180.00,'2026-05-30 20:16:49'),(101,1,'BAKIYE_YUKLEME',22850.00,22970.00,120.00,'2026-05-30 20:16:51'),(102,1,'BILET_ALIM',22970.00,22830.00,140.00,'2026-05-30 20:19:11'),(103,1,'BILET_ALIM',22830.00,22690.00,140.00,'2026-05-30 20:19:11'),(104,1,'BAKIYE_YUKLEME',22690.00,22970.00,280.00,'2026-05-30 20:19:44'),(105,1,'BILET_ALIM',22970.00,22820.00,150.00,'2026-05-30 20:23:29'),(106,1,'BILET_ALIM',22820.00,22670.00,150.00,'2026-05-30 20:23:29'),(107,1,'BILET_ALIM',22670.00,22530.00,140.00,'2026-05-30 20:26:57'),(108,1,'BILET_ALIM',22530.00,22390.00,140.00,'2026-05-30 20:26:57'),(109,4,'BAKIYE_YUKLEME',0.00,1000.00,1000.00,'2026-05-30 20:44:56'),(110,4,'BILET_ALIM',1000.00,850.00,150.00,'2026-05-30 20:44:59'),(111,4,'BILET_ALIM',850.00,700.00,150.00,'2026-05-30 20:44:59'),(112,5,'BAKIYE_YUKLEME',0.00,370.00,370.00,'2026-05-30 20:45:45'),(113,5,'BILET_ALIM',370.00,230.00,140.00,'2026-05-30 20:45:49'),(114,5,'BILET_ALIM',230.00,90.00,140.00,'2026-05-30 20:45:49'),(115,4,'BILET_ALIM',700.00,500.00,200.00,'2026-05-31 17:08:31'),(116,4,'BILET_ALIM',500.00,300.00,200.00,'2026-05-31 17:08:31'),(117,4,'BAKIYE_YUKLEME',300.00,2300.00,2000.00,'2026-06-01 21:56:32'),(118,4,'BILET_ALIM',2300.00,2180.00,120.00,'2026-06-01 21:56:37'),(119,4,'BILET_ALIM',2180.00,2060.00,120.00,'2026-06-01 21:56:37'),(120,4,'BILET_ALIM',2060.00,1940.00,120.00,'2026-06-01 21:56:37'),(121,4,'BILET_ALIM',1940.00,1820.00,120.00,'2026-06-01 21:56:37'),(122,4,'BILET_ALIM',1820.00,1670.00,150.00,'2026-06-01 22:26:14'),(123,4,'BILET_ALIM',1670.00,1520.00,150.00,'2026-06-01 22:26:14'),(124,4,'BAKIYE_YUKLEME',1520.00,1820.00,300.00,'2026-06-01 22:31:16'),(125,4,'BAKIYE_YUKLEME',1820.00,2300.00,480.00,'2026-06-01 22:31:20'),(126,4,'BILET_ALIM',2300.00,2180.00,120.00,'2026-06-01 22:31:58'),(127,4,'BILET_ALIM',2180.00,2060.00,120.00,'2026-06-01 22:31:58'),(128,4,'BILET_ALIM',2060.00,1910.00,150.00,'2026-06-01 22:32:13'),(129,4,'BILET_ALIM',1910.00,1760.00,150.00,'2026-06-01 22:32:14'),(130,4,'BILET_ALIM',1760.00,1610.00,150.00,'2026-06-01 22:32:14'),(131,4,'BILET_ALIM',1610.00,1460.00,150.00,'2026-06-01 22:32:26'),(132,4,'BILET_ALIM',1460.00,1310.00,150.00,'2026-06-01 22:32:26'),(133,4,'BILET_ALIM',1310.00,1160.00,150.00,'2026-06-01 22:32:26'),(134,4,'BILET_ALIM',1160.00,1010.00,150.00,'2026-06-01 22:32:35'),(135,4,'BILET_ALIM',1010.00,860.00,150.00,'2026-06-01 22:32:35'),(136,4,'BILET_ALIM',860.00,710.00,150.00,'2026-06-01 22:32:35'),(137,4,'BAKIYE_YUKLEME',710.00,1160.00,450.00,'2026-06-01 22:32:39'),(138,4,'BAKIYE_YUKLEME',1160.00,1610.00,450.00,'2026-06-01 22:32:41'),(139,4,'BAKIYE_YUKLEME',1610.00,1910.00,300.00,'2026-06-01 22:32:43'),(140,4,'BAKIYE_YUKLEME',1910.00,2060.00,150.00,'2026-06-01 22:32:45'),(141,4,'BILET_ALIM',2060.00,1810.00,250.00,'2026-06-01 22:33:39'),(142,4,'BILET_ALIM',1810.00,1560.00,250.00,'2026-06-01 22:33:39'),(143,4,'BILET_ALIM',1560.00,1380.00,180.00,'2026-06-01 22:44:02'),(144,4,'BILET_ALIM',1380.00,1200.00,180.00,'2026-06-01 22:44:02'),(145,4,'BAKIYE_YUKLEME',1200.00,1560.00,360.00,'2026-06-01 22:44:11'),(146,4,'BAKIYE_YUKLEME',1560.00,2060.00,500.00,'2026-06-01 22:44:14'),(147,4,'BAKIYE_YUKLEME',2060.00,2300.00,240.00,'2026-06-01 22:44:20'),(148,4,'BAKIYE_YUKLEME',2300.00,2700.00,400.00,'2026-06-01 23:10:43'),(149,4,'BILET_ALIM',2700.00,2400.00,300.00,'2026-06-01 23:10:49'),(150,4,'BAKIYE_YUKLEME',2400.00,3000.00,600.00,'2026-06-01 23:10:55'),(151,4,'BILET_ALIM',3000.00,2720.00,280.00,'2026-06-01 23:11:56'),(152,4,'BILET_ALIM',2720.00,2120.00,600.00,'2026-06-01 23:23:07'),(153,4,'BAKIYE_YUKLEME',2120.00,2270.00,150.00,'2026-06-01 23:24:26'),(154,4,'BAKIYE_YUKLEME',2270.00,2470.00,200.00,'2026-06-01 23:24:40'),(155,4,'BAKIYE_YUKLEME',2470.00,4470.00,2000.00,'2026-06-01 23:25:54'),(156,4,'BAKIYE_YUKLEME',4470.00,5070.00,600.00,'2026-06-01 23:26:03'),(157,4,'BILET_ALIM',5070.00,4710.00,360.00,'2026-06-01 23:29:26');
/*!40000 ALTER TABLE `islemloglari` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kategoriler`
--

DROP TABLE IF EXISTS `kategoriler`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kategoriler` (
  `KategoriID` int NOT NULL AUTO_INCREMENT,
  `KategoriAdi` varchar(50) NOT NULL,
  PRIMARY KEY (`KategoriID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kategoriler`
--

LOCK TABLES `kategoriler` WRITE;
/*!40000 ALTER TABLE `kategoriler` DISABLE KEYS */;
INSERT INTO `kategoriler` VALUES (1,'Aksiyon'),(2,'Bilim Kurgu'),(3,'Dram'),(4,'Gerilim'),(5,'Komedi'),(6,'Tiyatro'),(7,'Bale');
/*!40000 ALTER TABLE `kategoriler` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kullanicilar`
--

DROP TABLE IF EXISTS `kullanicilar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kullanicilar` (
  `KullaniciID` int NOT NULL AUTO_INCREMENT,
  `AdSoyad` varchar(100) DEFAULT NULL,
  `Bakiye` decimal(10,2) DEFAULT '0.00',
  `Rol` varchar(20) DEFAULT 'Kullanici',
  `email` varchar(100) DEFAULT NULL,
  `sifre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`KullaniciID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kullanicilar`
--

LOCK TABLES `kullanicilar` WRITE;
/*!40000 ALTER TABLE `kullanicilar` DISABLE KEYS */;
INSERT INTO `kullanicilar` VALUES (1,'Anıl Arda Kılıç',22390.00,'Admin',NULL,NULL),(2,'Ayşe Demir',150.00,'Kullanici',NULL,NULL),(3,'Ahmet Yılmaz',500.00,'Kullanici',NULL,NULL),(4,'Anıl Arda (YÖNETİCİ)',4710.00,'admin','yonetici@cinebilet.com','pbkdf2_sha256$1200000$mzfvSh2RszgmiykhhlyEGM$/e+C2XNanUGAwiUOs5ssfXmXi+6r/qFq04ylOcjgegA='),(5,'Akın Demir',90.00,'kullanici','akindemir@gmail.com','pbkdf2_sha256$1200000$u4No9GLS2cxxcwhBwySZR0$JG2FfmBKz2E4EkCVVXWI19j+K8xfChs2Fmuc60PZ4Bo=');
/*!40000 ALTER TABLE `kullanicilar` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_BakiyeLogla` AFTER UPDATE ON `kullanicilar` FOR EACH ROW BEGIN
    -- Sadece bakiye değiştiyse log tut
    IF OLD.Bakiye <> NEW.Bakiye THEN
        INSERT INTO IslemLoglari (KullaniciID, IslemTipi, EskiBakiye, YeniBakiye, Tutar)
        VALUES (
            NEW.KullaniciID, 
            IF(NEW.Bakiye > OLD.Bakiye, 'BAKIYE_YUKLEME', 'BILET_ALIM'),
            OLD.Bakiye, 
            NEW.Bakiye, 
            ABS(NEW.Bakiye - OLD.Bakiye)
        );
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `salonlar`
--

DROP TABLE IF EXISTS `salonlar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salonlar` (
  `SalonID` int NOT NULL AUTO_INCREMENT,
  `SalonAdi` varchar(50) NOT NULL,
  `ToplamKapasite` int NOT NULL,
  PRIMARY KEY (`SalonID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salonlar`
--

LOCK TABLES `salonlar` WRITE;
/*!40000 ALTER TABLE `salonlar` DISABLE KEYS */;
INSERT INTO `salonlar` VALUES (1,'IMAX Salon 1',150),(2,'VIP Salon',40),(3,'Standart Salon 3',100),(4,'Gold Class VIP',30),(5,'Salon 4 (Dolby Atmos)',120),(6,'Salon 5 (3D)',90),(7,'Açık Hava Sineması',200),(8,'Salon 7',80);
/*!40000 ALTER TABLE `salonlar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `silinenbiletlog`
--

DROP TABLE IF EXISTS `silinenbiletlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `silinenbiletlog` (
  `LogID` int NOT NULL AUTO_INCREMENT,
  `BiletID` int DEFAULT NULL,
  `EtkinlikID` int DEFAULT NULL,
  `KullaniciID` int DEFAULT NULL,
  `SilinmeTarihi` datetime DEFAULT CURRENT_TIMESTAMP,
  `Silinen_Islem_Detay` text,
  PRIMARY KEY (`LogID`)
) ENGINE=InnoDB AUTO_INCREMENT=162 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `silinenbiletlog`
--

LOCK TABLES `silinenbiletlog` WRITE;
/*!40000 ALTER TABLE `silinenbiletlog` DISABLE KEYS */;
INSERT INTO `silinenbiletlog` VALUES (1,94,8,1,'2026-05-20 16:27:17','Bilet ID: 94 olan kayıt sistemden kaldırıldı.'),(2,95,8,1,'2026-05-20 16:27:17','Bilet ID: 95 olan kayıt sistemden kaldırıldı.'),(3,96,8,1,'2026-05-20 16:27:17','Bilet ID: 96 olan kayıt sistemden kaldırıldı.'),(4,97,8,1,'2026-05-20 16:27:17','Bilet ID: 97 olan kayıt sistemden kaldırıldı.'),(5,98,8,1,'2026-05-20 16:27:17','Bilet ID: 98 olan kayıt sistemden kaldırıldı.'),(6,90,8,1,'2026-05-20 16:27:26','Bilet ID: 90 olan kayıt sistemden kaldırıldı.'),(7,99,1,1,'2026-05-20 16:57:42','Bilet ID: 99 olan kayıt sistemden kaldırıldı.'),(8,91,5,1,'2026-05-20 16:57:44','Bilet ID: 91 olan kayıt sistemden kaldırıldı.'),(9,92,5,1,'2026-05-20 16:57:44','Bilet ID: 92 olan kayıt sistemden kaldırıldı.'),(10,93,5,1,'2026-05-20 16:57:44','Bilet ID: 93 olan kayıt sistemden kaldırıldı.'),(11,86,10,1,'2026-05-20 16:57:46','Bilet ID: 86 olan kayıt sistemden kaldırıldı.'),(12,87,10,1,'2026-05-20 16:57:46','Bilet ID: 87 olan kayıt sistemden kaldırıldı.'),(13,88,10,1,'2026-05-20 16:57:46','Bilet ID: 88 olan kayıt sistemden kaldırıldı.'),(14,89,10,1,'2026-05-20 16:57:46','Bilet ID: 89 olan kayıt sistemden kaldırıldı.'),(15,82,10,1,'2026-05-20 16:57:48','Bilet ID: 82 olan kayıt sistemden kaldırıldı.'),(16,83,10,1,'2026-05-20 16:57:48','Bilet ID: 83 olan kayıt sistemden kaldırıldı.'),(17,84,10,1,'2026-05-20 16:57:48','Bilet ID: 84 olan kayıt sistemden kaldırıldı.'),(18,85,10,1,'2026-05-20 16:57:48','Bilet ID: 85 olan kayıt sistemden kaldırıldı.'),(19,81,10,1,'2026-05-20 16:57:50','Bilet ID: 81 olan kayıt sistemden kaldırıldı.'),(20,80,10,1,'2026-05-20 16:57:53','Bilet ID: 80 olan kayıt sistemden kaldırıldı.'),(21,79,7,1,'2026-05-20 16:57:59','Bilet ID: 79 olan kayıt sistemden kaldırıldı.'),(22,2,1,1,'2026-05-20 16:58:10','Bilet ID: 2 olan kayıt sistemden kaldırıldı.'),(23,77,7,1,'2026-05-20 21:23:13','Bilet ID: 77 olan kayıt sistemden kaldırıldı.'),(24,78,7,1,'2026-05-20 21:23:13','Bilet ID: 78 olan kayıt sistemden kaldırıldı.'),(25,135,1,1,'2026-05-21 10:00:51','Bilet ID: 135 olan kayıt sistemden kaldırıldı.'),(26,136,1,1,'2026-05-21 10:00:51','Bilet ID: 136 olan kayıt sistemden kaldırıldı.'),(27,137,1,1,'2026-05-21 10:00:51','Bilet ID: 137 olan kayıt sistemden kaldırıldı.'),(28,138,1,1,'2026-05-21 10:00:51','Bilet ID: 138 olan kayıt sistemden kaldırıldı.'),(29,139,1,1,'2026-05-21 10:00:51','Bilet ID: 139 olan kayıt sistemden kaldırıldı.'),(30,110,8,1,'2026-05-30 20:15:16','Bilet ID: 110 olan kayıt sistemden kaldırıldı.'),(31,111,8,1,'2026-05-30 20:15:16','Bilet ID: 111 olan kayıt sistemden kaldırıldı.'),(32,112,8,1,'2026-05-30 20:15:16','Bilet ID: 112 olan kayıt sistemden kaldırıldı.'),(33,113,8,1,'2026-05-30 20:15:16','Bilet ID: 113 olan kayıt sistemden kaldırıldı.'),(34,114,8,1,'2026-05-30 20:15:16','Bilet ID: 114 olan kayıt sistemden kaldırıldı.'),(35,115,8,1,'2026-05-30 20:15:16','Bilet ID: 115 olan kayıt sistemden kaldırıldı.'),(36,116,8,1,'2026-05-30 20:15:16','Bilet ID: 116 olan kayıt sistemden kaldırıldı.'),(37,117,8,1,'2026-05-30 20:15:16','Bilet ID: 117 olan kayıt sistemden kaldırıldı.'),(38,118,8,1,'2026-05-30 20:15:16','Bilet ID: 118 olan kayıt sistemden kaldırıldı.'),(39,119,8,1,'2026-05-30 20:15:16','Bilet ID: 119 olan kayıt sistemden kaldırıldı.'),(40,120,8,1,'2026-05-30 20:15:16','Bilet ID: 120 olan kayıt sistemden kaldırıldı.'),(41,121,8,1,'2026-05-30 20:15:16','Bilet ID: 121 olan kayıt sistemden kaldırıldı.'),(42,122,8,1,'2026-05-30 20:15:16','Bilet ID: 122 olan kayıt sistemden kaldırıldı.'),(43,123,8,1,'2026-05-30 20:15:16','Bilet ID: 123 olan kayıt sistemden kaldırıldı.'),(44,124,8,1,'2026-05-30 20:15:16','Bilet ID: 124 olan kayıt sistemden kaldırıldı.'),(45,125,8,1,'2026-05-30 20:15:16','Bilet ID: 125 olan kayıt sistemden kaldırıldı.'),(46,126,8,1,'2026-05-30 20:15:16','Bilet ID: 126 olan kayıt sistemden kaldırıldı.'),(47,127,8,1,'2026-05-30 20:15:16','Bilet ID: 127 olan kayıt sistemden kaldırıldı.'),(48,128,8,1,'2026-05-30 20:15:16','Bilet ID: 128 olan kayıt sistemden kaldırıldı.'),(49,129,8,1,'2026-05-30 20:15:16','Bilet ID: 129 olan kayıt sistemden kaldırıldı.'),(50,130,8,1,'2026-05-30 20:15:16','Bilet ID: 130 olan kayıt sistemden kaldırıldı.'),(51,131,8,1,'2026-05-30 20:15:16','Bilet ID: 131 olan kayıt sistemden kaldırıldı.'),(52,132,8,1,'2026-05-30 20:15:16','Bilet ID: 132 olan kayıt sistemden kaldırıldı.'),(53,133,8,1,'2026-05-30 20:15:16','Bilet ID: 133 olan kayıt sistemden kaldırıldı.'),(54,134,8,1,'2026-05-30 20:15:16','Bilet ID: 134 olan kayıt sistemden kaldırıldı.'),(55,100,3,1,'2026-05-30 20:15:18','Bilet ID: 100 olan kayıt sistemden kaldırıldı.'),(56,101,3,1,'2026-05-30 20:15:18','Bilet ID: 101 olan kayıt sistemden kaldırıldı.'),(57,102,3,1,'2026-05-30 20:15:18','Bilet ID: 102 olan kayıt sistemden kaldırıldı.'),(58,103,3,1,'2026-05-30 20:15:18','Bilet ID: 103 olan kayıt sistemden kaldırıldı.'),(59,104,3,1,'2026-05-30 20:15:18','Bilet ID: 104 olan kayıt sistemden kaldırıldı.'),(60,105,3,1,'2026-05-30 20:15:18','Bilet ID: 105 olan kayıt sistemden kaldırıldı.'),(61,106,3,1,'2026-05-30 20:15:18','Bilet ID: 106 olan kayıt sistemden kaldırıldı.'),(62,107,3,1,'2026-05-30 20:15:18','Bilet ID: 107 olan kayıt sistemden kaldırıldı.'),(63,108,3,1,'2026-05-30 20:15:18','Bilet ID: 108 olan kayıt sistemden kaldırıldı.'),(64,109,3,1,'2026-05-30 20:15:18','Bilet ID: 109 olan kayıt sistemden kaldırıldı.'),(65,75,7,1,'2026-05-30 20:15:21','Bilet ID: 75 olan kayıt sistemden kaldırıldı.'),(66,76,7,1,'2026-05-30 20:15:21','Bilet ID: 76 olan kayıt sistemden kaldırıldı.'),(67,72,8,1,'2026-05-30 20:15:25','Bilet ID: 72 olan kayıt sistemden kaldırıldı.'),(68,73,8,1,'2026-05-30 20:15:25','Bilet ID: 73 olan kayıt sistemden kaldırıldı.'),(69,74,8,1,'2026-05-30 20:15:25','Bilet ID: 74 olan kayıt sistemden kaldırıldı.'),(70,71,11,1,'2026-05-30 20:15:28','Bilet ID: 71 olan kayıt sistemden kaldırıldı.'),(71,70,12,1,'2026-05-30 20:15:30','Bilet ID: 70 olan kayıt sistemden kaldırıldı.'),(72,69,5,1,'2026-05-30 20:15:32','Bilet ID: 69 olan kayıt sistemden kaldırıldı.'),(73,67,2,1,'2026-05-30 20:15:34','Bilet ID: 67 olan kayıt sistemden kaldırıldı.'),(74,68,2,1,'2026-05-30 20:15:34','Bilet ID: 68 olan kayıt sistemden kaldırıldı.'),(75,45,2,1,'2026-05-30 20:15:36','Bilet ID: 45 olan kayıt sistemden kaldırıldı.'),(76,46,2,1,'2026-05-30 20:15:36','Bilet ID: 46 olan kayıt sistemden kaldırıldı.'),(77,47,2,1,'2026-05-30 20:15:36','Bilet ID: 47 olan kayıt sistemden kaldırıldı.'),(78,48,2,1,'2026-05-30 20:15:36','Bilet ID: 48 olan kayıt sistemden kaldırıldı.'),(79,49,2,1,'2026-05-30 20:15:36','Bilet ID: 49 olan kayıt sistemden kaldırıldı.'),(80,50,2,1,'2026-05-30 20:15:36','Bilet ID: 50 olan kayıt sistemden kaldırıldı.'),(81,51,2,1,'2026-05-30 20:15:36','Bilet ID: 51 olan kayıt sistemden kaldırıldı.'),(82,52,2,1,'2026-05-30 20:15:36','Bilet ID: 52 olan kayıt sistemden kaldırıldı.'),(83,53,2,1,'2026-05-30 20:15:36','Bilet ID: 53 olan kayıt sistemden kaldırıldı.'),(84,54,2,1,'2026-05-30 20:15:36','Bilet ID: 54 olan kayıt sistemden kaldırıldı.'),(85,55,2,1,'2026-05-30 20:15:36','Bilet ID: 55 olan kayıt sistemden kaldırıldı.'),(86,56,2,1,'2026-05-30 20:15:36','Bilet ID: 56 olan kayıt sistemden kaldırıldı.'),(87,57,2,1,'2026-05-30 20:15:36','Bilet ID: 57 olan kayıt sistemden kaldırıldı.'),(88,58,2,1,'2026-05-30 20:15:36','Bilet ID: 58 olan kayıt sistemden kaldırıldı.'),(89,59,2,1,'2026-05-30 20:15:36','Bilet ID: 59 olan kayıt sistemden kaldırıldı.'),(90,60,2,1,'2026-05-30 20:15:36','Bilet ID: 60 olan kayıt sistemden kaldırıldı.'),(91,61,2,1,'2026-05-30 20:15:36','Bilet ID: 61 olan kayıt sistemden kaldırıldı.'),(92,62,2,1,'2026-05-30 20:15:36','Bilet ID: 62 olan kayıt sistemden kaldırıldı.'),(93,63,2,1,'2026-05-30 20:15:36','Bilet ID: 63 olan kayıt sistemden kaldırıldı.'),(94,64,2,1,'2026-05-30 20:15:36','Bilet ID: 64 olan kayıt sistemden kaldırıldı.'),(95,65,2,1,'2026-05-30 20:15:36','Bilet ID: 65 olan kayıt sistemden kaldırıldı.'),(96,66,2,1,'2026-05-30 20:15:36','Bilet ID: 66 olan kayıt sistemden kaldırıldı.'),(97,35,1,1,'2026-05-30 20:15:38','Bilet ID: 35 olan kayıt sistemden kaldırıldı.'),(98,36,1,1,'2026-05-30 20:15:38','Bilet ID: 36 olan kayıt sistemden kaldırıldı.'),(99,37,1,1,'2026-05-30 20:15:38','Bilet ID: 37 olan kayıt sistemden kaldırıldı.'),(100,38,1,1,'2026-05-30 20:15:38','Bilet ID: 38 olan kayıt sistemden kaldırıldı.'),(101,39,1,1,'2026-05-30 20:15:38','Bilet ID: 39 olan kayıt sistemden kaldırıldı.'),(102,40,1,1,'2026-05-30 20:15:38','Bilet ID: 40 olan kayıt sistemden kaldırıldı.'),(103,41,1,1,'2026-05-30 20:15:38','Bilet ID: 41 olan kayıt sistemden kaldırıldı.'),(104,42,1,1,'2026-05-30 20:15:38','Bilet ID: 42 olan kayıt sistemden kaldırıldı.'),(105,43,1,1,'2026-05-30 20:15:38','Bilet ID: 43 olan kayıt sistemden kaldırıldı.'),(106,44,1,1,'2026-05-30 20:15:38','Bilet ID: 44 olan kayıt sistemden kaldırıldı.'),(107,34,1,1,'2026-05-30 20:15:40','Bilet ID: 34 olan kayıt sistemden kaldırıldı.'),(108,33,1,1,'2026-05-30 20:15:42','Bilet ID: 33 olan kayıt sistemden kaldırıldı.'),(109,32,11,1,'2026-05-30 20:15:44','Bilet ID: 32 olan kayıt sistemden kaldırıldı.'),(110,31,11,1,'2026-05-30 20:15:48','Bilet ID: 31 olan kayıt sistemden kaldırıldı.'),(111,29,4,1,'2026-05-30 20:15:50','Bilet ID: 29 olan kayıt sistemden kaldırıldı.'),(112,30,4,1,'2026-05-30 20:15:50','Bilet ID: 30 olan kayıt sistemden kaldırıldı.'),(113,28,4,1,'2026-05-30 20:15:52','Bilet ID: 28 olan kayıt sistemden kaldırıldı.'),(114,27,4,1,'2026-05-30 20:15:54','Bilet ID: 27 olan kayıt sistemden kaldırıldı.'),(115,26,4,1,'2026-05-30 20:15:56','Bilet ID: 26 olan kayıt sistemden kaldırıldı.'),(116,24,11,1,'2026-05-30 20:15:58','Bilet ID: 24 olan kayıt sistemden kaldırıldı.'),(117,25,11,1,'2026-05-30 20:15:58','Bilet ID: 25 olan kayıt sistemden kaldırıldı.'),(118,23,11,1,'2026-05-30 20:16:00','Bilet ID: 23 olan kayıt sistemden kaldırıldı.'),(119,21,11,1,'2026-05-30 20:16:02','Bilet ID: 21 olan kayıt sistemden kaldırıldı.'),(120,22,11,1,'2026-05-30 20:16:02','Bilet ID: 22 olan kayıt sistemden kaldırıldı.'),(121,20,11,1,'2026-05-30 20:16:04','Bilet ID: 20 olan kayıt sistemden kaldırıldı.'),(122,19,12,1,'2026-05-30 20:16:06','Bilet ID: 19 olan kayıt sistemden kaldırıldı.'),(123,17,12,1,'2026-05-30 20:16:11','Bilet ID: 17 olan kayıt sistemden kaldırıldı.'),(124,18,12,1,'2026-05-30 20:16:11','Bilet ID: 18 olan kayıt sistemden kaldırıldı.'),(125,16,12,1,'2026-05-30 20:16:14','Bilet ID: 16 olan kayıt sistemden kaldırıldı.'),(126,15,12,1,'2026-05-30 20:16:16','Bilet ID: 15 olan kayıt sistemden kaldırıldı.'),(127,14,12,1,'2026-05-30 20:16:19','Bilet ID: 14 olan kayıt sistemden kaldırıldı.'),(128,13,8,1,'2026-05-30 20:16:21','Bilet ID: 13 olan kayıt sistemden kaldırıldı.'),(129,12,4,1,'2026-05-30 20:16:24','Bilet ID: 12 olan kayıt sistemden kaldırıldı.'),(130,11,4,1,'2026-05-30 20:16:26','Bilet ID: 11 olan kayıt sistemden kaldırıldı.'),(131,10,4,1,'2026-05-30 20:16:28','Bilet ID: 10 olan kayıt sistemden kaldırıldı.'),(132,9,2,1,'2026-05-30 20:16:31','Bilet ID: 9 olan kayıt sistemden kaldırıldı.'),(133,8,3,1,'2026-05-30 20:16:39','Bilet ID: 8 olan kayıt sistemden kaldırıldı.'),(134,7,3,1,'2026-05-30 20:16:41','Bilet ID: 7 olan kayıt sistemden kaldırıldı.'),(135,6,2,1,'2026-05-30 20:16:45','Bilet ID: 6 olan kayıt sistemden kaldırıldı.'),(136,5,11,1,'2026-05-30 20:16:47','Bilet ID: 5 olan kayıt sistemden kaldırıldı.'),(137,4,10,1,'2026-05-30 20:16:49','Bilet ID: 4 olan kayıt sistemden kaldırıldı.'),(138,3,1,1,'2026-05-30 20:16:51','Bilet ID: 3 olan kayıt sistemden kaldırıldı.'),(139,140,3,1,'2026-05-30 20:19:44','Bilet ID: 140 olan kayıt sistemden kaldırıldı.'),(140,141,3,1,'2026-05-30 20:19:44','Bilet ID: 141 olan kayıt sistemden kaldırıldı.'),(141,156,15,4,'2026-06-01 22:31:16','Bilet ID: 156 olan kayıt sistemden kaldırıldı.'),(142,157,15,4,'2026-06-01 22:31:16','Bilet ID: 157 olan kayıt sistemden kaldırıldı.'),(143,152,1,4,'2026-06-01 22:31:20','Bilet ID: 152 olan kayıt sistemden kaldırıldı.'),(144,153,1,4,'2026-06-01 22:31:20','Bilet ID: 153 olan kayıt sistemden kaldırıldı.'),(145,154,1,4,'2026-06-01 22:31:20','Bilet ID: 154 olan kayıt sistemden kaldırıldı.'),(146,155,1,4,'2026-06-01 22:31:20','Bilet ID: 155 olan kayıt sistemden kaldırıldı.'),(147,166,15,4,'2026-06-01 22:32:39','Bilet ID: 166 olan kayıt sistemden kaldırıldı.'),(148,167,15,4,'2026-06-01 22:32:39','Bilet ID: 167 olan kayıt sistemden kaldırıldı.'),(149,168,15,4,'2026-06-01 22:32:39','Bilet ID: 168 olan kayıt sistemden kaldırıldı.'),(150,163,15,4,'2026-06-01 22:32:41','Bilet ID: 163 olan kayıt sistemden kaldırıldı.'),(151,164,15,4,'2026-06-01 22:32:41','Bilet ID: 164 olan kayıt sistemden kaldırıldı.'),(152,165,15,4,'2026-06-01 22:32:41','Bilet ID: 165 olan kayıt sistemden kaldırıldı.'),(153,161,15,4,'2026-06-01 22:32:43','Bilet ID: 161 olan kayıt sistemden kaldırıldı.'),(154,162,15,4,'2026-06-01 22:32:43','Bilet ID: 162 olan kayıt sistemden kaldırıldı.'),(155,160,15,4,'2026-06-01 22:32:45','Bilet ID: 160 olan kayıt sistemden kaldırıldı.'),(156,171,10,4,'2026-06-01 22:44:11','Bilet ID: 171 olan kayıt sistemden kaldırıldı.'),(157,172,10,4,'2026-06-01 22:44:11','Bilet ID: 172 olan kayıt sistemden kaldırıldı.'),(158,169,16,4,'2026-06-01 22:44:14','Bilet ID: 169 olan kayıt sistemden kaldırıldı.'),(159,170,16,4,'2026-06-01 22:44:14','Bilet ID: 170 olan kayıt sistemden kaldırıldı.'),(160,158,1,4,'2026-06-01 22:44:20','Bilet ID: 158 olan kayıt sistemden kaldırıldı.'),(161,159,1,4,'2026-06-01 22:44:20','Bilet ID: 159 olan kayıt sistemden kaldırıldı.');
/*!40000 ALTER TABLE `silinenbiletlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sistemloglari`
--

DROP TABLE IF EXISTS `sistemloglari`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sistemloglari` (
  `LogID` int NOT NULL AUTO_INCREMENT,
  `KullaniciID` int DEFAULT NULL,
  `IslemTipi` varchar(50) DEFAULT NULL,
  `Aciklama` varchar(255) DEFAULT NULL,
  `IslemTarihi` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`LogID`),
  KEY `KullaniciID` (`KullaniciID`),
  CONSTRAINT `sistemloglari_ibfk_1` FOREIGN KEY (`KullaniciID`) REFERENCES `kullanicilar` (`KullaniciID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sistemloglari`
--

LOCK TABLES `sistemloglari` WRITE;
/*!40000 ALTER TABLE `sistemloglari` DISABLE KEYS */;
INSERT INTO `sistemloglari` VALUES (1,4,'BİLET_İPTAL','2 adet bilet iptal edildi (+400.00 ₺)','2026-06-01 23:10:43'),(2,4,'BİLET_ALIMI','2 adet bilet alındı (-300.00 ₺)','2026-06-01 23:10:49'),(3,4,'BİLET_İPTAL','4 adet bilet iptal edildi (+600.00 ₺)','2026-06-01 23:10:55'),(4,4,'BİLET_ALIMI','2 adet bilet alındı (-280.00 ₺)','2026-06-01 23:11:56'),(5,1,'FİLM_SİLME','14 IDli film silindi','2026-06-01 23:12:47'),(6,1,'FİLM_SİLME','16 IDli film silindi','2026-06-01 23:22:17'),(7,1,'FİLM_SİLME','15 IDli film silindi','2026-06-01 23:22:19'),(8,4,'BİLET_ALIMI','2 adet bilet alındı (-600.00 ₺)','2026-06-01 23:23:07'),(9,4,'BAKIYE_YUKLEME','Hesaba bakiye yüklendi (+2000 ₺)','2026-06-01 23:25:54'),(10,4,'BİLET_İPTAL','2 adet bilet iptal edildi (+600.00 ₺)','2026-06-01 23:26:03'),(11,4,'BİLET_ALIMI','2 adet bilet alındı (-360.00 ₺)','2026-06-01 23:29:26');
/*!40000 ALTER TABLE `sistemloglari` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `view_etkinlikanalizi`
--

DROP TABLE IF EXISTS `view_etkinlikanalizi`;
/*!50001 DROP VIEW IF EXISTS `view_etkinlikanalizi`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_etkinlikanalizi` AS SELECT 
 1 AS `id`,
 1 AS `ad`,
 1 AS `satis`,
 1 AS `hasilat`,
 1 AS `doluluk`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_musterisadakat`
--

DROP TABLE IF EXISTS `view_musterisadakat`;
/*!50001 DROP VIEW IF EXISTS `view_musterisadakat`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_musterisadakat` AS SELECT 
 1 AS `KullaniciID`,
 1 AS `AdSoyad`,
 1 AS `Toplam_Bilet`,
 1 AS `Musteri_Statüsü`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_etkinliksatisraporu`
--

DROP TABLE IF EXISTS `vw_etkinliksatisraporu`;
/*!50001 DROP VIEW IF EXISTS `vw_etkinliksatisraporu`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_etkinliksatisraporu` AS SELECT 
 1 AS `EtkinlikAdi`,
 1 AS `SatilanBiletSayisi`,
 1 AS `ToplamGelir`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping events for database 'cinebilet'
--

--
-- Dumping routines for database 'cinebilet'
--
/*!50003 DROP PROCEDURE IF EXISTS `BiletIptal` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `BiletIptal`(
    IN p_kullanici_id INT, 
    IN p_etkinlik_id INT, 
    IN p_tarih VARCHAR(255) -- Django'dan gelen tarihi karşılıyoruz ama hata vermemesi için aşağıda kullanmıyoruz
)
BEGIN
    UPDATE biletler 
    SET Durum = 'İptal' 
    WHERE KullaniciID = p_kullanici_id 
      AND EtkinlikID = p_etkinlik_id 
      AND Durum = 'Aktif';
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_BiletIptalGrubu` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_BiletIptalGrubu`(
    IN p_KullaniciID INT,
    IN p_EtkinlikID INT,
    IN p_Tarih DATETIME
)
BEGIN
    DECLARE v_Adet INT;
    DECLARE v_Fiyat DECIMAL(10,2);
    DECLARE v_IadeTutari DECIMAL(10,2);

    START TRANSACTION;

    -- O seansta alınan aktif bilet sayısını bul
    SELECT COUNT(*) INTO v_Adet FROM biletler 
    WHERE KullaniciID = p_KullaniciID AND EtkinlikID = p_EtkinlikID AND SatinAlmaTarihi = p_Tarih AND Durum = 'Aktif';

    IF v_Adet > 0 THEN
        SELECT Fiyat INTO v_Fiyat FROM etkinlikler WHERE EtkinlikID = p_EtkinlikID;
        SET v_IadeTutari = v_Adet * v_Fiyat;

        -- 1. Bakiye iadesi yap
        UPDATE kullanicilar SET Bakiye = Bakiye + v_IadeTutari WHERE KullaniciID = p_KullaniciID;
        -- 2. Kapasiteyi geri artır
        UPDATE etkinlikler SET Kapasite = Kapasite + v_Adet WHERE EtkinlikID = p_EtkinlikID;
        -- 3. İptal loglarına ekle
        INSERT INTO iptalloglari (BiletID, IptalTarihi)
        SELECT BiletID, NOW() FROM biletler 
        WHERE KullaniciID = p_KullaniciID AND EtkinlikID = p_EtkinlikID AND SatinAlmaTarihi = p_Tarih AND Durum = 'Aktif';
        -- 4. Biletleri sil (Silinme logu varsa o da tetiklenir)
        DELETE FROM biletler 
        WHERE KullaniciID = p_KullaniciID AND EtkinlikID = p_EtkinlikID AND SatinAlmaTarihi = p_Tarih AND Durum = 'Aktif';

        COMMIT;
    ELSE
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'İptal edilecek bilet bulunamadı.';
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_BiletSatinAl` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_BiletSatinAl`(
    IN p_KullaniciID INT,
    IN p_EtkinlikID INT,
    IN p_Adet INT,
    IN p_KoltukNo VARCHAR(10)
)
BEGIN
    DECLARE v_Fiyat DECIMAL(10,2);
    DECLARE v_Kapasite INT;
    DECLARE v_ToplamTutar DECIMAL(10,2);

    START TRANSACTION;

    -- Film fiyatını ve kalan kapasiteyi al
    SELECT Fiyat, Kapasite INTO v_Fiyat, v_Kapasite 
    FROM etkinlikler 
    WHERE EtkinlikID = p_EtkinlikID;

    SET v_ToplamTutar = v_Fiyat * p_Adet;

    -- YENİ: Koltuk zaten dolu mu kontrolü
    IF EXISTS (SELECT 1 FROM biletler WHERE EtkinlikID = p_EtkinlikID AND koltuk_no = p_KoltukNo AND Durum = 'Aktif') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Bu koltuk saniyeler önce başkası tarafından alınmış!';
    ELSEIF v_Kapasite < p_Adet THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Seçilen adet kadar boş koltuk yok!';
    ELSEIF (SELECT Bakiye FROM kullanicilar WHERE KullaniciID = p_KullaniciID) < v_ToplamTutar THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Yetersiz bakiye!';
    ELSE
        -- Bakiyeden düş
        UPDATE kullanicilar 
        SET Bakiye = Bakiye - v_ToplamTutar 
        WHERE KullaniciID = p_KullaniciID;

        -- Kapasiteden düş
        UPDATE etkinlikler 
        SET Kapasite = Kapasite - p_Adet 
        WHERE EtkinlikID = p_EtkinlikID;

        -- YENİ: Bilet kaydına koltuk_no ekle
        INSERT INTO biletler (KullaniciID, EtkinlikID, Durum, SatinAlmaTarihi, koltuk_no) 
        VALUES (p_KullaniciID, p_EtkinlikID, 'Aktif', NOW(), p_KoltukNo);

        COMMIT;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `view_etkinlikanalizi`
--

/*!50001 DROP VIEW IF EXISTS `view_etkinlikanalizi`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_etkinlikanalizi` AS select `e`.`EtkinlikID` AS `id`,`e`.`EtkinlikAdi` AS `ad`,count(`b`.`BiletID`) AS `satis`,ifnull(sum(`e`.`Fiyat`),0) AS `hasilat`,concat('%',round(((count(`b`.`BiletID`) / `s`.`ToplamKapasite`) * 100),2)) AS `doluluk` from ((`etkinlikler` `e` left join `biletler` `b` on(((`e`.`EtkinlikID` = `b`.`EtkinlikID`) and (`b`.`Durum` = 'Aktif')))) join `salonlar` `s` on((`e`.`SalonID` = `s`.`SalonID`))) where (`e`.`Durum` = 'Aktif') group by `e`.`EtkinlikID`,`e`.`EtkinlikAdi`,`s`.`ToplamKapasite` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_musterisadakat`
--

/*!50001 DROP VIEW IF EXISTS `view_musterisadakat`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_musterisadakat` AS select `k`.`KullaniciID` AS `KullaniciID`,`k`.`AdSoyad` AS `AdSoyad`,count(`b`.`BiletID`) AS `Toplam_Bilet`,(case when (count(`b`.`BiletID`) >= 5) then 'Vip Üye (Gold)' when (count(`b`.`BiletID`) >= 2) then 'Aktif Üye (Silver)' else 'Yeni Üye' end) AS `Musteri_Statüsü` from (`kullanicilar` `k` left join `biletler` `b` on((`k`.`KullaniciID` = `b`.`KullaniciID`))) group by `k`.`KullaniciID`,`k`.`AdSoyad` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_etkinliksatisraporu`
--

/*!50001 DROP VIEW IF EXISTS `vw_etkinliksatisraporu`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_etkinliksatisraporu` AS select `e`.`EtkinlikAdi` AS `EtkinlikAdi`,count(`b`.`BiletID`) AS `SatilanBiletSayisi`,sum(`e`.`Fiyat`) AS `ToplamGelir` from (`etkinlikler` `e` left join `biletler` `b` on((`e`.`EtkinlikID` = `b`.`EtkinlikID`))) where (`b`.`Durum` = 'Aktif') group by `e`.`EtkinlikAdi` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-06 14:24:56
