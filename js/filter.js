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
    // Toujours partir de toutes les recettes
    const currentResults = recipes;

    // Récupérer les tags actifs en minuscules et trimés
    const activeOptionElements = document.querySelectorAll('.active-option .option');
    const activeOptionTexts = [];
    for (let i = 0; i < activeOptionElements.length; i++) {
        activeOptionTexts[activeOptionTexts.length] = activeOptionElements[i].textContent.toLowerCase().trim();
    }

    // Si aucun tag actif, retourner toutes les recettes
    if (activeOptionTexts.length === 0) {
        return currentResults;
    }

    const filteredRecipes = [];
    // Parcourir toutes les recettes
    for (let r = 0; r < currentResults.length; r++) {
        const recipe = currentResults[r];

        // Préparer les ingrédients en minuscules
        const recipeIngredients = [];
        for (let i = 0; i < recipe.ingredients.length; i++) {
            recipeIngredients[recipeIngredients.length] = recipe.ingredients[i].ingredient.toLowerCase();
        }

        // Préparer les ustensiles en minuscules
        const recipeUstensils = [];
        for (let u = 0; u < recipe.ustensils.length; u++) {
            recipeUstensils[recipeUstensils.length] = recipe.ustensils[u].toLowerCase();
        }

        // Appareil en minuscules
        const recipeAppliance = recipe.appliance.toLowerCase();

        // Vérifier que la recette correspond à tous les tags actifs
        let matchAllTags = true;
        for (let t = 0; t < activeOptionTexts.length; t++) {
            const tag = activeOptionTexts[t];
            let tagMatches = false;

            // Vérifier dans les ingrédients
            for (let i = 0; i < recipeIngredients.length; i++) {
                if (recipeIngredients[i] === tag) {
                    tagMatches = true;
                    break;
                }
            }

            // Vérifier dans les ustensiles si pas trouvé
            if (!tagMatches) {
                for (let u = 0; u < recipeUstensils.length; u++) {
                    if (recipeUstensils[u] === tag) {
                        tagMatches = true;
                        break;
                    }
                }
            }

            // Vérifier l’appareil si pas trouvé
            if (!tagMatches && recipeAppliance === tag) {
                tagMatches = true;
            }

            // Si un tag ne correspond pas, la recette est ignorée
            if (!tagMatches) {
                matchAllTags = false;
                break;
            }
        }

        // Ajouter la recette si tous les tags correspondent
        if (matchAllTags) {
            filteredRecipes[filteredRecipes.length] = recipe;
        }
    }

    return filteredRecipes;
}


