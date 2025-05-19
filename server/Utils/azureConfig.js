import { BlobServiceClient } from "@azure/storage-blob"
import { configDotenv } from 'dotenv';

configDotenv();
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_STORAGE_CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME;

if (!AZURE_STORAGE_CONNECTION_STRING || !AZURE_STORAGE_CONTAINER_NAME) {
    throw new Error("Azure Storage configuration is missing. Check your .env file.");
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(AZURE_STORAGE_CONTAINER_NAME);

export async function uploadFileToAzure(fileBuffer, fileName, fileMimeType) {
    const blobName = 'video-' + Date.now() + '-' + fileName;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
        blobHTTPHeaders: { blobContentType: fileMimeType },
    });

    return blockBlobClient.url; 
}

export async function deleteFileFromAzure(blobUrl){
  const blobName = blobUrl.split('/').pop();
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.deleteIfExists()
}
