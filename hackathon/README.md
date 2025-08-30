# Recipe App

A simple and interactive recipe management application built with HTML, CSS, and vanilla JavaScript. It allows users to create, read, update, and delete recipes, as well as mark their favorite ones. All data is persisted in the browser's `localStorage`.

## Features

-   **CRUD Operations**: Add, view, edit, and delete recipes.
-   **Favorites**: Mark recipes as favorites, which highlights them visually.
-   **Calorie Counter**: Displays the total calorie count of all favorite recipes.
-   **Search**: Filter recipes by name or ingredients in real-time.
-   **Local Storage**: All recipes and their statuses are saved in `localStorage`, so your data persists across browser sessions.
-   **Responsive Design**: A clean and simple UI that works on different screen sizes.

## Project Structure

```
/
|-- index.html              # Main HTML file
|-- assets/
|   |-- css/
|   |   |-- main.css        # All styles for the application
|   |-- js/
|   |   |-- app.js          # Core JavaScript logic
|-- README.md               # This file
```

## How It Works

### Data Management

-   Recipes are stored as an array of objects in `localStorage` under the key `recipes`.
-   Each recipe object has the following structure:
    ```json
    {
      "id": "string",
      "name": "string",
      "ingredients": ["string"],
      "calories": "number",
      "image": "string",
      "favorite": "boolean"
    }
    ```
-   On page load, the app checks for existing recipes in `localStorage`. If none are found, it populates the storage with five default recipes.

### Core Logic (`app.js`)

-   **`DOMContentLoaded`**: The script runs after the entire page is loaded.
-   **`getRecipes()`**: Retrieves recipes from `localStorage`. If `localStorage` is empty, it loads a default set of recipes.
-   **`saveRecipes()`**: Saves the current state of the `recipes` array to `localStorage`.
-   **`renderRecipes()`**: Clears the current recipe list and re-renders it based on the `recipes` array. It creates a "card" for each recipe and attaches event listeners for edit, delete, and favorite actions.
-   **`updateTotalCalories()`**: Calculates the sum of calories for all recipes where `favorite` is `true` and updates the display.
-   **Event Listeners**:
    -   The "Add Recipe" button opens a modal with a form.
    -   The form submission handles both creating a new recipe and updating an existing one.
    -   Buttons on each recipe card (edit, delete, favorite) modify the `recipes` array, save the changes, and re-render the UI.
    -   The search bar filters recipes in real-time by listening to the `input` event.

### Styling (`main.css`)

-   The app uses a simple, modern design with a card-based layout for recipes.
-   Favorite recipes are visually distinguished with a different background and a colored border.
-   A modal is used for adding and editing recipes to provide a clean user experience.
