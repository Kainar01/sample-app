import { LogLevel } from '@techbridge/util/logger';

export type TechbridgeLoggerOptions = {
  serviceName: string;
  logLevel?: LogLevel;
  isProduction?: boolean;
};

export const TECHBRIDGE_LOGGER_MODULE_OPTIONS =
  'TECHBRIDGE_LOGGER_MODULE_OPTIONS';
