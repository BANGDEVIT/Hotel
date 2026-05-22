/*
  Warnings:

  - You are about to drop the column `guest_id` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `employeeId` on the `RoomStatusHistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[booking_id,room_id]` on the table `BookingRoom` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `payment_method` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updated_at` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('cash', 'bank_transfer', 'e_wallet', 'credit_card');

-- DropForeignKey
ALTER TABLE "RoomStatusHistory" DROP CONSTRAINT "RoomStatusHistory_employeeId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "guest_id";

-- AlterTable
ALTER TABLE "BookingService" ADD COLUMN     "note" TEXT,
ADD COLUMN     "used_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "payment_method",
ADD COLUMN     "payment_method" "PaymentMethod" NOT NULL;

-- AlterTable
ALTER TABLE "RoomStatusHistory" DROP COLUMN "employeeId";

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BookingRoom_booking_id_room_id_key" ON "BookingRoom"("booking_id", "room_id");
