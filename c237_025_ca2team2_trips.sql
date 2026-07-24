CREATE DATABASE  IF NOT EXISTS `c237_025_ca2team2` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `c237_025_ca2team2`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: c237-annie-mysql.mysql.database.azure.com    Database: c237_025_ca2team2
-- ------------------------------------------------------
-- Server version	8.0.44-azure

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
-- Table structure for table `trips`
--

DROP TABLE IF EXISTS `trips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trips` (
  `tripId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `tripName` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `country` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `budget` double(10,2) NOT NULL,
  `image1` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `image2` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image3` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`tripId`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trips`
--

LOCK TABLES `trips` WRITE;
/*!40000 ALTER TABLE `trips` DISABLE KEYS */;
INSERT INTO `trips` VALUES (11,3,'Tokyo Adventure','Japan','Tokyo','2026-08-01','2026-08-07',3500.00,'1784877622111-tokyo1_userid3_trip.jpg','1784877622112-tokyo2_userid3_trip.jpg','1784877622116-tokyo3_userid3_trip.jpg','Planning'),(12,3,'Singapore Sentosa Staycation','Singapore','Singapore','2026-09-10','2026-09-11',750.00,'1784877785590-singapore1_userid3_trip.jpg','1784877785591-singapore2_userid3_trip.jpg',NULL,'Planning'),(13,3,'Paris Culture Trip','France','Paris','2026-12-01','2026-12-10',6000.50,'1784877956641-paris1_userid3_trip.jpg',NULL,NULL,'Planning'),(14,3,'Budget Malaysia Visit','Malaysia','KL','2026-05-05','2026-05-05',80.00,'1784878123100-malaysia1_userid3_trip.jpg','1784878123101-malaysia2_userid_3_trip.jpg',NULL,'Planning'),(15,3,'Luxury Europe Holiday','Italy ','Rome','2027-01-01','2027-01-30',15000.00,'1784878618986-rome1_userid3_trip.jpg','1784878618989-rome2_userid3_trip.jpg',NULL,'Upcoming'),(16,4,'Japan Winter Trip','Japan','Kyoto','2026-12-14','2026-12-22',5000.00,'1784879847199-kyoto1_userid4_trip.jpg','1784879847201-kyoto2_userid4_trip.jpg','1784879847201-kyoto3_userid4_trip.jpg','Planning'),(17,4,'Athens History Tour','Greece ','Athens','2026-07-01','2026-07-05',2200.00,'1784879972733-athens1_userid4_trip.jpg',NULL,NULL,'Completed'),(18,4,'Iceland Adventure','Iceland','Reykjavik','2027-01-30','2027-02-10',9000.00,'1784880182028-reyjavik1_userid4_trip.jpg','1784880182028-reyjavik2_userid4_trip.jpg',NULL,'Planning'),(19,4,'One Day Food Trip','Singapore','Singapore','2026-11-20','2026-11-20',100.00,'1784880307107-singaporefood1_userid4_trip.jpg','1784880307107-singaporefood2_userid4_trip.jpg',NULL,'Upcoming'),(20,6,'Bali Relaxation','Indonesia','Bali','2026-08-01','2026-08-06',3000.00,'1784881046545-bali1_userid6_trip.jpg','1784881046547-bali2_userid6_trip.jpg',NULL,'Upcoming'),(21,6,'China Exploration','China','Shanghai','2027-01-10','2027-01-20',3500.00,'1784881216738-shanghai1_userid6_trip.jpg','1784881216739-shanghai2_userid6_trip.jpg','1784881216739-shanghai3_userid6_trip.jpg','Planning'),(22,6,'Extreme Budget Trip','Thailand','Bangkok','2026-10-01','2026-10-03',500.00,'1784881303941-bangkok1_userid6_trip.jpg',NULL,NULL,'Planning'),(23,7,'Australia Adventure','Australia','Sydney','2026-09-01','2026-09-10',7000.00,'1784882322070-sydney1_userid7_trip.jpg','1784882322073-sydney2_userid7_trip.jpg',NULL,'Upcoming'),(24,7,'Mega Holiday','USA','New York','2026-06-01','2026-06-20',20000.00,'1784882481693-newyork1_userid7_trip.jpg','1784882481693-newyork2_userid7_trip.jpg',NULL,'Completed');
/*!40000 ALTER TABLE `trips` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-24 16:54:36
