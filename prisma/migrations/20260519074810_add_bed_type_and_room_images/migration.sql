/*
  Warnings:

  - Added the required column `bed_type` to the `RoomType` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BedType" AS ENUM ('single', 'double', 'twin', 'king', 'queen');

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "images" JSONB NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "RoomType" ADD COLUMN     "bed_type" "BedType" NOT NULL;
