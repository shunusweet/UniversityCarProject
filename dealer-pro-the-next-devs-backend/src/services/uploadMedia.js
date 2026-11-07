require("dotenv").config();
const AWS = require("aws-sdk");

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const uploadToS3 = async (fileItem) => {
    const s3 = new AWS.S3();

    try {
        let fileContent;
        if (fileItem.data instanceof Buffer) {
            fileContent = fileItem.data;
        } else if (typeof fileItem.data === "string") {
            fileContent = Buffer.from(fileItem.data, "base64");
        } else {
            throw new Error("Invalid data type for fileItem");
        }

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `documents/${fileItem.filename}`, // folder "documents"
            Body: fileContent,
            ContentType: fileItem.type,
        };

        const data = await s3.upload(params).promise();
        console.log("File uploaded to S3:", data.Location);
        return data.Location;
    } catch (error) {
        console.error("Error uploading file to S3:", error);
        throw error;
    }
};

const uploadFiles = async (fileArray = []) => {
    const concurrencyLimit = 5;
    const results = [];

    const uploadWithLimit = async (fileItem) => {
        try {
            if (!fileItem || !fileItem.filename || !fileItem.data || !fileItem.type) {
                console.error("Invalid fileItem format:", fileItem);
                throw new Error("Invalid fileItem format");
            }

            const s3Url = await uploadToS3(fileItem);
            results.push(s3Url);
        } catch (error) {
            console.error("Error uploading file:", error);
            results.push(null);
        }
    };

    const batches = [];
    for (let i = 0; i < fileArray.length; i += concurrencyLimit) {
        batches.push(fileArray.slice(i, i + concurrencyLimit).map(uploadWithLimit));
    }

    for (const batch of batches) {
        await Promise.all(batch);
    }

    return results;
};

module.exports = { uploadFiles };
