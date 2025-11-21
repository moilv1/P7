let previousResults = [];

function filterRecipes(searchValue) {
    const filteredRecipes = [];
    const container = document.getElementById('Recette');
    container.innerHTML = '';
    previousResults = filteredRecipes;

    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        const recipeName = recipe.name.toLowerCase();

        // Boucle pour vérifier le noms des recettes 
        if (recipeName.includes(searchValue)) {
            filteredRecipes.push(recipe);

            const recipeTemplate = RecipeTemplate(recipe);
            const card = recipeTemplate.getRecipeCardDOM();
            container.appendChild(card);
            continue;
        }

        // Boucle pour vérifier les ingredients 
        for (let j = 0; j < recipe.ingredients.length; j++) {
            const ingredient = recipe.ingredients[j].ingredient.toLowerCase();
            if (ingredient.includes(searchValue)) {
                filteredRecipes.push(recipe);

                const recipeTemplate = RecipeTemplate(recipe);
                const card = recipeTemplate.getRecipeCardDOM();
                container.appendChild(card);
                break;
            }
        }
    }
    

    // Mettre à jour le nombre de recettes affichées
    const nbrRecettesElement = document.querySelector('.nbr-recettes');
    const divRecette = document.getElementById('Recette')
    
    if (!filteredRecipes.length) {
        divRecette.innerHTML = `<p class="emptyRecipes">Aucune recette ne contient '${searchValue}', vous pouvez chercher "tarte aux pommes", "tartiflette" par exemple.</p>`;
    } 
    nbrRecettesElement.textContent = filteredRecipes.length === recipes.length
        ? '1500 recettes'
        : `${filteredRecipes.length} recettes`;
    // Mettre à jour les options des dropdowns
    updateDropdownOptions(filteredRecipes);
}
const searchElements = document.querySelectorAll('#search-bar, #search-btn-bar');
const searchInput = document.getElementById('search-bar');

// Ajout des events listeners 
searchInput.addEventListener('input', () => {
    const value = searchInput.value.toLowerCase();

    // ➤ CAS 1 : Champ complètement vide → TOUT RÉINITIALISER
    if (value.length < 3) {
        const container = document.getElementById('Recette');
        container.innerHTML = '';

        recipes.forEach(recipe => {
            const recipeTemplate = RecipeTemplate(recipe);
            const card = recipeTemplate.getRecipeCardDOM();
            container.appendChild(card);
        });

        // Remise du compteur
        const nbrRecettesElement = document.querySelector('.nbr-recettes');
        nbrRecettesElement.textContent = '1500 recettes';

        // Mise à jour des dropdowns
        updateDropdownOptions(recipes);

        // On reset le previousResults
        previousResults = recipes;

        return;
    }


    // ➤ CAS 3 : 3 lettres ou plus → filtrage normal
    filterRecipes(value);
});

function filterRecipesByTags() {
    // toujours partir de toutes les recettes
    const currentResults = recipes;

    const activeOptionTexts = Array.from(document.querySelectorAll('.active-option .option'))
        .map(option => option.textContent.toLowerCase().trim());

    // Si aucun tag actif, retourne toutes les recettes
    if (activeOptionTexts.length === 0) {
        return currentResults;
    }

    const filteredRecipes = currentResults.filter(recipe => {
        const recipeIngredients = recipe.ingredients.map(i => i.ingredient.toLowerCase());
        const recipeUstensils = recipe.ustensils.map(u => u.toLowerCase());
        const recipeAppliance = recipe.appliance.toLowerCase();

        // La recette doit correspondre à tous les tags actifs
        return activeOptionTexts.every(tag =>
            recipeIngredients.includes(tag) ||
            recipeUstensils.includes(tag) ||
            recipeAppliance === tag
        );
    });

    return filteredRecipes;
}

