//for us to get access to the database...
// this is where re reconcile, checking tables for correct definitions, no unwanted data, have enough data, havge necessary user-facing data.
//We primarily use seed file to build/rebuild tables, and fill them with some starting data.
// We need a programmatic way to do this, rather than having to connect directly to the SQL server and directly type in queries by hand.
// grabs our client with destructuring from the export in index.js. (grabs only the client)
const { client, getAllUsers, createUser } = require("./index");

//important to drop tables before creating new ones, otherwise error will pop up if table exists.
async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
        DROP TABLE IF EXISTS users;
        `);
    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error; // we pass the error up to the function that calls dropTables.
  }
}

// this function should call a query which creates all tables for our database.
async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        );
        `);

    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    const albert = await createUser({
      username: "albert",
      password: "bertie99",
    });
    console.log(albert);

    const sandra = await createUser({
      username: "sandra",
      password: "imposter_albert",
    });

    const glamgal = await createUser({
      username: "glamgal",
      password: "imposter_albert",
    });

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
  } catch (error) {
    console.error(error);
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    const users = await getAllUsers();
    console.log("getAllUsers:", users);

    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());

// testDB();

/*
async function testDB() {
    try {
      // this actually connects us to the database.
      client.connect();
      // queries are promises, so we can await them.
      const { rows } = await client.query(`
          SELECT * FROM users;        
          `);
      // console.log for error handling.
      console.log(rows);
    } catch (error) {
      console.error(error);
    } finally {
      // its importtant to close out the client connection during testing.
      client.end();
    }
  }
  */
