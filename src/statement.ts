import { QueryResult } from "./queryResult";

export interface Statement {
  execute(): Promise<QueryResult>;
}

export interface PreparedStatement extends Statement {
  setString(position: number, data: string): PreparedStatement;
  setNumber(position: number, data: string): PreparedStatement;
  setBoolean(position: number, data: string): PreparedStatement;
}
