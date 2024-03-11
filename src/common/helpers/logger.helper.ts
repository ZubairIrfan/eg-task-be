import * as chalk from 'chalk';
import * as Morgan from 'morgan';

export enum LogLevel {
  TRACE = 10,
  DEBUG = 20,
  INFO = 30,
  WARN = 40,
  ERROR = 50,
  FATAL = 60,
}

export class Logger {
  private static logTemplate = {
    [LogLevel.TRACE]: chalk?.greenBright,
    [LogLevel.DEBUG]: chalk?.whiteBright,
    [LogLevel.INFO]: chalk?.blueBright,
    [LogLevel.WARN]: chalk?.magenta,
    [LogLevel.ERROR]: chalk?.redBright,
    [LogLevel.FATAL]: chalk?.bgRed,
  };

  private static loggerMiddleware = null;

  private static log(logLevel: LogLevel, data: any, tag?: string) {
    if (+process.env.LOG_LEVEL > logLevel) {
      return;
    }

    if (typeof data === 'object') {
      const str = JSON.stringify(data, null, 4);
      if (str != '{}') {
        data = str;
      }
    }

    if (tag !== undefined) {
      console.log(
        chalk.bold.underline.white(tag),
        this.logTemplate[logLevel](data),
      );
    } else {
      console.log(this.logTemplate[logLevel](data));
    }
  }

  public static Trace(data: any, tag?: string) {
    this.log(LogLevel.TRACE, data, tag);
  }
  public static Debug(data: any, tag?: string) {
    this.log(LogLevel.DEBUG, data, tag);
  }
  public static Info(data: any, tag?: string) {
    this.log(LogLevel.INFO, data, tag);
  }
  public static Warn(data: any, tag?: string) {
    this.log(LogLevel.WARN, data, tag);
  }
  public static Error(data: any, tag?: string) {
    this.log(LogLevel.ERROR, data, tag);
  }
  public static Fatal(data: any, tag?: string) {
    this.log(LogLevel.FATAL, data, tag);
  }

  public static GetLoggerMiddleware() {
    if (Logger.loggerMiddleware === null) {
      const LoggerFormatStr =
        ':date[iso] :method :status :response-time ms :res[content-length] :remote-addr :url :referrer :user-agent';

      Logger.loggerMiddleware = Morgan(LoggerFormatStr, {
        stream: {
          write: (str) => {
            this.Info(str);
          },
        },
        skip: function (req) {
          return req.url === '/';
        },
      });
    }

    return Logger.loggerMiddleware;
  }
}
