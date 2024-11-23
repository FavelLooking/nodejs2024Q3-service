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
      console.error('Error creating log directory:', error);
    }
    const logPath = path.join(logDir, 'app.log');
    const logMessage = `${new Date().toISOString()} - ${message}\n`;

    try {
      await fs.promises.appendFile(logPath, logMessage);
    } catch (error) {
      console.error('Error writing log to file:', error);
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

  error(message: string) {
    if (this.shouldLog('error')) {
      this.logToConsole(`ERROR: ${message}`);
      this.logToFile(`ERROR: ${message}`);
    }
  }

  private shouldLog(level: string): boolean {
    const levels = ['log', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }
}
