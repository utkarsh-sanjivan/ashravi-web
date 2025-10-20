/**
 * Logger Service
 * Centralized logging that's disabled in production
 */

const isDevelopment = process.env.NODE_ENV === 'development';

class Logger {
  info(message: string, data?: any): void {
    if (isDevelopment) {
      console.log(`ℹ️ ${message}`, data !== undefined ? data : '');
    }
  }

  success(message: string, data?: any): void {
    if (isDevelopment) {
      console.log(`✅ ${message}`, data !== undefined ? data : '');
    }
  }

  warn(message: string, data?: any): void {
    if (isDevelopment) {
      console.warn(`⚠️ ${message}`, data !== undefined ? data : '');
    }
  }

  error(message: string, error?: any): void {
    // Always log errors
    console.error(`❌ ${message}`, error !== undefined ? error : '');
  }

  debug(message: string, data?: any): void {
    if (isDevelopment) {
      console.debug(`🔍 ${message}`, data !== undefined ? data : '');
    }
  }
}

export const logger = new Logger();
export default logger;
