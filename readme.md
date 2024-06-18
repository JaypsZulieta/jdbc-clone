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
