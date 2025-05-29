declare module 'better-sqlite3' {
    export type SqlValue = string | number | boolean | null | Buffer;
    export type SqlParams = SqlValue | SqlValue[] | Record<string, SqlValue> | Record<string, never>;

    export interface RunResult {
        lastInsertRowid: number;
        changes: number;
    }

    export interface Statement {
        run(...params: SqlParams[]): RunResult;
        get(...params: SqlParams[]): Record<string, SqlValue> | undefined;
        all(...params: SqlParams[]): Record<string, SqlValue>[];
        iterate(...params: SqlParams[]): IterableIterator<Record<string, SqlValue>>;
    }

    export interface DatabaseOptions {
        verbose?: (sql: string) => void;
        fileMustExist?: boolean;
        timeout?: number;
        readonly?: boolean;
    }

    export interface TransactionFunction<T> {
        (): T;
    }

    export class Database {
        constructor(filename: string, options?: DatabaseOptions);
        prepare(sql: string): Statement;
        transaction<T>(fn: TransactionFunction<T>): TransactionFunction<T>;
        close(): void;
    }

    export default Database;
} 