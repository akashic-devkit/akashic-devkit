import ora from "ora";

export type LogLevel = "info" | "success" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Structured logger for CLI output
 * Inspired by shadcn-ui CLI style
 */
export const logger = {
  /**
   * Create a spinner for async operations
   */
  spinner(message: string) {
    return ora(message);
  },

  /**
   * Success message
   */
  success(message: string, details?: Record<string, unknown>) {
    const entry: LogEntry = {
      level: "success",
      message,
      details,
    };
    printLog(entry);
  },

  /**
   * Info message
   */
  info(message: string, details?: Record<string, unknown>) {
    const entry: LogEntry = {
      level: "info",
      message,
      details,
    };
    printLog(entry);
  },

  /**
   * Warning message
   */
  warn(message: string, details?: Record<string, unknown>) {
    const entry: LogEntry = {
      level: "warn",
      message,
      details,
    };
    printLog(entry);
  },

  /**
   * Error message
   */
  error(message: string, details?: Record<string, unknown>) {
    const entry: LogEntry = {
      level: "error",
      message,
      details,
    };
    printLog(entry);
  },

  /**
   * Debug message
   */
  debug(message: string, details?: Record<string, unknown>) {
    if (process.env.DEBUG) {
      const entry: LogEntry = {
        level: "debug",
        message,
        details,
      };
      printLog(entry);
    }
  },

  /**
   * List items with bullet points
   */
  list(items: string[], title?: string) {
    if (title) {
      console.log(`\n${title}`);
    }
    items.forEach((item) => {
      console.log(`  • ${item}`);
    });
  },

  /**
   * Empty line
   */
  break() {
    console.log();
  },
};

/**
 * Print formatted log entry
 */
function printLog(entry: LogEntry) {
  const icon = getIcon(entry.level);
  const message = `${icon} ${entry.message}`;

  console.log(message);

  if (entry.details && Object.keys(entry.details).length > 0) {
    Object.entries(entry.details).forEach(([key, value]) => {
      const detail =
        typeof value === "string" ? value : JSON.stringify(value);
      console.log(`  ${key}: ${detail}`);
    });
  }
}

/**
 * Get icon for log level
 */
function getIcon(level: LogLevel): string {
  const icons: Record<LogLevel, string> = {
    success: "✔",
    info: "ℹ",
    warn: "⚠",
    error: "✖",
    debug: "◆",
  };
  return icons[level];
}
