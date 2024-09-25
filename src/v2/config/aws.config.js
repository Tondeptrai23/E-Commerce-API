import AWS from "aws-sdk";
import { awsConfig } from "./config.js";

AWS.config.update({
    region: awsConfig.REGION,
    accessKeyId: awsConfig.ACCESS_KEY,
    secretAccessKey: awsConfig.SECRET_KEY,
});

const s3 = new AWS.S3();
const cloudfront = new AWS.CloudFront.Signer(
    awsConfig.CLOUDFRONT_KEY_PAIR_ID,
    awsConfig.CLOUDFRONT_PRIVATE_KEY
);

export { s3, cloudfront };
