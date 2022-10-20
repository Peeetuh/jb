//db index. Our db/index.js file will provide the utility functions our app will use. We call them from the seed file, but also from our main app file.
const { Client } = require("pg"); // this imports the pg module

// creates the client, and specifies the location of the database
const client = new Client("postgres://localhost:5432/jb-dev");

async function getAllUsers() {
  const { rows } = await client.query(
    `
        SELECT id, username FROM users;
        `
  );
  return rows;
}

async function createUser({ username, password }) {
  try {
    const { rows } = await client.query(
      //on conflict, meaning if identical usernames, don't create.
      `
        INSERT INTO users(username, password)
        VALUES ($1, $2)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
        `,
      [username, password]
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  client,
  getAllUsers,
  createUser,
};
