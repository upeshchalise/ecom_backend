/*
  Warnings:

  - A unique constraint covering the columns `[transactionId]` on the table `Payments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Payments" ADD COLUMN     "transactionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Payments_transactionId_key" ON "public"."Payments"("transactionId");
