/*
  Warnings:

  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_userMessageId_fkey";

-- DropTable
DROP TABLE "public"."Message";

-- DropTable
DROP TABLE "public"."UserMessage";
