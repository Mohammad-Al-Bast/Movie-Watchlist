import express from "express";
import moviesRouter from "./src/routes/movies.js";
import categoriesRouter from "./src/routes/categories.js";

const app = express();
const port = 3000;

app.use(express.json());

// Movie watch list API routes
app.use("/api/v1/movies", moviesRouter);
app.use("/api/v1/categories", categoriesRouter);

app.listen(port, () => {
	console.log(`🎬 Movie Watch list API listening on port ${port}`);
});
