-- CreateIndex
CREATE INDEX `instructors_docType_docNumber_idx` ON `instructors`(`docType`, `docNumber`);

-- CreateIndex
CREATE INDEX `members_docType_docNumber_idx` ON `members`(`docType`, `docNumber`);
