import mongoose from "mongoose";

import { logger } from "./logger";

const connectionString = process.env.MONGODB_CONNECTION_STRING || "";

export async function connect(): Promise<typeof mongoose> {
    const connection = await mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });

    mongoose.connection.on("error", (dbError) => {
        logger.error("Error while connecting to db", dbError);
        process.exit(1);
    });

    return connection;
}
