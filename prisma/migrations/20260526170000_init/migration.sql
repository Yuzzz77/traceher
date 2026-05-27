CREATE TABLE `product_batch` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `batch_no` VARCHAR(50) NOT NULL,
  `product_name` VARCHAR(120) NOT NULL,
  `production_date` DATE NOT NULL,
  `batch_status` ENUM('VERIFIED', 'UNVERIFIED', 'RISK') NOT NULL DEFAULT 'UNVERIFIED',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `product_batch_batch_no_key` (`batch_no`),
  INDEX `product_batch_batch_status_idx` (`batch_status`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `raw_material_batch` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `batch_no` VARCHAR(50) NOT NULL,
  `material_name` VARCHAR(120) NOT NULL,
  `material_type` VARCHAR(60) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `raw_material_batch_batch_no_key` (`batch_no`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `qr_code` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(100) NOT NULL,
  `product_batch_id` INT NOT NULL,
  `status` ENUM('ACTIVE', 'INACTIVE', 'FROZEN') NOT NULL DEFAULT 'INACTIVE',
  `activated_at` DATETIME(3) NULL,
  `scan_count` INT NOT NULL DEFAULT 0,
  `first_scanned_at` DATETIME(3) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `qr_code_code_key` (`code`),
  UNIQUE INDEX `qr_code_product_batch_id_key` (`product_batch_id`),
  INDEX `qr_code_status_idx` (`status`),
  CONSTRAINT `qr_code_product_batch_id_fkey`
    FOREIGN KEY (`product_batch_id`) REFERENCES `product_batch` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `batch_material_rel` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `product_batch_id` INT NOT NULL,
  `raw_material_batch_id` INT NOT NULL,
  `usage_ratio` DECIMAL(5,2) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `batch_material_rel_product_batch_id_raw_material_batch_id_key` (`product_batch_id`, `raw_material_batch_id`),
  INDEX `batch_material_rel_raw_material_batch_id_idx` (`raw_material_batch_id`),
  CONSTRAINT `batch_material_rel_product_batch_id_fkey`
    FOREIGN KEY (`product_batch_id`) REFERENCES `product_batch` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `batch_material_rel_raw_material_batch_id_fkey`
    FOREIGN KEY (`raw_material_batch_id`) REFERENCES `raw_material_batch` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `inspection_report` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `report_no` VARCHAR(50) NOT NULL,
  `product_batch_id` INT NOT NULL,
  `report_status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
  `inspected_at` DATETIME(3) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `inspection_report_report_no_key` (`report_no`),
  INDEX `inspection_report_product_batch_id_report_status_idx` (`product_batch_id`, `report_status`),
  CONSTRAINT `inspection_report_product_batch_id_fkey`
    FOREIGN KEY (`product_batch_id`) REFERENCES `product_batch` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `inspection_result` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `report_id` INT NOT NULL,
  `item_name` VARCHAR(80) NOT NULL,
  `result_value` VARCHAR(80) NOT NULL,
  `result_level` ENUM('PASS', 'WARNING', 'FAIL') NOT NULL,
  `standard_range` VARCHAR(80) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `inspection_result_report_id_result_level_idx` (`report_id`, `result_level`),
  CONSTRAINT `inspection_result_report_id_fkey`
    FOREIGN KEY (`report_id`) REFERENCES `inspection_report` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
