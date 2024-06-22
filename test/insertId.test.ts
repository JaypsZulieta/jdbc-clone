import { DataValidationSQLException } from "../src/exceptions";
import { InsertId } from "../src/insertId";

describe("InsertId", () => {
  describe("getAsString", () => {
    test("Throws DataValidationSQLException if the Insert-id is not a string.", () => {
      const insertId = new InsertId(69);
      const action = insertId.getAsString();
      expect(action).rejects.toThrow(DataValidationSQLException);
      expect(action).rejects.toThrow("The Insert-id is not a string.");
    });

    test("Returns the Insert-id value as a string.", () => {
      const insertId = new InsertId("foo");
      expect(insertId.getAsString()).resolves.toBe("foo");
    });
  });

  describe("getAsNumber", () => {
    test("Throws DataValidationSQLException if the Insert-id is not a number.", () => {
      const insertId = new InsertId("foo");
      const action = insertId.getAsNumber();
      expect(action).rejects.toThrow(DataValidationSQLException);
      expect(action).rejects.toThrow("The Insert-id is not a number.");
    });

    test("Returns the Insert-id value as a number.", () => {
      const insertId = new InsertId(69);
      expect(insertId.getAsNumber()).resolves.toBe(69);
    });
  });
});
