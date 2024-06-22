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
