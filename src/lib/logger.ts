/**
 * Lightweight logger utility for LibreTier
 *
 * Best practices:
 * - Development logs (debug, info, log) are suppressed in production
 * - Warnings are shown in development only (use for debugging)
 * - Errors in production should use logger.prod.error() for critical issues
 * - Use logger.child("ModuleName") to create scoped loggers
 *
 * Usage:
 *   import { logger } from "@/lib/logger";
 *
 *   // Basic logging (dev only)
 *   logger.debug("Processing items", { count: 5 });
 *   logger.info("User action completed");
 *   logger.warn("Deprecated feature used");
 *
 *   // Production errors (always logged)
 *   logger.prod.error("Critical failure", error);
 *
 *   // Scoped logger
 *   const log = logger.child("TierStore");
 *   log.debug("State updated");
 */

const isDev = process.env.NODE_ENV !== "production";

type LogLevel = "debug" | "info" | "log" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

function formatMessage(
  level: LogLevel,
  scope: string | null,
  message: string,
  context?: LogContext
): string {
  const prefix = scope ? `[${scope}]` : "";
  const levelTag = `[${level.toUpperCase()}]`;
  const contextStr =
    context && Object.keys(context).length > 0
      ? ` ${JSON.stringify(context)}`
      : "";
  return `${levelTag}${prefix} ${message}${contextStr}`;
}

function createLogMethod(level: LogLevel, scope: string | null = null) {
  return (message: string, context?: LogContext | Error) => {
    if (!isDev) return;

    const ctx =
      context instanceof Error
        ? { error: context.message, stack: context.stack }
        : context;

    const formatted = formatMessage(level, scope, message, ctx);

    if (level === "error") {
      console.error(formatted);
    } else if (level === "warn") {
      console.warn(formatted);
    } else {
      // eslint-disable-next-line no-console -- Logger utility is the single source for console output
      console.log(formatted);
    }
  };
}

function createProdLogMethod(level: "error" | "warn") {
  return (message: string, context?: LogContext | Error) => {
    const ctx =
      context instanceof Error
        ? { error: context.message, stack: context.stack }
        : context;

    const formatted = formatMessage(level, null, message, ctx);

    if (level === "error") {
      console.error(formatted);
    } else {
      console.warn(formatted);
    }
  };
}

interface Logger {
  /** Debug log - dev only, verbose details */
  debug: (message: string, context?: LogContext | Error) => void;
  /** Info log - dev only, general information */
  info: (message: string, context?: LogContext | Error) => void;
  /** General log - dev only */
  log: (message: string, context?: LogContext | Error) => void;
  /** Warning log - dev only */
  warn: (message: string, context?: LogContext | Error) => void;
  /** Error log - dev only (use prod.error for production) */
  error: (message: string, context?: LogContext | Error) => void;
  /** Production loggers - always output regardless of environment */
  prod: {
    /** Critical errors that should be logged in production */
    error: (message: string, context?: LogContext | Error) => void;
    /** Important warnings that should be logged in production */
    warn: (message: string, context?: LogContext | Error) => void;
  };
  /** Create a scoped child logger */
  child: (scope: string) => Omit<Logger, "child" | "prod">;
}

export const logger: Logger = {
  debug: createLogMethod("debug"),
  info: createLogMethod("info"),
  log: createLogMethod("log"),
  warn: createLogMethod("warn"),
  error: createLogMethod("error"),
  prod: {
    error: createProdLogMethod("error"),
    warn: createProdLogMethod("warn"),
  },
  child: (scope: string) => ({
    debug: createLogMethod("debug", scope),
    info: createLogMethod("info", scope),
    log: createLogMethod("log", scope),
    warn: createLogMethod("warn", scope),
    error: createLogMethod("error", scope),
  }),
};

export default logger;
