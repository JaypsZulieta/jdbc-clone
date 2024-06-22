import { PreparedStatement, Statement } from "./statement";

export interface DatabaseConnection {
  craateStatement(SQL: string): Statement;
  prepareStatement(SQL: string): PreparedStatement;
}
