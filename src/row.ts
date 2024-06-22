import { DataValidationSQLException } from "./exceptions";
import { z as Zod } from "zod";

export class Row {
  private rowData: any;

  public constructor(rowData: any) {
    this.rowData = rowData;
  }

  public async getColumnAsString(columnName: string): Promise<string> {
    const columnData = this.rowData[columnName];
    this.checkIfUndefined(columnData, columnName);
    if (await this.isNotAString(columnData))
      throw new DataValidationSQLException(
        `The column '${columnName}' is not a string.`
      );
    return columnData as string;
  }

  public async getColumnAsNumber(columnName: string): Promise<number> {
    const columnData = this.rowData[columnName];
    this.checkIfUndefined(columnData, columnName);
    if (await this.isNotANumber(columnData))
      throw new DataValidationSQLException(
        `The column '${columnName}' is not a number.'`
      );
    return columnData as number;
  }

  public async getColumnAsBoolean(columnName: string): Promise<boolean> {
    const columnData = this.rowData[columnName];
    this.checkIfUndefined(columnData, columnName);
    if (await this.isNotANumberAndIsNotABoolean(columnData))
      throw new DataValidationSQLException(
        `The column '${columnName}' is not a boolean.`
      );
    if (await this.isANumber(columnData))
      return this.binaryToBoolean(columnData, columnName);
    return columnData as boolean;
  }

  private checkIfUndefined(columnData: any, columnName: string): void {
    if (columnData == undefined)
      throw new DataValidationSQLException(
        `The column '${columnName}' does not exist in the row.`
      );
  }

  private async isNotAString(data: any): Promise<boolean> {
    return !(await Zod.string().safeParseAsync(data)).success;
  }
  private async isNotANumber(data: any): Promise<boolean> {
    return !(await Zod.number().safeParseAsync(data)).success;
  }

  private async isNotABoolean(data: any): Promise<boolean> {
    return !(await Zod.boolean().safeParseAsync(data)).success;
  }

  private async isANumber(data: any) {
    return !(await this.isNotANumber(data));
  }

  private async isNotANumberAndIsNotABoolean(data: any) {
    return (await this.isNotANumber(data)) && (await this.isNotABoolean(data));
  }

  private binaryToBoolean(data: number, columnName: string) {
    if (data == 0) return false;
    else if (data == 1) return true;
    else
      throw new DataValidationSQLException(
        `The column '${columnName}' is not a boolean.`
      );
  }
}
