// Initalize AWS S3 Client
const { S3Client } = require('@aws-sdk/client-s3');
// Grab AWS Creditials
const access = {
  aws_access_key_id: process.env.AWSAccessKeyId,
  aws_secret_access_key: process.env.AWSSecretKey,
}
// Set the AWS Region
const REGION = "us-east-1";
// Create an Amazon S3 service client object
const s3Client = new S3Client({
  region: REGION,
  credentials: access
});


module.exports = s3Client;