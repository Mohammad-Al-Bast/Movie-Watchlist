// Movie validation schema
export const movieValidationSchema = {
	title: {
		notEmpty: {
			errorMessage: "Title is required",
		},
		isLength:  {
			options: { min:  1, max: 200 },
			errorMessage: "Title must be between 1 and 200 characters",
		},
	},
	genre: {
		notEmpty: {
			errorMessage: "Genre is required",
		},
		isLength: {
			options: { min: 3, max: 50 },
			errorMessage: "Genre must be between 3 and 50 characters",
		},
	},
	year: {
		optional: true,
		isInt: {
			options: { min: 1888, max: 2100 },
			errorMessage: "Year must be between 1888 and 2100",
		},
	},
	director: {
		optional: true,
		isLength: {
			options: { max: 100 },
			errorMessage: "Director name must be less than 100 characters",
		},
	},
	rating:  {
		optional: true,
		isFloat: {
			options: { min: 0, max: 10 },
			errorMessage: "Rating must be between 0 and 10",
		},
	},
	watched:  {
		optional: true,
		isBoolean: {
			errorMessage: "Watched must be a boolean value",
		},
	},
	notes: {
		optional: true,
		isLength: {
			options: { max: 500 },
			errorMessage: "Notes must be less than 500 characters",
		},
	},
	categoryId: {
		optional: true,
		isInt: {
			options: { min: 1 },
			errorMessage: "Category ID must be a positive integer",
		},
	},
};

// Category validation schema
export const categoryValidationSchema = {
	name: {
		notEmpty: {
			errorMessage: "Category name is required",
		},
		isLength: {
			options:  { min: 2, max:  50 },
			errorMessage: "Category name must be between 2 and 50 characters",
		},
	},
	description: {
		optional: true,
		isLength: {
			options: { max: 200 },
			errorMessage: "Description must be less than 200 characters",
		},
	},
};