-- CreateTable
CREATE TABLE "RequestLog" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RequestLog_ip_timestamp_idx" ON "RequestLog"("ip", "timestamp");
