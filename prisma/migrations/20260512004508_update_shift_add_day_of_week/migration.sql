/*
  Warnings:

  - A unique constraint covering the columns `[name,day_of_week]` on the table `Shift` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `day_of_week` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `name` on the `Shift` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ShiftName" AS ENUM ('morning', 'afternoon', 'evening', 'night');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

-- AlterTable
ALTER TABLE "Shift" ADD COLUMN     "day_of_week" "DayOfWeek" NOT NULL,
DROP COLUMN "name",
ADD COLUMN     "name" "ShiftName" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Shift_name_day_of_week_key" ON "Shift"("name", "day_of_week");
