import { getRecipes, saveRecipes, getRecipeState, setRecipes } from './modules/state.js';
import { renderRecipes, updateTotalCalories, openModal, closeModal } from './modules/ui.js';

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const recipeList = document.getElementById('recipe-list');
    const addRecipeBtn = document.getElementById('add-recipe-btn');
    const recipeModal = document.getElementById('recipe-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const recipeForm = document.getElementById('recipe-form');
    const recipeIdInput = document.getElementById('recipe-id');
    const recipeNameInput = document.getElementById('recipe-name');
    const recipeIngredientsInput = document.getElementById('recipe-ingredients');
    const recipeCaloriesInput = document.getElementById('recipe-calories');
    const recipeImageInput = document.getElementById('recipe-image');
    const recipeMustTryInput = document.getElementById('recipe-must-try');
    const searchBar = document.getElementById('search-bar');
    const ingredientFilter = document.getElementById('ingredient-filter');
    const ingredientSuggestions = document.getElementById('ingredient-suggestions');
    const calorieFilter = document.getElementById('calorie-filter');
    const calorieValue = document.getElementById('calorie-value');
    const filterBtn = document.getElementById('filter-btn');
    const filterModal = document.getElementById('filter-modal');
    const closeFilterModalBtn = document.querySelector('.filter-close-btn');
    const filterForm = document.getElementById('filter-form');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    const themeSwitcherBtn = document.getElementById('theme-switcher-btn');
    const totalCaloriesSpan = document.getElementById('total-calories');
    const sortBy = document.getElementById('sort-by');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    const container = document.querySelector('.container');

    let allIngredients = [];

    // Initial Load
    function initialize() {
        setRecipes(getRecipes());
        getUniqueIngredients();
        applyFilters();
        updateTotalCalories(getRecipeState(), totalCaloriesSpan);
    }
    
    function getUniqueIngredients() {
        const ingredients = new Set();
        getRecipeState().forEach(recipe => {
            recipe.ingredients.forEach(ing => ingredients.add(ing.trim()));
        });
        allIngredients = [...ingredients];
    }

    // Event Listeners
    addRecipeBtn.addEventListener('click', () => {
        recipeIdInput.value = '';
        recipeForm.reset();
        openModal(recipeModal);
    });

    filterBtn.addEventListener('click', () => openModal(filterModal));
    closeModalBtn.addEventListener('click', () => closeModal(recipeModal));
    closeFilterModalBtn.addEventListener('click', () => closeModal(filterModal));

    window.addEventListener('click', (e) => {
        if (e.target === recipeModal) closeModal(recipeModal);
        if (e.target === filterModal) closeModal(filterModal);
    });

    recipeForm.addEventListener('submit', handleFormSubmit);
    recipeList.addEventListener('click', handleRecipeCardClick);
    searchBar.addEventListener('input', applyFilters);
    sortBy.addEventListener('change', applyFilters);

    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        applyFilters();
        closeModal(filterModal);
    });

    resetFiltersBtn.addEventListener('click', () => {
        searchBar.value = '';
        filterForm.reset();
        ingredientFilter.value = '';
        calorieFilter.value = 1000;
        calorieValue.textContent = calorieFilter.value;
        applyFilters();
        closeModal(filterModal);
    });

    themeSwitcherBtn.addEventListener('click', toggleTheme);
    sidebarToggleBtn.addEventListener('click', toggleSidebar);
    
    calorieFilter.addEventListener('input', () => {
        calorieValue.textContent = calorieFilter.value;
        applyFilters();
    });

    ingredientFilter.addEventListener('input', () => {
        const value = ingredientFilter.value.toLowerCase();
        ingredientSuggestions.innerHTML = '';
        if (!value) return;

        const suggestions = allIngredients.filter(ing => ing.toLowerCase().includes(value));
        suggestions.forEach(suggestion => {
            const div = document.createElement('div');
            div.textContent = suggestion;
            div.addEventListener('click', () => {
                ingredientFilter.value = suggestion;
                ingredientSuggestions.innerHTML = '';
            });
            ingredientSuggestions.appendChild(div);
        });
    });

    document.addEventListener('click', (e) => {
        if (e.target !== ingredientFilter) {
            ingredientSuggestions.innerHTML = '';
        }
    });

    // Functions
    function handleFormSubmit(e) {
        e.preventDefault();
        const recipeData = {
            id: recipeIdInput.value || Date.now().toString(),
            name: recipeNameInput.value,
            ingredients: recipeIngredientsInput.value.split(',').map(item => item.trim()),
            calories: parseInt(recipeCaloriesInput.value),
            image: recipeImageInput.value,
            mustTry: recipeMustTryInput.checked,
            favorite: false
        };

        let currentRecipes = getRecipeState();
        if (recipeIdInput.value) {
            const index = currentRecipes.findIndex(r => r.id === recipeIdInput.value);
            if (index !== -1) {
                recipeData.favorite = currentRecipes[index].favorite; // Preserve favorite status
                recipeData.mustTry = recipeMustTryInput.checked; // Preserve must-try status
                currentRecipes[index] = recipeData;
            }
        } else {
            currentRecipes.push(recipeData);
        }
        setRecipes(currentRecipes);
        saveRecipes();
        getUniqueIngredients(); // Update ingredients list
        applyFilters();
        updateTotalCalories(getRecipeState(), totalCaloriesSpan);
        closeModal(recipeModal);
    }

    function handleRecipeCardClick(e) {
        const card = e.target.closest('.recipe-card');
        if (!card) return;

        const recipeId = card.dataset.id;
        let currentRecipes = getRecipeState();
        const recipeIndex = currentRecipes.findIndex(r => r.id === recipeId);
        if (recipeIndex === -1) return;

        if (e.target.closest('.delete-btn')) {
            currentRecipes.splice(recipeIndex, 1);
            getUniqueIngredients(); // Update ingredients list
        } else if (e.target.closest('.edit-btn')) {
            const recipe = currentRecipes[recipeIndex];
            recipeIdInput.value = recipe.id;
            recipeNameInput.value = recipe.name;
            recipeIngredientsInput.value = recipe.ingredients.join(', ');
            recipeCaloriesInput.value = recipe.calories;
            recipeImageInput.value = recipe.image;
            recipeMustTryInput.checked = recipe.mustTry || false;
            openModal(recipeModal);
            return; // Don't re-render yet
        } else if (e.target.closest('.favorite-btn')) {
            currentRecipes[recipeIndex].favorite = !currentRecipes[recipeIndex].favorite;
        }

        setRecipes(currentRecipes);
        saveRecipes();
        applyFilters();
        updateTotalCalories(getRecipeState(), totalCaloriesSpan);
    }

    function applyFilters() {
        const searchTerm = searchBar.value.toLowerCase();
        const selectedIngredient = ingredientFilter.value.toLowerCase();
        const maxCalories = parseInt(calorieFilter.value);

        let filteredRecipes = getRecipeState().filter(recipe => {
            const nameMatch = recipe.name.toLowerCase().includes(searchTerm);
            const ingredientMatch = !selectedIngredient || recipe.ingredients.some(ing => ing.toLowerCase().includes(selectedIngredient));
            const calorieMatch = recipe.calories <= maxCalories;
            return nameMatch && ingredientMatch && calorieMatch;
        });

        const sortedRecipes = applySorting(filteredRecipes);
        renderRecipes(sortedRecipes, recipeList);
    }

    function applySorting(recipesToSort) {
        const sortValue = sortBy.value;
        return [...recipesToSort].sort((a, b) => {
            switch (sortValue) {
                case 'name-asc': return a.name.localeCompare(b.name);
                case 'name-desc': return b.name.localeCompare(a.name);
                case 'calories-asc': return a.calories - b.calories;
                case 'calories-desc': return b.calories - a.calories;
                default: return 0;
            }
        });
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.removeItem('theme');
            themeSwitcherBtn.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeSwitcherBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    function toggleSidebar() {
        sidebar.classList.toggle('collapsed');
        container.classList.toggle('full-width');
    }

    // Load Theme on start
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeSwitcherBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Initial call
    initialize();
});