-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `dni` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `role` ENUM('CLIENT', 'ADMIN') NOT NULL DEFAULT 'CLIENT',
    `balance` DOUBLE NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_dni_key`(`dni`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DOUBLE NOT NULL,
    `type` ENUM('DEPOSIT', 'WITHDRAWAL', 'TRANSFER') NOT NULL,
    `description` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'COMPLETED',
    `reference` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `senderId` INTEGER NULL,
    `receiverId` INTEGER NULL,

    UNIQUE INDEX `transactions_reference_key`(`reference`),
    INDEX `transactions_senderId_idx`(`senderId`),
    INDEX `transactions_receiverId_idx`(`receiverId`),
    INDEX `transactions_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
