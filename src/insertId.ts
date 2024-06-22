import { z as Zod } from "zod";
import { DataValidationSQLException } from "./exceptions";

export class InsertId {
  private insertId: any;

  public constructor(insertId: any) {
    this.insertId = insertId;
  }

  public async getAsString(): Promise<string> {
    if (await this.isNotAString(this.insertId))
      throw new DataValidationSQLException("The Insert-id is not a string.");
    return this.insertId as string;
  }

  public async getAsNumber(): Promise<number> {
    if (await this.isNotANumber(this.insertId))
      throw new DataValidationSQLException("The Insert-id is not a number.");
    return this.insertId as number;
  }

  private async isNotAString(data: any): Promise<boolean> {
    return !(await Zod.string().safeParseAsync(data)).success;
  }

  private async isNotANumber(data: any): Promise<boolean> {
    return !(await Zod.number().safeParseAsync(data)).success;
  }
}
