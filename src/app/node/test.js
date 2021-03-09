
const dbConnections = require(`${__dirname}/dbConnection`);

let client = dbConnections.getConnection();
try {
  client.connect();
  client.query('SELECT * FROM test;', (err, res) => {
    if (err) throw console.log(err);
    res.rows
    for (let row of res.rows) {
      console.log(row.name);
    }
    client.end()
  });
} catch (error) {
  console.error('error executing query as : ' + error);
}
