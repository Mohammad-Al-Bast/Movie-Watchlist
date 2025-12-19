import express from "express";
import moviesRouter from "./routes/movies. js";
import categoriesRouter from "./routes/categories.js";

const app = express();
const port = 3000;

app.use(express.json());

// New movie watchlist routes
app.use("/api/v1/movies", moviesRouter);
app.use("/api/v1/categories", categoriesRouter);

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
