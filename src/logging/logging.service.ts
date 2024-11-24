import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingService {
  private logLevel: string;

  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'info';
  }

  private async logToFile(message: string) {
    const logDir = path.join(__dirname, '..', 'logs');

    try {
      await fs.promises.mkdir(logDir, { recursive: true });
    } catch (error) {
      this.logCriticalError('Error creating log directory:', error.stack);
    }

    const logPath = path.join(logDir, 'app.log');
    const logMessage = `${new Date().toISOString()} - ${message}\n`;

    try {
      const stats = await fs.promises.stat(logPath);
      const maxSize = 1024 * 1024;

      if (stats.size > maxSize) {
        const archivePath = path.join(logDir, `app-${Date.now()}.log`);
        await fs.promises.rename(logPath, archivePath);
      }

      await fs.promises.appendFile(logPath, logMessage);
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
      this.logToFile(fullMessage);
    }
  }

  logCriticalError(message: string, stack: string) {
    console.error(`[ERROR] ${message}`);
    console.error(stack);
  }

  private shouldLog(level: string): boolean {
    const levels = ['log', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }
}
