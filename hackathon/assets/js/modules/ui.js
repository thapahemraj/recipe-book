export function renderRecipes(recipesToRender, recipeList) {
    recipeList.innerHTML = '';
    recipesToRender.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        if (recipe.favorite) {
            recipeCard.classList.add('favorite');
        }
        if (recipe.mustTry) {
            recipeCard.classList.add('must-try');
        }
        recipeCard.dataset.id = recipe.id;

        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
            <div class="card-content">
                <h3>${recipe.name} ${recipe.mustTry ? '<i class="fas fa-star must-try-icon"></i>' : ''}</h3>
                <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
                <p><strong>Calories:</strong> ${recipe.calories}</p>
                <div class="card-buttons">
                    <button class="icon-btn favorite-btn" title="Favorite"><i class="fas fa-heart"></i></button>
                    <button class="icon-btn edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="icon-btn delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
        recipeList.appendChild(recipeCard);
    });
}

export function updateTotalCalories(recipes, totalCaloriesSpan) {
    const total = recipes
        .filter(r => r.favorite)
        .reduce((sum, r) => sum + r.calories, 0);
    totalCaloriesSpan.textContent = total;
}

export function openModal(modal) {
    modal.style.display = 'block';
}

export function closeModal(modal) {
    modal.style.display = 'none';
}
