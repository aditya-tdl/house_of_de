/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "subscription";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "uam";

-- CreateEnum
CREATE TYPE "subscription_status" AS ENUM ('CREATED', 'AUTHENTICATED', 'ACTIVE', 'PAUSED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "role" AS ENUM ('USER', 'ADMIN');

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "uam"."user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription"."subscription_plan" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "razorpay_plan_id" TEXT NOT NULL,
    "razorpay_subscription_id" TEXT NOT NULL,
    "razorpay_customer_id" TEXT,
    "status" "subscription_status" NOT NULL DEFAULT 'CREATED',
    "start_at" TIMESTAMP(3),
    "end_at" TIMESTAMP(3),
    "next_charge_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_plan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "uam"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_mobile_key" ON "uam"."user"("mobile");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "uam"."user"("email");

-- CreateIndex
CREATE INDEX "user_mobile_idx" ON "uam"."user"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plan_user_id_key" ON "subscription"."subscription_plan"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plan_razorpay_subscription_id_key" ON "subscription"."subscription_plan"("razorpay_subscription_id");

-- CreateIndex
CREATE INDEX "subscription_plan_user_id_idx" ON "subscription"."subscription_plan"("user_id");

-- CreateIndex
CREATE INDEX "subscription_plan_razorpay_subscription_id_idx" ON "subscription"."subscription_plan"("razorpay_subscription_id");

-- CreateIndex
CREATE INDEX "subscription_plan_status_idx" ON "subscription"."subscription_plan"("status");

-- AddForeignKey
ALTER TABLE "subscription"."subscription_plan" ADD CONSTRAINT "subscription_plan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "uam"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
