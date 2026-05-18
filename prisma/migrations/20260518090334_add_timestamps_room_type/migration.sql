/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `RoomType` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RoomType" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "RoomType_name_key" ON "RoomType"("name");
