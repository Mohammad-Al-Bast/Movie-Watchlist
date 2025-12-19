import { Router } from "express";
import fs from "fs";
import { checkSchema, validationResult } from "express-validator";
import checkMovieMiddleware from "../middlewares/movies.mjs";
import { movieValidationSchema } from "../utils/validators.js";

const router = Router();
const movies = JSON.parse(fs.readFileSync("./movies.json", "utf8"));

// Get all movies with optional filters
router.get("/", (req, res) => {
	const { search, genre, watched, categoryId, sort } = req.query;
	let filteredMovies = [...movies];

	// Filter by search term (title or director)
	if (search) {
		filteredMovies = filteredMovies.filter(
			(movie) =>
				movie.title.toLowerCase().includes(search.toLowerCase()) ||
				movie.director?.toLowerCase().includes(search.toLowerCase())
		);
	}

	// Filter by genre
	if (genre) {
		filteredMovies = filteredMovies.filter(
			(movie) => movie.genre.toLowerCase() === genre.toLowerCase()
		);
	}

	// Filter by watched status
	if (watched !== undefined) {
		const isWatched = watched === "true";
		filteredMovies = filteredMovies.filter(
			(movie) => movie.watched === isWatched
		);
	}

	// Filter by category
	if (categoryId) {
		filteredMovies = filteredMovies.filter(
			(movie) => movie.categoryId === Number(categoryId)
		);
	}

	// Sort by rating
	if (sort === "rating") {
		filteredMovies.sort((a, b) => (b.rating || 0) - (a.rating || 0));
	}

	res.status(200).json({
		success: true,
		message: "Movies retrieved successfully",
		data: filteredMovies,
		count: filteredMovies.length,
	});
});

// Get statistics
router.get("/stats/summary", (req, res) => {
	const totalMovies = movies.length;
	const watchedMovies = movies.filter((movie) => movie.watched).length;
	const unwatchedMovies = totalMovies - watchedMovies;

	const ratedMovies = movies.filter((movie) => movie.rating !== null);
	const averageRating =
		ratedMovies.length > 0
			? (
					ratedMovies.reduce((sum, movie) => sum + movie.rating, 0) /
					ratedMovies.length
			  ).toFixed(2)
			: 0;

	const genreCounts = movies.reduce((acc, movie) => {
		acc[movie.genre] = (acc[movie.genre] || 0) + 1;
		return acc;
	}, {});

	res.status(200).json({
		success: true,
		message: "Statistics retrieved successfully",
		data: {
			totalMovies,
			watchedMovies,
			unwatchedMovies,
			averageRating: Number(averageRating),
			genreDistribution: genreCounts,
		},
	});
});

// Get single movie by ID
router.get("/:id", checkMovieMiddleware, (req, res) => {
	res.status(200).json({
		success: true,
		message: "Movie retrieved successfully",
		data: movies[req.movieIndex],
	});
});

// Add new movie
router.post("/", checkSchema(movieValidationSchema), (req, res) => {
	const validationResults = validationResult(req);
	if (!validationResults.isEmpty()) {
		return res.status(400).json({
			success: false,
			errors: validationResults.array(),
		});
	}

	const newMovie = {
		...req.body,
		id: movies.length > 0 ? movies[movies.length - 1].id + 1 : 1,
		rating: req.body.rating || null,
		watched: req.body.watched || false,
		watchedDate: req.body.watched
			? new Date().toISOString().split("T")[0]
			: null,
	};

	movies.push(newMovie);
	fs.writeFileSync(
		"./movies.json",
		JSON.stringify(movies, null, "\t"),
		"utf8"
	);

	res.status(201).json({
		success: true,
		message: "Movie added to watchlist successfully",
		data: newMovie,
	});
});

// Update movie (including marking as watched)
router.patch("/:id", checkMovieMiddleware, (req, res) => {
	const updatedMovie = { ...movies[req.movieIndex], ...req.body };

	// If marking as watched and no watchedDate provided, set current date
	if (req.body.watched && !updatedMovie.watchedDate) {
		updatedMovie.watchedDate = new Date().toISOString().split("T")[0];
	}

	// If marking as unwatched, clear watchedDate and rating
	if (req.body.watched === false) {
		updatedMovie.watchedDate = null;
		updatedMovie.rating = null;
	}

	movies.splice(req.movieIndex, 1, updatedMovie);
	fs.writeFileSync(
		"./movies.json",
		JSON.stringify(movies, null, "\t"),
		"utf8"
	);

	res.json({
		success: true,
		message: "Movie updated successfully",
		data: updatedMovie,
	});
});

// Delete movie
router.delete("/:id", checkMovieMiddleware, (req, res) => {
	const deletedMovie = movies[req.movieIndex];
	movies.splice(req.movieIndex, 1);
	fs.writeFileSync(
		"./movies.json",
		JSON.stringify(movies, null, "\t"),
		"utf8"
	);

	res.json({
		success: true,
		message: "Movie deleted from watchlist successfully",
		data: deletedMovie,
	});
});

export default router;
