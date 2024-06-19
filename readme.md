# JDBC-CLONE

This library provides a simple database access layer that mimics the API of JDBC from Java. It is designed to work with MySQL databases using the `mysql2/promise` library and includes support for query execution, prepared statements, and data validation.

### Quick Start

1.  Create a **DataSource** object using the **DataSourceBuilder** class.

```typescript
import { DataSourceBuilder } from "jdbc-clone";

const dataSource = new DataSoureBuilder()
  .host("localhost")
  .username("user")
  .password("password")
  .databaseName("database")
  .build();
```

2.  Instantiate a **MySQLDatabaseConnection** object by passing in the **DataSource**.

```typescript
import { MySQLDatabaseConnection } from "jdbc-clone";

const connection = new MySQLDatabaseConnection(dataSource);
```

3. Create a statement using the **MySQLDatabaseConnection** object and call the `executeQuery` method on it to get the query results.

```typescript
const SQL = "SELECT * FROM foo";
const statement = connection.createStatement(SQL);
const resultSet = await statement.executeQuery();
```

4. You can also create a prepared statment using the **MySQLDatabaseConnection** object and set the parameters according to their position in the query;

```typescript
const SQL =
  "SELECT * FROM foo WHERE id = ? AND username = ? AND is_case_sensitive = ?";
const statement = connection.prepareStatement(SQL);
statement.setNumber(1, 3); // 1 is the position in the query and 3 is the actual value.
statement.setString(2, "username");
statement.setBoolean(3, true);
const resultSet = await statement.executeQuery();
```

5. The **ResultSet** object is an array of **Result** objects. Result objects have methods to extract individual columns according to their data type;

```typescript
const resultSet = await statement.exectuteQuery();
resultSet.forEach((result) => {
  const id = await result.getNumber("id");
  const username = await result.getString("username");
  const password = await result.getString("password");
  const isAdmin = await result.getBoolean("is_admin");
});
```

6. Queries that do not return any Results will return an empty array.

```typescript
const SQL = "INSERT INTO users (username, password) VALUES (?, ?)";
const statement = connection
  .prepareStatement(SQL)
  .setString(1, "username")
  .setString(2, "password");
const resultSet = await statement.executeQuery(); // this will return an empty array.
```

7. Alternatively, you can use the `execute`method instead of the `executeQuery` method. The `execute` method will return void.

```typescript
const SQL = "INSERT INTO users (username, password) VALUES (?, ?)";
const statement = connection
  .prepareStatement(SQL)
  .setString(1, "username")
  .setString(2, "password");
await statement.executeQuery(); // this will return nothing.
```
