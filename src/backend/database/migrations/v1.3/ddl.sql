CREATE TABLE IF NOT EXISTS `hpa` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `name` varchar(128) NOT NULL DEFAULT ''  UNIQUE,
    `meta_data` longtext NOT NULL,
    `app_id` bigint NOT NULL,
    `description` varchar(255) NOT NULL DEFAULT '' ,
    `order_id` bigint NOT NULL DEFAULT 0 ,
    `create_time` datetime NOT NULL,
    `update_time` datetime NOT NULL,
    `user` varchar(128) NOT NULL DEFAULT '' ,
    `deleted` bool NOT NULL DEFAULT false
) ENGINE=InnoDB;
CREATE INDEX `hpa_app_id` ON `hpa` (`app_id`);
CREATE INDEX `hpa_order_id` ON `hpa` (`order_id`);

CREATE TABLE IF NOT EXISTS `hpa_template` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `name` varchar(128) NOT NULL DEFAULT '' ,
    `template` longtext NOT NULL,
    `hpa_id` bigint NOT NULL,
    `description` varchar(512) NOT NULL DEFAULT '' ,
    `create_time` datetime NOT NULL,
    `update_time` datetime NOT NULL,
    `user` varchar(128) NOT NULL DEFAULT '' ,
    `deleted` bool NOT NULL DEFAULT false
) ENGINE=InnoDB;
CREATE INDEX `hpa_template_hpa_id` ON `hpa_template` (`hpa_id`);