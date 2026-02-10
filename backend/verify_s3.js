import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config({ path: ".env.development" });

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

async function run() {
    console.log("Checking credentials and connectivity...");
    console.log(`Region: '${process.env.AWS_REGION}'`);
    console.log(`Bucket Target: '${process.env.AWS_BUCKET_NAME}'`);

    try {
        const command = new ListBucketsCommand({});
        const data = await s3Client.send(command);
        console.log("Success! Buckets found:");
        data.Buckets.forEach(b => console.log(` - ${b.Name}`));

        const { PutObjectCommand } = await import("@aws-sdk/client-s3");
        console.log("Attempting PutObject...");
        const uploadCmd = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: "test-upload.txt",
            Body: "Hello S3!",
        });
        await s3Client.send(uploadCmd);
        console.log("PutObject successful!");
    } catch (err) {
        console.error("Error:", err);
    }
}

run();
