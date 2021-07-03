import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

import { s3Client } from "./aws";
import { logger } from "./logger";
import { router as expenseRouter } from "./Expense";
import { connect } from "./db";

const port = 3000;

const app = express();
app.use(express.json());
app.use(morgan("short"));
app.use(cors());

app.use("/expense", expenseRouter);

app.post("/upload", async function (req, res) {
    try {
        const name = req.body.name;
        const type = req.body.type;
        const size = req.body.size;
        if (!name || !type || !size) {
            return res.status(400).json("invalid request body");
        }
        const data = await generateUploadUrl({ name, type, size });
        return res.json(data);
    } catch (e) {
        return res.status(500).json(e.message);
    }
});

/**
 * S3 stuff
 */

async function generateUploadUrl({ name, type, size }: { name: string; type: string; size: number }) {
    return await createPresignedPost(s3Client, {
        Bucket: "finanzli",
        Key: `public/${name}`,
        Expires: 600,
        Conditions: [["eq", "$Content-Type", type]],
    });
}

connect().then(() => {
    logger.info("connected to db");
    app.listen(port, () => {
        logger.info(`The Server is running on http://localhost:${port}`);
    });
});
