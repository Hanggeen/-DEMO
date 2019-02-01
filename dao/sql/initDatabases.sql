-- 指定数据库
USE bargain;

-- 用户表
CREATE TABLE `bargain`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `openid` VARCHAR(30) NOT NULL,
  `avatar` VARCHAR(200) NOT NULL,
  `gender` INT NOT NULL DEFAULT 0,
  `nickname` VARCHAR(30) NOT NULL,
  `able` TINYINT NOT NULL DEFAULT 1,
  `createtime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `openid_UNIQUE` (`openid` ASC));

-- 商品表
CREATE TABLE `bargain`.`product` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `picture` VARCHAR(100) NOT NULL,
  `introduce` TEXT,
  `price` FLOAT NOT NULL,
  `floor_price` FLOAT NOT NULL,
  `bargain_count` INT NOT NULL,
  `bargain_slope` FLOAT NOT NULL,
  `bargain_range` FLOAT NOT NULL,
  `able` TINYINT NOT NULL DEFAULT 1,
  `term` VARCHAR(10) NOT NULL,
  `createtime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`));

-- 砍价列表
CREATE TABLE `bargain`.`trade` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `initial_price` FLOAT NOT NULL,
  `current_price` FLOAT NOT NULL,
  `floor_price` FLOAT NOT NULL,
  `status` VARCHAR(20) NOT NULL,
  `deadline` VARCHAR(13) NOT NULL,
  `buy_name` VARCHAR(20),
  `buy_phone` VARCHAR(20),
  `buy_address` VARCHAR(100),
  `buy_time` VARCHAR(13),
  `createtime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`));

-- 砍价记录表
  CREATE TABLE `bargain`.`record` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `trade_id` INT NOT NULL,
  `bargainer_id` INT NOT NULL,
  `bargain_price` FLOAT NOT NULL,
  `createtime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`));
