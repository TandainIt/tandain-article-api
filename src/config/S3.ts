import AWS from 'aws-sdk';

// NOTE: Set the region 
AWS.config.update({region: 'ap-northeast-1'});

// NOTE: Create S3 service object
const s3 = new AWS.S3({apiVersion: 'latest'});

export default s3
