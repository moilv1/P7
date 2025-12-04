let previousResults = [];

function filterRecipes(searchValue) {
    const container = document.getElementById('Recette');
    container.innerHTML = '';
    let filteredRecipes = [];
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

        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            const recipeTemplate = RecipeTemplate(recipe);
            const card = recipeTemplate.getRecipeCardDOM();
            container.appendChild(card);
        }

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

