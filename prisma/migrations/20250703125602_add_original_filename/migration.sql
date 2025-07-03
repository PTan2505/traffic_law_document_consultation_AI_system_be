/*
  Warnings:

  - Added the required column `originalFilename` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "originalFilename" VARCHAR(255) NOT NULL;
