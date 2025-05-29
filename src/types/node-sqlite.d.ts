/**
 * Type definitions for Node.js experimental SQLite module
 * Node.js v22.5.0+ with --experimental-sqlite flag
 */

declare module 'node:sqlite' {
  export class DatabaseSync {
    constructor(path: string, options?: {
      open?: boolean;
      readOnly?: boolean;
      enableForeignKeyConstraints?: boolean;
      enableDoubleQuotedStringLiterals?: boolean;
      allowExtension?: boolean;
      timeout?: number;
    });

    exec(sql: string): void;
    close(): void;
    open(): void;
    prepare(sql: string): StatementSync;
    isOpen: boolean;
    isTransaction: boolean;
  }

  export class StatementSync {
    run(...params: unknown[]): {
      changes: number;
      lastInsertRowid: number;
    };
    get(...params: unknown[]): unknown;
    all(...params: unknown[]): unknown[];
    iterate(...params: unknown[]): Iterator<unknown>;
    setAllowBareNamedParameters(enabled: boolean): void;
    setAllowUnknownNamedParameters(enabled: boolean): void;
    setReadBigInts(enabled: boolean): void;
    readonly expandedSQL: string;
    readonly sourceSQL: string;
    columns(): Array<{
      column: string | null;
      database: string | null;
      name: string;
      table: string | null;
      type: string | null;
    }>;
  }

  export function backup(
    sourceDb: DatabaseSync,
    path: string,
    options?: {
      source?: string;
      target?: string;
      rate?: number;
      progress?: (info: { totalPages: number; remainingPages: number }) => void;
    }
  ): Promise<number>;

  export const constants: {
    SQLITE_CHANGESET_DATA: number;
    SQLITE_CHANGESET_NOTFOUND: number;
    SQLITE_CHANGESET_CONFLICT: number;
    SQLITE_CHANGESET_CONSTRAINT: number;
    SQLITE_CHANGESET_FOREIGN_KEY: number;
    SQLITE_CHANGESET_OMIT: number;
    SQLITE_CHANGESET_REPLACE: number;
    SQLITE_CHANGESET_ABORT: number;
  };
} 