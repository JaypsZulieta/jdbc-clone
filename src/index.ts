import { z as Zod } from "zod";
import MySQL from "mysql2";
import { Connection } from "mysql2/typings/mysql/lib/Connection";

export abstract class SQLException extends Error {
  public constructor(message: string) {
    super(message);
  }
}

export class DataValidationSQLException extends SQLException {
  public constructor(message: string) {
    super(message);
  }
}

export class DataSource {
  private databaseURL: string;

  public constructor(databaseURL: string) {
    this.databaseURL = databaseURL;
  }

  public getDatabaseURL(): string {
    return this.databaseURL;
  }
}

class Result {
  private data: any;

  public constructor(data: any) {
    this.data = data;
  }

  public async getString(columnName: string): Promise<string> {
    const data = this.data[columnName];
    const columnDoesNotExistMessage = `'${columnName}' does not exist in result.`;
    const dataIsNotAStringMessage = `'${columnName}' is not a string.`;
    if (!data) throw new DataValidationSQLException(columnDoesNotExistMessage);
    if (await this.isNotAString(data))
      throw new DataValidationSQLException(dataIsNotAStringMessage);
    return data as string;
  }

  public async getNumber(columnName: string): Promise<number> {
    const data = this.data[columnName];
    const columnDoesNotExistMessage = `'${columnName}' does not exist in result.`;
    const dataIsNotANumberMessage = `'${columnName}' is not a number.`;
    if (!data) throw new DataValidationSQLException(columnDoesNotExistMessage);
    if (await this.isNotANumber(data))
      throw new DataValidationSQLException(dataIsNotANumberMessage);
    return data as number;
  }

  public async getBoolean(columnName: string): Promise<boolean> {
    const data = this.data[columnName];
    const columnDoesNotExistMessage = `'${columnName}' does not exist in result.`;
    const dataIsNotABooleanMessage = `${columnName} is not a boolean.`;
    if (!data) throw new DataValidationSQLException(columnDoesNotExistMessage);
    if (await this.isNotABoolean(data))
      throw new DataValidationSQLException(dataIsNotABooleanMessage);
    return data as boolean;
  }

  private async isNotAString(data: any): Promise<boolean> {
    return !(await Zod.string().safeParseAsync(data)).success;
  }

  private async isNotANumber(data: any): Promise<boolean> {
    return !(await Zod.string().safeParseAsync(data)).success;
  }

  private async isNotABoolean(data: any): Promise<boolean> {
    return !(await Zod.string().safeParseAsync(data)).success;
  }
}

export interface Statement {
  execute(): Promise<Result[]>;
}

export interface PreparedStatement extends Statement {
  setString(position: number, data: string): Promise<PreparedStatement>;
  setNumber(position: number, data: number): Promise<PreparedStatement>;
  setBoolean(position: number, data: boolean): Promise<PreparedStatement>;
}

export interface DatabaseConnection {
  createStatemet(query: string): Promise<Statement>;
  prepareStatement(query: string): Promise<PreparedStatement>;
}

class MySQLStatment implements Statement {
  private sql: string;
  private connection: Connection;

  constructor(sql: string, connection: Connection) {
    this.sql = sql;
    this.connection = connection;
  }

  public async execute(): Promise<Result[]> {
    throw Error();
  }
}

export class MySQLDatabaseConnection implements DatabaseConnection {
  private connection: Connection;

  constructor(dataSource: DataSource) {
    this.connection = MySQL.createConnection(dataSource.getDatabaseURL());
  }

  public async createStatemet(query: string): Promise<Statement> {
    throw new Error("Method not implemented.");
  }

  public async prepareStatement(query: string): Promise<PreparedStatement> {
    throw new Error("Method not implemented.");
  }
}
