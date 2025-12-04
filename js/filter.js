let previousResults = [];

function filterRecipes(searchValue) {
    const container = document.getElementById('Recette');
    container.innerHTML = '';

    // Filtrer les recettes par nom ou par ingrédients
    const filteredRecipes = recipes.filter(recipe => {
        const nameMatch = recipe.name.toLowerCase().includes(searchValue);
        const ingredientMatch = recipe.ingredients.some(ingredient =>
            ingredient.ingredient.toLowerCase().includes(searchValue)
        );
        return nameMatch || ingredientMatch;
    });

    // Afficher les recettes filtrées
    filteredRecipes.forEach(recipe => {
        const recipeTemplate = RecipeTemplate(recipe);
        const card = recipeTemplate.getRecipeCardDOM();
        container.appendChild(card);
    });

    previousResults = filteredRecipes;

    // Mettre à jour le compteur
    const nbrRecettesElement = document.querySelector('.nbr-recettes');
    if (filteredRecipes.length === 0) {
        container.innerHTML = `<p class="emptyRecipes">Aucune recette ne contient '${searchValue}', vous pouvez chercher "tarte aux pommes", "tartiflette" par exemple.</p>`;
    }
    nbrRecettesElement.textContent = filteredRecipes.length === recipes.length
        ? '1500 recettes'
        : `${filteredRecipes.length} recettes`;

    // Mettre à jour les dropdowns
    updateDropdownOptions(filteredRecipes);
}

// Gestion de l'input recherche
const searchInput = document.getElementById('search-bar');
searchInput.addEventListener('input', () => {
    const value = searchInput.value.toLowerCase();

    if (value.length < 3) {
        // Réinitialiser l’affichage si moins de 3 caractères
        const container = document.getElementById('Recette');
        container.innerHTML = '';
        recipes.forEach(recipe => {
            const recipeTemplate = RecipeTemplate(recipe);
            const card = recipeTemplate.getRecipeCardDOM();
            container.appendChild(card);
        });

        document.querySelector('.nbr-recettes').textContent = '1500 recettes';
        updateDropdownOptions(recipes);
        previousResults = recipes;
        return;
    }

    filterRecipes(value);
});

function filterRecipesByTags() {

    let currentResults = previousResults;

    // Sélectionne uniquement les options actives dans la div .active-option
    const activeOptionTexts = Array.from(document.querySelectorAll('.active-option .option'))
        .map(option => {
            const text = option.textContent.toLowerCase();
            return text;
        });

    const filteredRecipes = currentResults.filter(recipe => {
        const recipeIngredients = recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase());
        const recipeUstensils = recipe.ustensils.map(ustensil => ustensil.toLowerCase());

        const matches = activeOptionTexts.every(optionText =>
            recipeIngredients.includes(optionText) ||
            recipeUstensils.includes(optionText) ||
            recipe.appliance.toLowerCase() === optionText
        );
        return matches;
    });
    return filteredRecipes;
}

