CREATE TABLE `refreshtoken` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `refreshToken` char(255) NOT NULL,
  `date` datetime NOT NULL,
  `isNhanVien` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;