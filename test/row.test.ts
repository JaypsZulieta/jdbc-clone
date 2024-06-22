import { DataValidationSQLException } from "../src/exceptions";
import { Row } from "../src/row";

describe("Row", () => {
  describe("getColumnAsString", () => {
    test("Throws DataValidationSQLException if the column does not exist.", () => {
      const expectedMessage = "The column 'foo' does not exist in the row.";
      const row = new Row({});
      const action = row.getColumnAsString("foo");
      expect(action).rejects.toThrow(DataValidationSQLException);
      expect(action).rejects.toThrow(expectedMessage);
    });

    test("Throws DataValidationSQLException if the column is not a string.", () => {
      const expectedMessage = "The column 'foo' is not a string.";
      const row = new Row({ foo: 123 });
      const action = row.getColumnAsString("foo");
      expect(action).rejects.toThrow(DataValidationSQLException);
      expect(action).rejects.toThrow(expectedMessage);
    });

    test("Returns the column value as a string.", () => {
      const row = new Row({ foo: "Bar" });
      expect(row.getColumnAsString("foo")).resolves.toBe("Bar");
    });
  });

  describe("getColumnAsNumber", () => {
    test("Throws DataValidationSQLException if the column does not exist.", () => {
      const expectedMessage = "The column 'foo' does not exist in the row.";
      const row = new Row({});
      const action = row.getColumnAsNumber("foo");
      expect(action).rejects.toThrow(DataValidationSQLException);
      expect(action).rejects.toThrow(expectedMessage);
    });

    test("Throws DataValidationSQLException if the column is not a number.", () => {
      const expectedMessage = "The column 'foo' is not a number.";
      const row = new Row({ foo: "Bar" });
      const action = row.getColumnAsNumber("foo");
      expect(action).rejects.toThrow(DataValidationSQLException);
      expect(action).rejects.toThrow(expectedMessage);
    });

    test("Returns the column value as a number.", () => {
      const row = new Row({ foo: 69 });
      expect(row.getColumnAsNumber("foo")).resolves.toBe(69);
    });
  });

  describe("getColumnAsBoolean", () => {
    test("Throws DataValidationSQLException if the column does not exist.", () => {
      const expectedMessage = "The column 'foo' does not exist in the row.";
      const row = new Row({});
      const action = row.getColumnAsBoolean("foo");
      expect(action).rejects.toThrow(DataValidationSQLException);
      expect(action).rejects.toThrow(expectedMessage);
    });

    test("Throws DataValidationSQLException if the column is not a boolean.", () => {
      const expectedMessage = "The column 'foo' is not a boolean.";
      const row = new Row({ foo: "bar" });
      const action = row.getColumnAsBoolean("foo");
      expect(action).rejects.toThrow(DataValidationSQLException);
      expect(action).rejects.toThrow(expectedMessage);
    });

    test("Throws DataValidationSQLException if the column is not 1 or 0.", () => {
      const expectedMessage = "The column 'foo' is not a boolean.";
      const row = new Row({ foo: 69 });
      const action = row.getColumnAsBoolean("foo");
      expect(action).rejects.toThrow(DataValidationSQLException);
      expect(action).rejects.toThrow(expectedMessage);
    });

    test("Returns the column value as true if the value is true.", () => {
      const row = new Row({ foo: true });
      expect(row.getColumnAsBoolean("foo")).resolves.toBe(true);
    });

    test("Returns the column value as false if the value is false.", () => {
      const row = new Row({ foo: false });
      expect(row.getColumnAsBoolean("foo")).resolves.toBe(false);
    });

    test("Returns the column value as true if the value is 1.", () => {
      const row = new Row({ foo: 1 });
      expect(row.getColumnAsBoolean("foo")).resolves.toBe(true);
    });

    test("Returns the column value as false if the value is 0.", () => {
      const row = new Row({ foo: 0 });
      expect(row.getColumnAsBoolean("foo")).resolves.toBe(false);
    });
  });
});
