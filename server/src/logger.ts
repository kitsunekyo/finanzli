import { createLogger, format, transports } from "winston";

const logger = createLogger({
    level: "info",
});

const logFormat = format.combine(
    format.timestamp(),
    format.json(),
    format.prettyPrint(),
    format.errors({ stack: true }),
    format.colorize()
);

if (process.env.NODE_ENV !== "production") {
    logger.add(
        new transports.Console({
            format: logFormat,
        })
    );
}

export { logger };
