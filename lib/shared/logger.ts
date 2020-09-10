import cloneDeep from 'lodash/fp/cloneDeep';
import colors from 'colors';
import Log from '../types/Log';

type LogLevel = 'log' | 'info' | 'warning' | 'error';

interface LoggerOptions {
  quiet?: boolean;
  logLevel?: LogLevel;
  noColors?: boolean;
}

const LOG_LEVEL_MAP = {
  log: 1,
  info: 2,
  warning: 3,
  error: 4
};

class Logger {
  private logs: Log[];
  private quiet: boolean;
  private logLevel: LogLevel;
  private noColors: boolean;

  constructor(options: LoggerOptions) {
    this.logs = [];
    this.quiet = options.quiet || false;
    this.logLevel = options.logLevel || 'log';
    this.noColors = options.noColors || false;
  }

  private print(log: Log) {
    const { type, message } = log;
    const { quiet, logLevel, noColors } = this;
    const level = LOG_LEVEL_MAP[logLevel];

    if (!quiet) {
      if (type === 'log' && level <= 1) {
        console.log(message);
      }

      if (type === 'info' && level <= 2) {
        const msg = `[INFO] ${message}`;
        console.info(noColors ? msg : colors.cyan(msg));
      }

      if (type === 'warning' && level <= 3) {
        const msg = `[WARNING] ${message}`;
        console.warn(noColors ? msg : colors.yellow(msg));
      }

      if (type === 'error' && level <= 4) {
        const msg = `[ERROR] ${message}`;
        console.error(noColors ? msg : colors.red(msg));
      }
    }
  }

  getLogs() {
    return cloneDeep(this.logs);
  }

  log(message: string) {
    const log: Log = { type: 'log', message };
    this.logs.push(log);
    this.print(log);
  }

  info(message: string) {
    const log: Log = { type: 'info', message };
    this.logs.push(log);
    this.print(log);
  }

  warn(message: string) {
    const log: Log = { type: 'warning', message };
    this.logs.push(log);
    this.print(log);
  }

  error(message: string) {
    const log: Log = { type: 'error', message };
    this.logs.push(log);
    this.print(log);
  }
}

export default Logger;
