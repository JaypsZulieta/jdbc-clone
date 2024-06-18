import { DataSourceBuilder, MySQLDatabaseConnection } from ".";

const main = async () => {
  const dataSource = new DataSourceBuilder()
    .host("localhost")
    .username("root")
    .password("Xscvsdg5417!")
    .databaseName("questions_and_answers")
    .build();
  const connection = new MySQLDatabaseConnection(dataSource);
  const SQL = "DELETE FROM questions";
  const statement = connection.createStatement(SQL);
  const result = statement.execute();
  console.log(result);
  await connection.close();
};

main();
