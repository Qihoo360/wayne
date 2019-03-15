-- Migrate metadata kubernetes namespace to kube_namespace
ALTER TABLE `namespace` ADD COLUMN `kube_namespace` VARCHAR(128) NOT NULL DEFAULT '' AFTER `deleted`,
ADD INDEX `namespace_kube_namespace` (`kube_namespace` ASC);
