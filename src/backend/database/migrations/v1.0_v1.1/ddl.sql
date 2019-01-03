-- remove app name unique index
ALTER TABLE `app` DROP INDEX `name`, ADD INDEX `app_name` (`name` ASC);

-- add new tables
CREATE TABLE `ingress`
(
  `id`          bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
  `name`        varchar(128) NOT NULL DEFAULT '' UNIQUE,
  `meta_data`   longtext     NOT NULL,
  `app_id`      bigint       NOT NULL DEFAULT 0,
  `description` varchar(255) NOT NULL DEFAULT '',
  `order_id`    bigint       NOT NULL DEFAULT 0,
  `create_time` datetime,
  `update_time` datetime,
  `user`        varchar(128) NOT NULL DEFAULT '',
  `deleted`     bool         NOT NULL DEFAULT false
) ENGINE=InnoDB;

CREATE TABLE `ingress_template`
(
  `id`          bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
  `name`        varchar(128) NOT NULL DEFAULT '',
  `template`    longtext     NOT NULL,
  `ingress_id`  bigint       NOT NULL DEFAULT 0,
  `description` varchar(512) NOT NULL DEFAULT '',
  `create_time` datetime,
  `update_time` datetime,
  `user`        varchar(128) NOT NULL DEFAULT '',
  `deleted`     bool         NOT NULL DEFAULT false
) ENGINE=InnoDB;


-- Indexes

ALTER TABLE `ingress`
  ADD INDEX `ingress_app_id`(`app_id`);
ALTER TABLE `ingress`
  ADD INDEX `ingress_order_id`(`order_id`);
ALTER TABLE `ingress_template`
  ADD INDEX `ingress_template_ingress_id`(`ingress_id`);