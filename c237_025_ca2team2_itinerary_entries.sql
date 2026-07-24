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
-- Table structure for table `itinerary_entries`
--

DROP TABLE IF EXISTS `itinerary_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itinerary_entries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tripId` int NOT NULL,
  `dayNumber` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `timeSlot` varchar(50) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `sortOrder` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `tripId` (`tripId`),
  CONSTRAINT `itinerary_entries_ibfk_1` FOREIGN KEY (`tripId`) REFERENCES `trips` (`tripId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itinerary_entries`
--

LOCK TABLES `itinerary_entries` WRITE;
/*!40000 ALTER TABLE `itinerary_entries` DISABLE KEYS */;
INSERT INTO `itinerary_entries` VALUES (6,11,1,'Arrive in Tokyo','Check into hotel and explore nearby areas','Morning','2026-07-24 07:42:31',1),(7,11,2,'Visit Shibuya Crossing','Explore shopping streets and attractions','Afternoon','2026-07-24 07:42:56',1),(8,12,1,'Singapore Food Tour','Try local food around Singapore','Morning','2026-07-24 07:45:29',1),(10,13,1,'Visit Louvre Museum','Explore famous artworks','Morning','2026-07-24 07:46:38',1),(11,13,3,'Eiffel Tower Visit','Enjoy views of Paris','Evening','2026-07-24 07:47:05',1),(12,14,1,'Explore Kuala Lumpur','Visit city landmarks','Morning','2026-07-24 07:47:34',1),(13,15,1,'Rome Arrival','Settle into accommodation','Morning','2026-07-24 07:48:23',1),(14,15,4,'Colosseum Tour','Explore ancient Roman history','Afternoon','2026-07-24 07:48:50',1),(15,16,2,'Japanese Dinner Experience','Try local cuisine','Night','2026-07-24 08:08:34',1),(16,16,1,'Arrival and Temple Visit','Visit traditional temples.','Morning','2026-07-24 08:08:56',1),(17,17,4,'Acropolis Tour','Explore ancient Greek ruins','Morning','2026-07-24 08:09:32',1),(18,17,5,'Athens City Walk','Explore historic streets before heading to the airport','Evening','2026-07-24 08:10:04',1),(19,18,2,'Northern Lights Tour','Search for northern lights','Night','2026-07-24 08:10:58',1),(20,19,1,'Singapore Food Hunt','Try famous local dishes','Morning','2026-07-24 08:11:35',1),(21,20,1,'Bali Beach Day','Relax at the beach','Morning','2026-07-24 08:31:18',1),(22,20,2,'Island Exploration','Visit nearby islands','Afternoon','2026-07-24 08:32:06',1),(23,21,6,'Shanghai City Tour','Explore Shanghai landmarks','Morning','2026-07-24 08:32:47',1),(24,21,7,'Shanghai Museum','Visit cultural attractions','Afternoon','2026-07-24 08:33:21',1),(25,22,2,'Street Food Tour','Try Thai cuisine','Night','2026-07-24 08:34:01',1),(26,24,1,'Sydney Harbour','Visit famous harbour','Morning','2026-07-24 08:43:26',1),(27,24,2,'Opera House Tour','Explore Sydney Opera House','Afternoon','2026-07-24 08:43:41',1),(28,23,3,'New York Arrival','Check into accommodation','Morning','2026-07-24 08:44:11',1),(29,23,4,'Times Square Visit','Explore city centre','Night','2026-07-24 08:44:27',1),(30,12,1,'Walk around Siloso Beach','Take a leisurely walk along siloso beach and buy some dinner','Evening','2026-07-24 08:49:43',2);
/*!40000 ALTER TABLE `itinerary_entries` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-24 16:54:37
