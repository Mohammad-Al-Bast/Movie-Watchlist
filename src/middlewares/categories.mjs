import fs from "fs";

const categories = JSON.parse(fs.readFileSync("./categories.json", "utf8"));

function checkCategoryMiddleware(req, res, next) {
	const categoryId = Number(req.params.id);

	if (isNaN(categoryId)) {
		return res.status(400).json({
			success: false,
			message: "Invalid category ID",
			data: null,
		});
	}

	const categoryIndex = categories.findIndex(
		(category) => category.id === categoryId
	);

	if (categoryIndex === -1) {
		return res.status(404).json({
			success: false,
			message: "Category not found",
			data: null,
		});
	}

	req.categoryIndex = categoryIndex;
	next();
}

export default checkCategoryMiddleware;
