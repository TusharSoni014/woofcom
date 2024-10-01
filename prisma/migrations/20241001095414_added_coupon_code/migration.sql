/*
  Warnings:

  - You are about to drop the `CouponUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CouponUser" DROP CONSTRAINT "CouponUser_couponId_fkey";

-- DropForeignKey
ALTER TABLE "CouponUser" DROP CONSTRAINT "CouponUser_userId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "couponId" TEXT;

-- DropTable
DROP TABLE "CouponUser";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
