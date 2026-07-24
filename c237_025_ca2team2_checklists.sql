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
-- Table structure for table `checklists`
--

DROP TABLE IF EXISTS `checklists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `checklists` (
  `checklistId` int NOT NULL AUTO_INCREMENT,
  `tripId` int NOT NULL,
  `itemName` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `isPacked` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`checklistId`),
  KEY `tripId` (`tripId`),
  CONSTRAINT `checklists_ibfk_1` FOREIGN KEY (`tripId`) REFERENCES `trips` (`tripId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checklists`
--

LOCK TABLES `checklists` WRITE;
/*!40000 ALTER TABLE `checklists` DISABLE KEYS */;
INSERT INTO `checklists` VALUES (14,11,'Passport','Documents',1),(15,11,'Camera','Electronics',1),(16,11,'Travel Adapter','Electronics',0),(17,12,'Clothes','Clothing',0),(18,13,'Museum Tickets','Documents',1),(19,14,'Wallet','Documents',1),(20,14,'Water Bottle ','Miscellaneous',0),(21,15,'Luxury Clothing','Clothing',0),(22,15,'Laptop','Electronics',1),(23,16,'Winter Jackets','Clothing',0),(24,16,'Gloves','Clothing',0),(25,17,'Travel Insurance','Documents',1),(26,17,'Camera','Electronics',1),(27,17,'Sunscreen','Health & Safety',1),(28,18,'Thermal Wear','Clothing',1),(29,18,'Hiking Boots','Footwear',0),(30,19,'Food Voucher','Documents',1),(31,19,'Portable Charger','Electronics',0),(32,20,'Sunscreen','Health & Safety',0),(33,20,'Swimming Clothes','Clothing',1),(34,21,'Camera','Electronics',1),(35,21,'Travel Guide','Documents',0),(36,22,'Walking Shoes','Footwear',0),(37,22,'Passport','Documents',0),(38,22,'Backpack with Clothes','Clothing',1),(39,23,'Flight Ticket','Documents',0),(40,23,'Power Bank','Electronics',0),(41,24,'Visa Documents','Documents',1),(42,24,'Luxury Camera','Electronics',0);
/*!40000 ALTER TABLE `checklists` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-24 16:54:35
