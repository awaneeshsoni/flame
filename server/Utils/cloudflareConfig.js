import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export async function uploadToR2(fileKey, fileBuffer, mimeType) {
  const uploadParams = {
    Bucket: process.env.R2_BUCKET,
    Key: fileKey,
    Body: fileBuffer,
    ContentType: mimeType,
  };

  const result = await r2Client.send(new PutObjectCommand(uploadParams));
  const url = `${process.env.ACCESS_URL}/${fileKey}`
  return url;
}

export async function deleteFromR2(fileKey) {
  const deleteParams = {
    Bucket: process.env.R2_BUCKET,
    Key: fileKey,
  };

  await r2Client.send(new DeleteObjectCommand(deleteParams));
}
