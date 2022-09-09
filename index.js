const express = require("express");
const { Client } = require("pg");

const PORT = 5001;
const app = express();
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "omdb",
  password: "lol",
  port: 5432,
});

app.get("/revenue", async (req, res) => {
  try {
    const { rows: ingredients } = await client.query(
      "SELECT id, name, COALESCE(revenue, 0) as revenue FROM movies ORDER BY revenue DESC LIMIT 1;"
    );
    console.log(ingredients);
    res.send(ingredients);
  } catch (error) {}
});

app.get("/keanu", async (req, res) => {
  try {
    const { rows: ingredients } = await client.query(
      `SELECT SUM(COALESCE(revenue,0)) FROM 
        casts c 
        INNER JOIN
        movies m
        ON
        m.id = c.movie_id WHERE c.person_id = (SELECT id FROM people WHERE name ILIKE '%keanu reeves%');`
    );
    console.log(ingredients);
    res.send(ingredients);
  } catch (error) {}
});

app.get("/keanu-people", async (req, res) => {
  try {
    const { rows: ingredients } = await client.query(
      `
      SELECT id, name FROM
      casts c
      INNER JOIN
      people p
      ON
      p.id = c.person_id WHERE c.movie_id = (
        SELECT movie_id FROM
        casts c
        INNER JOIN
        movies m
        ON
        m.id = c.movie_id WHERE c.person_id = (SELECT id FROM people WHERE name ILIKE '%keanu reeves%')
        ORDER BY COALESCE(revenue, null) DESC
        LIMIT 1
      ) 
      LIMIT 5;
   
        ;`
    );
    console.log(ingredients);
    res.send(ingredients);
  } catch (error) {}
});

app.get("/keanu", async (req, res) => {
  try {
    const { rows: ingredients } = await client.query(
      `SELECT SUM(COALESCE(revenue,0)) FROM 
        casts c 
        INNER JOIN
        movies m
        ON
        m.id = c.movie_id WHERE c.person_id = (SELECT id FROM people WHERE name ILIKE '%keanu reeves%');`
    );
    console.log(ingredients);
    res.send(ingredients);
  } catch (error) {}
});

app.get("/categories", async (req, res) => {
  try {
    const { rows: ingredients } = await client.query(
      `
      SELECT
      m.name, COUNT(c.id) AS count
    FROM
      movies m
    
    INNER JOIN
      movie_keywords mk
    ON
      mk.movie_id = m.id
    
    INNER JOIN
      categories c
    ON
      mk.category_id = c.id
    
    GROUP BY
      m.id, m.name
    
    ORDER BY
      count DESC
    
    LIMIT 10;
  
   
        ;`
    );
    console.log(ingredients);
    res.send(ingredients);
  } catch (error) {}
});

app.listen(PORT, async () => {
  await client.connect();
  console.log(`App is listening on port ${PORT}`);
});
