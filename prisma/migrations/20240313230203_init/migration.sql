-- CreateTable
CREATE TABLE `google_users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `email_verified` BOOLEAN NOT NULL,
    `family_name` VARCHAR(191) NOT NULL,
    `given_name` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `picture` VARCHAR(191) NOT NULL,
    `sub` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_as_ci;

-- CreateTable
CREATE TABLE `characters` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `age` INTEGER NULL,
    `birth` DATETIME(3) NULL,
    `googleUserId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `characters_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_as_ci;

-- AddForeignKey
ALTER TABLE `characters` ADD CONSTRAINT `characters_googleUserId_fkey` FOREIGN KEY (`googleUserId`) REFERENCES `google_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
