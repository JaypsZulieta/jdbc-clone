import { InsertId } from "./insertId";
import { Row } from "./row";

export class QueryResult {
  private insertId?: InsertId;
  private rows: Row[];
  private numberOfAffectedRows: number;

  constructor(rows: Row[], numberOfAffectedRows: number, insertId?: InsertId) {
    this.rows = rows;
    this.numberOfAffectedRows = numberOfAffectedRows;
    this.insertId = insertId;
  }

  public getInsertId(): InsertId | undefined {
    return this.insertId;
  }

  public getRows(): Row[] {
    return this.rows;
  }

  public countRowsAffected(): number {
    return this.numberOfAffectedRows;
  }
}

export class QueryResultBuilder {
  private insertIdToSet: InsertId | undefined;
  private rowsToSet: Row[];
  private numberOfAffectedRowsToSet: number;

  constructor() {
    this.insertIdToSet = undefined;
    this.rowsToSet = [];
    this.numberOfAffectedRowsToSet = 0;
  }

  public insertId(insertId: InsertId | undefined): QueryResultBuilder {
    this.insertIdToSet = insertId;
    return this;
  }

  public rows(rows: Row[]): QueryResultBuilder {
    this.rowsToSet = rows;
    return this;
  }

  public numberOfAffectedRows(number: number): QueryResultBuilder {
    this.numberOfAffectedRowsToSet = number;
    return this;
  }

  public buld(): QueryResult {
    return new QueryResult(
      this.rowsToSet,
      this.numberOfAffectedRowsToSet,
      this.insertIdToSet
    );
  }
}
