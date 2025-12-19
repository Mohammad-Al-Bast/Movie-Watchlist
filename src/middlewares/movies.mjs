import fs from "fs";

const movies = JSON.parse(fs.readFileSync("./movies.json", "utf8"));

function checkMovieMiddleware(req, res, next) {
	const movieId = Number(req.params.id);

	if (isNaN(movieId)) {
		return res.status(400).json({
			success: false,
			message: "Invalid movie ID",
			data: null,
		});
	}

	const movieIndex = movies.findIndex((movie) => movie.id === movieId);

	if (movieIndex === -1) {
		return res.status(404).json({
			success: false,
			message: "Movie not found",
			data: null,
		});
	}

	req.movieIndex = movieIndex;
	next();
}

export default checkMovieMiddleware;
