-- CreateTable
CREATE TABLE "GitHubConnection" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "repositoryUrl" TEXT NOT NULL,
    "repositoryName" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "branch" TEXT NOT NULL DEFAULT 'main',
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GitHubConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GitHubConnection_projectId_key" ON "GitHubConnection"("projectId");

-- AddForeignKey
ALTER TABLE "GitHubConnection" ADD CONSTRAINT "GitHubConnection_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
