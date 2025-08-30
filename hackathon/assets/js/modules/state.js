import { defaultRecipes } from './config.js';

let recipes = [];

export function getRecipes() {
    let storedRecipes = [];
    try {
        const recipesFromStorage = localStorage.getItem('recipes');
        if (recipesFromStorage) {
            storedRecipes = JSON.parse(recipesFromStorage);
        }
    } catch (error) {
        console.error('Error parsing recipes from localStorage:', error);
        localStorage.removeItem('recipes'); // Clear corrupted data
    }

    if (!storedRecipes || storedRecipes.length === 0) {
        storedRecipes = defaultRecipes;
        saveRecipes(storedRecipes);
    }
    recipes = storedRecipes;
    return recipes;
}

export function saveRecipes(recipesToSave) {
    localStorage.setItem('recipes', JSON.stringify(recipesToSave || recipes));
}

export function getRecipeState() {
    return recipes;
}

export function setRecipes(newRecipes) {
    recipes = newRecipes;
}
