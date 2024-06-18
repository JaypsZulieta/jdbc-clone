import { z as Zod } from "zod";
import MySQL, { Pool } from "mysql2/promise";

export abstract class SQLException extends Error {
  public constructor(message: string) {
    super(message);
  }
}

export class SQLSyntaxException extends SQLException {
  constructor(message: string) {
    super(message);
  }
}

export class DataValidationSQLException extends SQLException {
  public constructor(message: string) {
    super(message);
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

class ResultSet extends Array<Result> {}

export interface Statement {
  execute(): Promise<void>;
  executeQuery(): Promise<ResultSet>;
}

export interface PreparedStatement extends Statement {
  setString(position: number, data: string): PreparedStatement;
  setNumber(position: number, data: number): PreparedStatement;
  setBoolean(position: number, data: boolean): PreparedStatement;
}

export interface DatabaseConnection {
  createStatement(query: string): Statement;
  prepareStatement(query: string): PreparedStatement;
  close(): Promise<void>;
}

class DataSource {
  private host: string;
  private username: string;
  private password: string;
  private databaseName: string;

  constructor(
    host: string,
    username: string,
    password: string,
    database: string
  ) {
    this.host = host;
    this.username = username;
    this.password = password;
    this.databaseName = database;
  }

  public getHost(): string {
    return this.host;
  }

  public getUsername(): string {
    return this.username;
  }

  public getPassword(): string {
    return this.password;
  }

  public getDatabaseName(): string {
    return this.databaseName;
  }
}

export class DataSourceBuilder {
  private hostToSet: string;
  private usernameToSet: string;
  private passwordToSet: string;
  private databaseNameToSet: string;

  constructor() {
    this.hostToSet = "localhost";
    this.usernameToSet = "root";
    this.passwordToSet = "";
    this.databaseNameToSet = "database";
  }

  public host(host: string): DataSourceBuilder {
    this.hostToSet = host;
    return this;
  }

  public username(username: string): DataSourceBuilder {
    this.usernameToSet = username;
    return this;
  }

  public password(password: string): DataSourceBuilder {
    this.passwordToSet = password;
    return this;
  }

  public databaseName(databaseName: string): DataSourceBuilder {
    this.databaseNameToSet = databaseName;
    return this;
  }

  public build(): DataSource {
    return new DataSource(
      this.hostToSet,
      this.usernameToSet,
      this.passwordToSet,
      this.databaseNameToSet
    );
  }
}

class MySQLStatement implements Statement {
  private connectionPool: Pool;
  private sqlQuery: string;

  constructor(connectionPool: Pool, sqlQuery: string) {
    this.connectionPool = connectionPool;
    this.sqlQuery = sqlQuery;
  }

  public async execute(): Promise<void> {
    await this.connectionPool.query(this.sqlQuery);
  }

  public async executeQuery(): Promise<ResultSet> {
    const [results] = await this.connectionPool.query(this.sqlQuery);
    const data = results as any[];
    return data.map((data) => new Result(data));
  }
}

class MySQLPreparedStatement implements PreparedStatement {
  private sqlQuery: string;
  private parameters: any[];
  private connectionPool: Pool;

  constructor(connectionPool: Pool, sqlQuery: string) {
    this.connectionPool = connectionPool;
    this.sqlQuery = sqlQuery;
    this.parameters = [];
  }

  public setString(position: number, data: string): PreparedStatement {
    this.parameters[position - 1] = data;
    return this;
  }

  public setNumber(position: number, data: number): PreparedStatement {
    this.parameters[position - 1] = data;
    return this;
  }

  public setBoolean(position: number, data: boolean): PreparedStatement {
    this.parameters[position - 1] = data;
    return this;
  }

  public async executeQuery(): Promise<ResultSet> {
    try {
      const [results] = await this.connectionPool.query(
        this.sqlQuery,
        this.parameters
      );
      const data = results as any[];
      return data.map((data) => new Result(data));
    } catch (error) {
      if (error instanceof TypeError) return [];
      const message = (error as any).sqlMessage as string;
      throw new SQLSyntaxException(message);
    }
  }

  public async execute(): Promise<void> {
    await this.connectionPool.query(this.sqlQuery, this.parameters);
  }
}

export class MySQLDatabaseConnection implements DatabaseConnection {
  private connectionPool: Pool;

  public constructor(dataSource: DataSource) {
    this.connectionPool = MySQL.createPool({
      user: dataSource.getUsername(),
      password: dataSource.getPassword(),
      host: dataSource.getHost(),
      database: dataSource.getDatabaseName(),
    });
  }

  public createStatement(query: string): Statement {
    return new MySQLStatement(this.connectionPool, query);
  }

  public prepareStatement(query: string): PreparedStatement {
    return new MySQLPreparedStatement(this.connectionPool, query);
  }

  public async close(): Promise<void> {
    await this.connectionPool.end();
  }
}

export { type Result, type DataSource, type ResultSet };
