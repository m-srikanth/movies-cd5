const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());
let db = null;
const dbPath = path.join(__dirname, "moviesData.db");
const initiatingDB = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("It's Running...");
    });
  } catch (e) {
    console.log(`Error is ${e.message}`);
    process.exit(1);
  }
};
initiatingDB();
//API-1
app.get("/movies/", async (request, response) => {
  const query = `SELECT movie_name FROM movie;`;
  const array = await db.all(query);
  let result = (i) => {
    return { movieName: i.movie_name };
  };
  response.send(array.map((i) => result(i)));
});

//API-2
app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const query = `INSERT INTO movie(director_id, movie_name, lead_actor) VALUES ('${directorId}', '${movieName}', '${leadActor}');`;
  const array = await db.run(query);
  response.send("Movie Successfully Added");
});

//API-3
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const query = `SELECT * FROM movie WHERE movie_id = ${movieId};`;
  const array = await db.get(query);
  const result = {
    movieId: array.movie_id,
    directorId: array.director_id,
    movieName: array.movie_name,
    leadActor: array.lead_actor,
  };
  response.send(result);
});

//API-4
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const { directorId, movieName, leadActor } = request.body;
  const query = `UPDATE movie SET director_id = '${directorId}', movie_name = '${movieName}', lead_actor = '${leadActor}' WHERE movie_id = ${movieId};`;
  const array = await db.run(query);
  response.send("Movie Details Updated");
});

//API-5
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const query = `DELETE FROM movie WHERE movie_id = ${movieId};`;
  const array = await db.run(query);
  response.send("Movie Removed");
});

//API-6
app.get("/directors/", async (request, response) => {
  const query = `SELECT * FROM director;`;
  const array = await db.all(query);
  let result = (i) => {
    return { directorId: i.director_id, directorName: i.director_name };
  };
  response.send(array.map((i) => result(i)));
});
//API-7
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const query = `SELECT movie_name FROM movie WHERE director_id = ${directorId};`;
  const array = await db.all(query);
  response.send(array.map((i) => ({ movieName: i.movie_name })));
});
module.exports = app;
