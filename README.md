# Movie Watch list API

A RESTful API built with Express.js for managing your personal movie watch list. Track movies you want to watch, organize them by categories, rate watched movies, and get statistics about your viewing habits.

## Features

-   ✅ CRUD operations for movies and categories
-   🔍 Search and filter movies by title, director, genre, and watched status
-   ⭐ Rate watched movies (0-10 scale)
-   📊 Get statistics (total movies, watched/unwatched, average rating, genre distribution)
-   🏷️ Organize movies into custom categories
-   ✔️ Input validation using express-validator
-   📝 Add personal notes for each movie

## Tech Stack

-   **Node.js** - Runtime environment
-   **Express.js** - Web framework
-   **express-validator** - Input validation
-   **File-based storage** - JSON files for data persistence

## Project Structure

```
Movie-Watch list/
├── server.js                 # Main server file
├── movies.json               # Movies database
├── categories.json           # Categories database
├── package.json             # Dependencies and scripts
├── src/
│   ├── routes/
│   │   ├── movies.js        # Movie route handlers
│   │   └── categories.js    # Category route handlers
│   ├── middlewares/
│   │   ├── movies.mjs       # Movie validation middleware
│   │   └── categories.mjs   # Category validation middleware
│   └── utils/
│       └── validators.js    # Validation schemas
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Movie-Watch list
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

The server will run on `http://localhost:3000`

## API Endpoints

### Movies

| Method | Endpoint             | Description                            |
| ------ | -------------------- | -------------------------------------- |
| GET    | `/api/v1/movies`     | Get all movies (with optional filters) |
| GET    | `/api/v1/movies/:id` | Get a single movie by ID               |
| POST   | `/api/v1/movies`     | Add a new movie                        |
| PATCH  | `/api/v1/movies/:id` | Update a movie                         |
| DELETE | `/api/v1/movies/:id` | Delete a movie                         |

#### Query Parameters for GET `/api/v1/movies`:

-   `search` - Search by title or director
-   `genre` - Filter by genre
-   `watched` - Filter by watched status (true/false)
-   `categoryId` - Filter by category ID
-   `sort` - Sort by rating (use "rating")

### Categories

| Method | Endpoint                        | Description                  |
| ------ | ------------------------------- | ---------------------------- |
| GET    | `/api/v1/categories`            | Get all categories           |
| GET    | `/api/v1/categories/:id`        | Get a single category by ID  |
| GET    | `/api/v1/categories/:id/movies` | Get all movies in a category |
| POST   | `/api/v1/categories`            | Create a new category        |
| PATCH  | `/api/v1/categories/:id`        | Update a category            |
| DELETE | `/api/v1/categories/:id`        | Delete a category            |

## Example Requests

### Add a New Movie

```bash
POST /api/v1/movies
Content-Type: application/json

{
  "title": "Inception",
  "genre": "Sci-Fi",
  "year": 2010,
  "director": "Christopher Nolan",
  "watched": false,
  "notes": "Mind-bending thriller",
  "categoryId": 2
}
```

### Mark Movie as Watched

```bash
PATCH /api/v1/movies/2
Content-Type: application/json

{
  "watched": true,
  "rating": 9.5
}
```

### Search Movies

```bash
GET /api/v1/movies?search=nolan&watched=true
```

### Create a Category

```bash
POST /api/v1/categories
Content-Type: application/json

{
  "name": "Must Watch",
  "description": "Top priority movies"
}
```

## Response Format

All responses follow this structure:

```json
{
	"success": true,
	"message": "Operation description",
	"data": {
		/* response data */
	},
	"count": 10 // Optional, for list responses
}
```

Error responses:

```json
{
	"success": false,
	"message": "Error description",
	"errors": [
		/* validation errors if any */
	]
}
```

## Validation Rules

### Movie

-   `title`: Required, 1-200 characters
-   `genre`: Required, 3-50 characters
-   `year`: Optional, 1888-2100
-   `director`: Optional, max 100 characters
-   `rating`: Optional, 0-10
-   `watched`: Optional, boolean
-   `notes`: Optional, max 500 characters
-   `categoryId`: Optional, positive integer

### Category

-   `name`: Required, 2-50 characters
-   `description`: Optional, max 200 characters

## Author

Mohammad

## License

ISC
