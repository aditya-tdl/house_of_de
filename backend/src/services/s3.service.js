import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export const uploadFileToS3 = async (file) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        // ACL: "public-read", // Ensure bucket policy allows public read if not using ACLs
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Construct public URL
    // Use CloudFront if available, otherwise fall back to S3 direct URL
    let url;
    if (process.env.CLOUDFRONT_URL) {
        url = `${process.env.CLOUDFRONT_URL}/${fileName}`;
    } else {
        url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    }

    return url;
};
