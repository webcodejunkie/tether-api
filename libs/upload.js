// AWS S3 Modules
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const REGION = "us-east-1";
const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey,
  }
});
// Multer module to process Images
const multer = require('multer');
const multerS3 = require('multer-s3');

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true)
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed"), false);
  }
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: "public-read",
    s3: s3,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    bucket: process.env.AWSBucket,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: req.params.Username + '-' + file.fieldname + '-' + file.originalname });
    },
    key: function (req, file, cb) {
      cb(null, file.originalname);
    }
  })
});

module.exports = upload, s3;