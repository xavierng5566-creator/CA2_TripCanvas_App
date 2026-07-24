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
-- Table structure for table `attractions`
--

DROP TABLE IF EXISTS `attractions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attractions` (
  `attractionId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `country` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(1000) COLLATE utf8mb4_general_ci NOT NULL,
  `image1` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `image2` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image3` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`attractionId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attractions`
--

LOCK TABLES `attractions` WRITE;
/*!40000 ALTER TABLE `attractions` DISABLE KEYS */;
INSERT INTO `attractions` VALUES (3,'Historic Heart of Paris','France','Paris','Culture','Explore the historic heart of Paris, home to some of France\'s most iconic landmarks including the Eiffel Tower, Arc de Triomphe, and the Louvre Museum. This central area showcases the city\'s rich history, world-famous architecture, and artistic heritage. Visitors can admire breathtaking views along the Champs-Élysées, discover masterpieces at the Louvre, and experience the charm of Parisian streets and neighbourhoods.','1784608602658-attractions_paris2.jpg','1784608602660-attractions_paris3.jpg','1784608602660-attractions_paris4.jpg'),(4,'City of Athens','Greece','Athens','Culture','The Acropolis of Athens is an ancient hilltop citadel containing some of Greece\'s most important historical monuments, including the Parthenon. It represents the achievements of ancient Greek civilisation and provides visitors with stunning views over Athens.','1784608645558-attractions_athens1.jpg','1784608645562-attractions_athens2.jpg','1784608645566-attractions_athens3.jpg'),(5,'Blue Lagoon ','Iceland','Reykjavik','Nature','The Blue Lagoon is a famous geothermal spa surrounded by Iceland\'s volcanic landscape. Visitors can relax in its warm mineral-rich waters, enjoy scenic views, and experience one of Iceland\'s most unique natural attractions.','1784608672111-attractions_reykjavik1.jpg','1784608672112-attractions_reykjavik2.jpg','1784608672113-attractions_reykjavik3.jpg'),(6,'Gardens by the Bay','Singapore','Singapore','Nature','A futuristic garden attraction featuring Supertree Grove, Flower Dome and Cloud Forest. Visitors can enjoy nature exhibits and spectacular night light shows.','1784877277972-Gardens_by_the_bay1.jpg','1784877277973-Gardens_by_the_bay2.jpg',NULL),(7,'Universal Studios Singapore','Singapore','Singapore','Entertainment','A movie-themed amusement park featuring exciting rides, attractions and entertainment based on popular films.','1784877378478-USS_1.jpg',NULL,NULL);
/*!40000 ALTER TABLE `attractions` ENABLE KEYS */;
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
