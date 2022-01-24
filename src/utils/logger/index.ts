import { config } from '../config';

/**
 * Global logging class.
 *
 * Debugging levels include:
 *
 * 0 = off,
 * 1 = INFO
 * 2 = WARNING
 */
class Logger {
  private loggingLevel = config.loggingLevel;

  info(...args: any[]): void {
    if (this.loggingLevel >= 1) {
      console.info('[INFO] ', ...args);
    }
  }

  warn(...args: any[]): void {
    if (this.loggingLevel >= 2) {
      console.info('[WARNING] ', ...args);
    }
  }
}

export default new Logger();
