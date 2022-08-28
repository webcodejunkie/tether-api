// Initalize AWS S3 Client
const { S3Client } = require('@aws-sdk/client-s3')
// Set the AWS Region
const REGION = "us-east-1";
// Create an Amazon S3 service client object
const s3Client = new S3Client({
  region: REGION,
});

export { s3Client };