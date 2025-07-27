const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const uploadToS3 = async (file, problemId) => {
  try {
    // Initialize S3 client inside the function
    const s3 = new S3Client({
      region: process.env.AWS_S3_REGION || 'ap-south-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    if (!file || !file.buffer) {
      throw new Error('Invalid file object');
    }

    const key = `test-cases/${problemId}-${Date.now()}.json`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: 'text/plain',
    });

    await s3.send(command);

    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Error uploading to S3:', error); // Log full error
    throw new Error('Failed to upload file to S3');
  }
};

const deleteFromS3 = async (url) => {
  try {
    // Initialize S3 client for delete as well
    const s3 = new S3Client({
      region: process.env.AWS_S3_REGION || 'ap-south-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    if (!url) return;

    const baseUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/`;
    const key = url.startsWith(baseUrl) ? url.slice(baseUrl.length) : null;

    if (!key) return;

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    });

    await s3.send(command);
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw new Error('Failed to delete file from S3');
  }
};

module.exports = { uploadToS3, deleteFromS3 };
