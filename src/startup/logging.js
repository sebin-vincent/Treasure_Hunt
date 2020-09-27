const logger = require('winston');
logger.transports.DailyRotateFile = require('winston-daily-rotate-file');

const { format } = require('winston');

exports.initializeLogger = (app) => {

    const myFormat = format.printf( ({ level, message, timestamp }) => {
        return `${timestamp} ${level}: ${message}`;
      });

    if((process.env.NODE_ENV==='development') || (process.env.NODE_ENV==='test')){
        logger.add(new logger.transports.Console(
            {colorise: true,
            prettyPrint: true,
            format: format.combine(format.timestamp(),myFormat,format.errors({ stack: true }))
        }));
    }else{
        logger.add(new logger.transports.DailyRotateFile({
            filename:'application-%DATE%.log',
            colorise: true,
            prettyPrint: true,
            format: format.combine(format.timestamp(),myFormat)
        }));
    }

    process.on('uncaughtException', error => {
        logger.error('uncaughtException'+error);
        process.exit(1);
    });

    process.on('unhandledRejection', error => {
        logger.error('unhandledRejection :'+error);
        process.exit(1);
    });
}