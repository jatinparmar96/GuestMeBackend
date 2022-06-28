const aws = require('aws-sdk');

aws.config.region = 'us-west-2';

const s3 = new aws.S3();
const s3Bucket = process.env.S3_BUCKET;

aws.config.getCredentials(function (err) {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    console.log('Access key:', aws.config.credentials.accessKeyId);
  }
});

module.exports = { s3, s3Bucket };
