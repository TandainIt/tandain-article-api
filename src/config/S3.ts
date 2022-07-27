import { S3 } from "@aws-sdk/client-s3"; 


// NOTE: Create S3 service object
const s3 = new S3({apiVersion: 'latest', region: 'ap-northeast-1'});

export default s3
