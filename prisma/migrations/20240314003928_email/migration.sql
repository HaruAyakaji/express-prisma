/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `google_users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `google_users_email_key` ON `google_users`(`email`);
