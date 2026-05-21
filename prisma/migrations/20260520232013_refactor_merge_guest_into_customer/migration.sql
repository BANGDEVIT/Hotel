/*
  Warnings:

  - You are about to drop the `Guest` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `customer_id` on table `Booking` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CustomerSource" AS ENUM ('walk_in', 'online_registration');

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_guest_id_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_account_id_fkey";

-- DropForeignKey
ALTER TABLE "Guest" DROP CONSTRAINT "Guest_create_by_staff_id_fkey";

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "customer_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "registered_at" TIMESTAMP(3),
ADD COLUMN     "source" "CustomerSource" NOT NULL DEFAULT 'online_registration',
ALTER COLUMN "account_id" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- DropTable
DROP TABLE "Guest";

-- CreateIndex
CREATE INDEX "Customer_email_idx" ON "Customer"("email");

-- CreateIndex
CREATE INDEX "Customer_phone_idx" ON "Customer"("phone");

-- CreateIndex
CREATE INDEX "Customer_source_idx" ON "Customer"("source");

-- CreateIndex
CREATE INDEX "Customer_account_id_idx" ON "Customer"("account_id");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
