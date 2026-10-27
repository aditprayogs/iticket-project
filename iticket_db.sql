-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: iticket_db
-- ------------------------------------------------------
-- Server version	8.0.46-0ubuntu0.24.04.4

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
-- Table structure for table `assets`
--

DROP TABLE IF EXISTS `assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `asset_tag` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `owner_id` bigint unsigned DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `asset_tag` (`asset_tag`),
  KEY `fk_assets_owner` (`owner_id`),
  CONSTRAINT `fk_assets_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assets`
--

LOCK TABLES `assets` WRITE;
/*!40000 ALTER TABLE `assets` DISABLE KEYS */;
INSERT INTO `assets` VALUES (1,'AST-001','Laptop Budi','Laptop','Ruang Administrasi',1,1,'2026-10-16 07:22:15','2026-10-16 07:22:15');
/*!40000 ALTER TABLE `assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attachments`
--

DROP TABLE IF EXISTS `attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attachments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `ticket_id` bigint unsigned NOT NULL,
  `uploader_id` bigint unsigned NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mime_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size_bytes` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_attachments_ticket` (`ticket_id`),
  KEY `fk_attachments_uploader` (`uploader_id`),
  CONSTRAINT `fk_attachments_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_attachments_uploader` FOREIGN KEY (`uploader_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attachments`
--

LOCK TABLES `attachments` WRITE;
/*!40000 ALTER TABLE `attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Hardware','Masalah perangkat keras seperti laptop, komputer, dan printer.',1,'2026-10-16 07:22:15','2026-10-16 07:22:15'),(2,'Software','Masalah aplikasi, sistem operasi, dan instalasi software.',1,'2026-10-16 07:22:15','2026-10-16 07:22:15'),(3,'Network','Masalah internet, LAN, Wi-Fi, dan konektivitas jaringan.',1,'2026-10-16 07:22:15','2026-10-16 07:22:15'),(4,'Other','Masalah IT lainnya yang tidak termasuk kategori tersedia.',1,'2026-10-21 10:02:23','2026-10-21 10:02:20');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `ticket_id` bigint unsigned NOT NULL,
  `author_id` bigint unsigned NOT NULL,
  `body` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_internal` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_comments_ticket` (`ticket_id`),
  KEY `fk_comments_author` (`author_id`),
  CONSTRAINT `fk_comments_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_comments_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `ticket_id` bigint unsigned NOT NULL,
  `title` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_notifications_user` (`user_id`),
  KEY `fk_notifications_ticket` (`ticket_id`),
  CONSTRAINT `fk_notifications_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,1,8,'Status Tiket Diperbarui','Tiket #TCK-259776 Anda telah diubah menjadi: In Progress',1,'2026-10-22 07:17:18'),(2,2,9,'Tiket Baru Masuk!','Tiket #TCK-455042 (aaaadadadadda) membutuhkan penanganan.',1,'2026-10-22 07:17:36'),(3,5,9,'Tiket Baru Masuk!','Tiket #TCK-455042 (aaaadadadadda) membutuhkan penanganan.',1,'2026-10-22 07:17:36'),(4,3,9,'Tiket Baru Masuk!','Tiket #TCK-455042 (aaaadadadadda) membutuhkan penanganan.',1,'2026-10-22 07:17:36'),(5,1,8,'Status Tiket Diperbarui','Tiket #TCK-259776 Anda telah diubah menjadi: Resolved',1,'2026-10-22 07:17:56'),(6,2,10,'Tiket Baru Masuk!','Tiket #TCK-617599 (test tiket dari employee adit) membutuhkan penanganan.',1,'2026-10-22 07:20:19'),(7,5,10,'Tiket Baru Masuk!','Tiket #TCK-617599 (test tiket dari employee adit) membutuhkan penanganan.',1,'2026-10-22 07:20:19'),(8,3,10,'Tiket Baru Masuk!','Tiket #TCK-617599 (test tiket dari employee adit) membutuhkan penanganan.',1,'2026-10-22 07:20:19'),(9,6,10,'Status Tiket Diperbarui','Tiket #TCK-617599 Anda telah diubah menjadi: Resolved',1,'2026-10-22 07:21:14'),(10,2,11,'Tiket Baru Masuk!','Tiket #TCK-787060 (test notif lewat tiket baru adit) membutuhkan penanganan.',1,'2026-10-22 07:23:08'),(11,5,11,'Tiket Baru Masuk!','Tiket #TCK-787060 (test notif lewat tiket baru adit) membutuhkan penanganan.',1,'2026-10-22 07:23:08'),(12,3,11,'Tiket Baru Masuk!','Tiket #TCK-787060 (test notif lewat tiket baru adit) membutuhkan penanganan.',1,'2026-10-22 07:23:08'),(13,6,10,'Status Tiket Diperbarui','Tiket #TCK-617599 Anda telah diubah menjadi: In Progress',1,'2026-10-22 07:25:08'),(14,6,11,'Status Tiket Diperbarui','Tiket #TCK-787060 Anda telah diubah menjadi: In Progress',1,'2026-10-22 07:25:20');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_histories`
--

DROP TABLE IF EXISTS `ticket_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket_histories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `ticket_id` bigint unsigned NOT NULL,
  `actor_id` bigint unsigned NOT NULL,
  `event_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `old_value` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `new_value` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_histories_ticket` (`ticket_id`),
  KEY `fk_histories_actor` (`actor_id`),
  CONSTRAINT `fk_histories_actor` FOREIGN KEY (`actor_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_histories_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_histories`
--

LOCK TABLES `ticket_histories` WRITE;
/*!40000 ALTER TABLE `ticket_histories` DISABLE KEYS */;
INSERT INTO `ticket_histories` VALUES (1,2,1,'TICKET_CREATED',NULL,'Waiting','Ticket berhasil dibuat','2026-10-21 03:11:40'),(2,2,2,'STATUS_CHANGE','Waiting','In Progress','Pembaruan ticket','2026-10-21 06:36:34'),(3,2,2,'STATUS_CHANGE','In Progress','Resolved','sudah diperbaiki semuanya\n','2026-10-21 06:36:52'),(4,1,2,'STATUS_CHANGE','Waiting','In Progress','Pembaruan ticket','2026-10-21 07:06:26'),(5,4,2,'STATUS_CHANGE','Waiting','In Progress','Pembaruan ticket','2026-10-22 02:59:15'),(6,4,2,'STATUS_CHANGE','In Progress','Resolved','semua sudah diselesaikan dengan catatan jika ada error kembali, laporkan lagi\n','2026-10-22 02:59:48'),(7,4,2,'STATUS_CHANGE','Resolved','Resolved','semua sudah diselesaikan dengan catatan jika ada error kembali, laporkan lagi\n','2026-10-22 02:59:52'),(8,4,2,'STATUS_CHANGE','Resolved','Resolved','semua sudah diselesaikan dengan catatan jika ada error kembali, laporkan lagi\n','2026-10-22 02:59:56'),(9,1,5,'STATUS_CHANGE','In Progress','Resolved','-','2026-10-22 03:02:31'),(10,1,5,'STATUS_CHANGE','Resolved','Resolved','-','2026-10-22 03:02:43'),(11,3,5,'STATUS_CHANGE','Waiting','In Progress','Pembaruan ticket','2026-10-22 03:02:54'),(12,5,5,'STATUS_CHANGE','Waiting','In Progress','Pembaruan ticket','2026-10-22 06:57:54'),(13,5,5,'STATUS_CHANGE','In Progress','Closed','Pembaruan ticket','2026-10-22 06:58:55'),(14,5,5,'STATUS_CHANGE','Closed','In Progress','Pembaruan ticket','2026-10-22 06:59:49'),(15,2,5,'STATUS_CHANGE','Resolved','In Progress','sudah diperbaiki semuanya\n','2026-10-22 07:01:39'),(16,2,5,'STATUS_CHANGE','In Progress','Closed','sudah diperbaiki semuanya\n','2026-10-22 07:01:44'),(17,1,5,'STATUS_CHANGE','Resolved','Waiting','-','2026-10-22 07:01:55'),(18,1,5,'STATUS_CHANGE','Waiting','In Progress','-','2026-10-22 07:02:06'),(19,5,5,'STATUS_CHANGE','In Progress','Resolved','aaaaa udah beres','2026-10-22 07:04:41'),(20,5,5,'STATUS_CHANGE','Resolved','Waiting','aaaaa udah beres','2026-10-22 07:06:58'),(21,5,5,'STATUS_CHANGE','Waiting','In Progress','aaaaa udah beres','2026-10-22 07:07:05'),(22,6,5,'STATUS_CHANGE','Waiting','In Progress','sssss','2026-10-22 07:07:40');
/*!40000 ALTER TABLE `ticket_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `ticket_number` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` bigint unsigned NOT NULL,
  `asset_id` bigint unsigned DEFAULT NULL,
  `reporter_id` bigint unsigned NOT NULL,
  `attachment_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assignee_id` bigint unsigned DEFAULT NULL,
  `priority` enum('Low','Medium','High','Critical') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Medium',
  `status` enum('Waiting','In Progress','Resolved','Closed','Cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Waiting',
  `resolution_notes` text COLLATE utf8mb4_unicode_ci,
  `started_at` timestamp NULL DEFAULT NULL,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `closed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ticket_number` (`ticket_number`),
  KEY `fk_tickets_category` (`category_id`),
  KEY `fk_tickets_asset` (`asset_id`),
  KEY `idx_tickets_status` (`status`),
  KEY `idx_tickets_priority` (`priority`),
  KEY `idx_tickets_reporter` (`reporter_id`),
  KEY `idx_tickets_assignee` (`assignee_id`),
  CONSTRAINT `fk_tickets_asset` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_tickets_assignee` FOREIGN KEY (`assignee_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_tickets_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_tickets_reporter` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (1,'TCK-20261016-0001','Laptop tidak bisa menyala','Laptop mati total saat ditekan tombol power.',1,1,1,NULL,2,'High','In Progress','-','2026-10-21 07:06:26','2026-10-22 03:02:43',NULL,'2026-10-16 07:22:15','2026-10-22 07:02:06'),(2,'TCK-20261021-0001','Komputer no 28 tidak ada jaringan, LAN dan WIFI tetap tidak bisa','Komputer no 28 tidak ada jaringan, LAN dan WIFI tetap tidak bisa tolong cek jika bisa',4,NULL,1,NULL,2,'Low','Closed','sudah diperbaiki semuanya\n','2026-10-21 06:36:34','2026-10-21 06:36:52','2026-10-22 07:01:44','2026-10-21 03:11:40','2026-10-22 07:01:44'),(3,'TCK-853962','aaaa','aaaaabbb',1,NULL,1,NULL,5,'Critical','In Progress',NULL,'2026-10-22 03:02:54',NULL,NULL,'2026-10-22 02:57:35','2026-10-22 03:02:54'),(4,'TCK-880475','bbbb','bbbbbbbbbbbbbbbb',4,NULL,1,'/uploads/attachment-1792637880468-676334772.png',2,'Critical','Resolved','semua sudah diselesaikan dengan catatan jika ada error kembali, laporkan lagi\n','2026-10-22 02:59:15','2026-10-22 02:59:56',NULL,'2026-10-22 02:58:01','2026-10-22 02:59:56'),(5,'TCK-243600','kabel lan tidak connect','kabel lan tidak connect',3,NULL,1,'/uploads/attachment-1792652243595-820219804.png',5,'Low','In Progress','aaaaa udah beres','2026-10-22 06:57:54','2026-10-22 07:04:41','2026-10-22 06:58:55','2026-10-22 06:57:25','2026-10-22 07:07:05'),(6,'TCK-843406','saaaa','aaa',1,NULL,1,NULL,5,'High','In Progress','sssss','2026-10-22 07:07:40',NULL,NULL,'2026-10-22 07:07:25','2026-10-22 07:07:40'),(7,'TCK-139455','jjjjj','jjjjj',1,NULL,1,NULL,NULL,'Medium','Waiting',NULL,NULL,NULL,NULL,'2026-10-22 07:12:21','2026-10-22 07:12:21'),(8,'TCK-259776','aaa','aaa',1,NULL,1,NULL,2,'Medium','Resolved','sasasas','2026-10-22 07:17:18','2026-10-22 07:17:56',NULL,'2026-10-22 07:14:21','2026-10-22 07:17:56'),(9,'TCK-455042','aaaadadadadda','aadsasa',1,NULL,1,NULL,NULL,'High','Waiting',NULL,NULL,NULL,NULL,'2026-10-22 07:17:36','2026-10-22 07:17:36'),(10,'TCK-617599','test tiket dari employee adit','test tiket dari employee adit',4,NULL,6,NULL,5,'Low','In Progress','aaaaaaaaaaaa','2026-10-22 07:25:08','2026-10-22 07:21:14',NULL,'2026-10-22 07:20:19','2026-10-22 07:25:08'),(11,'TCK-787060','test notif lewat tiket baru adit','aaa',4,NULL,6,NULL,5,'High','In Progress',NULL,'2026-10-22 07:25:20',NULL,NULL,'2026-10-22 07:23:08','2026-10-22 07:25:20');
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('Employee','IT Support','Admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Employee',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_role` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Budi Santoso','budi','budi@example.com','$2b$10$kaRXFlUBXJJzuLOrM4n26upG8Wqq8ugpgXlb9PoIhpfscrh57/IwG','Employee',1,'2026-10-16 07:22:15','2026-10-22 04:27:45'),(2,'Andi Pratama','andi','andi@example.com','$2b$10$kaRXFlUBXJJzuLOrM4n26upG8Wqq8ugpgXlb9PoIhpfscrh57/IwG','IT Support',1,'2026-10-16 07:22:15','2026-10-22 04:27:43'),(3,'Siti Rahma','siti','siti@example.com','$2b$10$kaRXFlUBXJJzuLOrM4n26upG8Wqq8ugpgXlb9PoIhpfscrh57/IwG','Admin',1,'2026-10-16 07:22:15','2026-10-22 04:27:47'),(5,'aaa','aaa','aaaa@aaa.aaa','$2b$10$Ni1UVhH9xudsyXBmj7.0N.R2RskOGYb5cG5I7EIjqExPh/Gfmxbf2','IT Support',1,'2026-10-22 03:01:22','2026-10-22 04:27:54'),(6,'Adit Employee','adit','adityo.pp47@gmail.com','$2b$10$iS6D99.udeD51m07gQLao.mAby42vKOKgB1eMFtoVBh.ObModYR3S','Employee',1,'2026-10-22 07:19:41','2026-10-22 07:19:41');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-27  9:01:58
