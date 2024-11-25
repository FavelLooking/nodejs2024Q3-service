import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class LoggingService {
  private logLevel: string;

  constructor() {
    this.logLevel = process.env.LOG_LEVEL || '0';
  }

  private async logToFile(message: string, isError: boolean = false) {
    const logDir = path.join(process.cwd(), 'logs');
    const logFilePath = isError
      ? path.join(logDir, 'error.log')
      : path.join(logDir, 'app.log');

    try {
      await fs.promises.mkdir(logDir, { recursive: true });
    } catch (error) {
      this.logCriticalError('Error creating log directory:', error.stack);
    }

    const logMessage = `${new Date().toISOString()} - ${message}\n`;

    try {
      await fs.promises
        .access(logFilePath, fs.constants.F_OK)
        .catch(async () => {
          await fs.promises.writeFile(logFilePath, '');
        });
      const stats = await fs.promises.stat(logFilePath);
      const maxSize = parseInt(process.env.MAX_FILE_SIZE_MB) * 1024 * 1024;

      if (stats.size > maxSize) {
        const archivePath = path.join(
          logDir,
          `${isError ? 'error' : 'app'}-${Date.now()}.log`,
        );
        await fs.promises.rename(logFilePath, archivePath);
      }

      await fs.promises.appendFile(logFilePath, logMessage);
    } catch (error) {
      this.logCriticalError('Error writing log to file:', error.stack);
    }
  }

  private logToConsole(message: string) {
    console.log(message);
  }

  log(message: string) {
    if (this.shouldLog('log')) {
      this.logToConsole(message);
      this.logToFile(message);
    }
  }

  info(message: string) {
    if (this.shouldLog('info')) {
      this.logToConsole(`INFO: ${message}`);
      this.logToFile(`INFO: ${message}`);
    }
  }

  warn(message: string) {
    if (this.shouldLog('warn')) {
      this.logToConsole(`WARN: ${message}`);
      this.logToFile(`WARN: ${message}`);
    }
  }

  error(
    message: string,
    details?: string | Record<string, unknown>,
    trace?: string,
  ) {
    if (this.shouldLog('error')) {
      let fullMessage = `ERROR: ${message}`;

      if (details) {
        const detailsString =
          typeof details === 'string' ? details : JSON.stringify(details);
        fullMessage += ` | Details: ${detailsString}`;
      }

      if (trace) {
        fullMessage += ` | Trace: ${trace}`;
      }

      this.logToConsole(fullMessage);
      this.logToFile(fullMessage, true);
    }
  }

  logCriticalError(message: string, stack: string) {
    console.error(`[ERROR] ${message}`);
    console.error(stack);
  }

  private shouldLog(level: string): boolean {
    const logLevels = {
      log: 0,
      info: 1,
      warn: 2,
      error: 3,
    };

    const configuredLevel = logLevels[this.logLevel.toLowerCase()] || 0;
    const messageLevel = logLevels[level.toLowerCase()] || 0;

    return messageLevel >= configuredLevel;
  }
}
