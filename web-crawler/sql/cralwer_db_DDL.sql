CREATE DATABASE IF NOT EXISTS ##MYSQL_DATABASE## /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE ##MYSQL_DATABASE##;

CREATE TABLE IF NOT EXISTS `websites` (
  `ID_websites` int NOT NULL AUTO_INCREMENT,
  `Domain` longtext,
  `URL` longtext NOT NULL,
  `DateAdded` datetime NOT NULL,
  `DateLastChecked` datetime DEFAULT NULL,
  `DateLastChanged` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_websites`),
  UNIQUE KEY `idnew_table_UNIQUE` (`ID_websites`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `changelog` (
  `ID_ChangeLog` int NOT NULL AUTO_INCREMENT,
  `ID_websites_FK` int NOT NULL,
  `ModNumber` int NOT NULL,
  `LastVisited` datetime NOT NULL,
  `LastChanged` datetime DEFAULT NULL,
  `HTMLPayloadOld` longtext,
  `HTMLPayloadNew` longtext NOT NULL,
  `HTMLChanges` longtext,
  PRIMARY KEY (`ID_ChangeLog`),
  KEY `ID_websites_idx` (`ID_websites_FK`),
  CONSTRAINT `ID_websites` FOREIGN KEY (`ID_websites_FK`) REFERENCES `websites` (`ID_websites`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/* For non-root user*/
GRANT SELECT, INSERT, UPDATE, DELETE ON ##MYSQL_DATABASE##.websites TO '##MYSQL_USER##'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON ##MYSQL_DATABASE##.changelog TO '##MYSQL_USER##'@'%';
FLUSH PRIVILEGES;
