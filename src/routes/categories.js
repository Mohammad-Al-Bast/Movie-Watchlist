import { Router } from "express";
import fs from "fs";
import { checkSchema, validationResult } from "express-validator";
import checkCategoryMiddleware from "../middlewares/categories.mjs";
import { categoryValidationSchema } from "../utils/validators.js";

const router = Router();
const categories = JSON.parse(fs.readFileSync("./categories.json", "utf8"));
const movies = JSON.parse(fs.readFileSync("./movies.json", "utf8"));

// Get all categories
router.get("/", (req, res) => {
	// Add movie count to each category
	const categoriesWithCount = categories.map((category) => ({
		...category,
		movieCount: movies.filter((movie) => movie.categoryId === category.id)
			.length,
	}));

	res.status(200).json({
		success: true,
		message: "Categories retrieved successfully",
		data: categoriesWithCount,
	});
});

// Get single category by ID
router.get("/:id", checkCategoryMiddleware, (req, res) => {
	const category = categories[req.categoryIndex];
	const categoryMovies = movies.filter(
		(movie) => movie.categoryId === category.id
	);

	res.status(200).json({
		success: true,
		message: "Category retrieved successfully",
		data: {
			...category,
			movies: categoryMovies,
			movieCount: categoryMovies.length,
		},
	});
});

// Get movies by category ID
router.get("/:id/movies", checkCategoryMiddleware, (req, res) => {
	const category = categories[req.categoryIndex];
	const categoryMovies = movies.filter(
		(movie) => movie.categoryId === category.id
	);

	res.status(200).json({
		success: true,
		message: `Movies in category '${category.name}' retrieved successfully`,
		data: categoryMovies,
		count: categoryMovies.length,
	});
});

// Create new category
router.post("/", checkSchema(categoryValidationSchema), (req, res) => {
	const validationResults = validationResult(req);
	if (!validationResults.isEmpty()) {
		return res.status(400).json({
			success: false,
			errors: validationResults.array(),
		});
	}

	const newCategory = {
		...req.body,
		id:
			categories.length > 0
				? categories[categories.length - 1].id + 1
				: 1,
	};

	categories.push(newCategory);
	fs.writeFileSync(
		"./categories.json",
		JSON.stringify(categories, null, "\t"),
		"utf8"
	);

	res.status(201).json({
		success: true,
		message: "Category created successfully",
		data: newCategory,
	});
});

// Update category
router.patch("/:id", checkCategoryMiddleware, (req, res) => {
	const updatedCategory = { ...categories[req.categoryIndex], ...req.body };

	categories.splice(req.categoryIndex, 1, updatedCategory);
	fs.writeFileSync(
		"./categories.json",
		JSON.stringify(categories, null, "\t"),
		"utf8"
	);

	res.json({
		success: true,
		message: "Category updated successfully",
		data: updatedCategory,
	});
});

// Delete category
router.delete("/:id", checkCategoryMiddleware, (req, res) => {
	const categoryId = categories[req.categoryIndex].id;

	// Check if category has movies
	const hasMovies = movies.some((movie) => movie.categoryId === categoryId);

	if (hasMovies) {
		return res.status(400).json({
			success: false,
			message:
				"Cannot delete category with movies. Please reassign or delete movies first.",
			data: null,
		});
	}

	const deletedCategory = categories[req.categoryIndex];
	categories.splice(req.categoryIndex, 1);
	fs.writeFileSync(
		"./categories.json",
		JSON.stringify(categories, null, "\t"),
		"utf8"
	);

	res.json({
		success: true,
		message: "Category deleted successfully",
		data: deletedCategory,
	});
});

export default router;
