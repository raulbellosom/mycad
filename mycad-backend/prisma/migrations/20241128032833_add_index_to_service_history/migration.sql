/*
  Warnings:

  - You are about to drop the column `cost` on the `ServiceHistory` table. All the data in the column will be lost.
  - You are about to drop the column `enabled` on the `ServiceHistory` table. All the data in the column will be lost.
  - Added the required column `reportType` to the `ServiceHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCost` to the `ServiceHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ServiceHistory` DROP FOREIGN KEY `ServiceHistory_vehicleId_fkey`;

-- AlterTable
ALTER TABLE `ServiceHistory` DROP COLUMN `cost`,
    DROP COLUMN `enabled`,
    ADD COLUMN `reportType` ENUM('PREVENTIVE', 'CORRECTIVE') NOT NULL,
    ADD COLUMN `totalCost` DOUBLE NOT NULL;

-- CreateTable
CREATE TABLE `ReplacedPart` (
    `id` VARCHAR(191) NOT NULL,
    `reportId` VARCHAR(191) NOT NULL,
    `partName` VARCHAR(191) NOT NULL,
    `actionType` ENUM('REPAIRED', 'REPLACED') NOT NULL,
    `cost` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServicesFile` (
    `id` VARCHAR(191) NOT NULL,
    `serviceId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ServiceHistory` ADD CONSTRAINT `ServiceHistory_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReplacedPart` ADD CONSTRAINT `ReplacedPart_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `ServiceHistory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServicesFile` ADD CONSTRAINT `ServicesFile_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `ServiceHistory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
