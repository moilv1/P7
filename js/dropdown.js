const dropdowns = document.querySelectorAll(".dropdown");

dropdowns.forEach(dropdown => {
    const dropdownBtn = dropdown.querySelector(".dropdown-btn");
    const dropdownOption = dropdown.querySelector(".dropdown-options");
    const angleDown = dropdownBtn.querySelector(".fa-angle-down");

    dropdownBtn.addEventListener('click', () => {
        if (dropdownBtn.parentElement.classList.contains("active")) {
            dropdownOption.style.display = "none";
            dropdownBtn.parentElement.classList.remove("active");
            angleDown.classList.remove("fa-angle-up");
            angleDown.classList.add("fa-angle-down");

        }
        else {
            dropdownBtn.parentElement.classList.add("active")
            dropdownOption.style.display = "flex";
            angleDown.classList.remove("fa-angle-down");
            angleDown.classList.add("fa-angle-up");
        }
    })
})

const allIngredients = Array.from(new Set([].concat(...recipes.map(recipe => recipe.ingredients.map(ingredient => ingredient.ingredient)))));

const allAppliances = Array.from(new Set(recipes.map(recipe => recipe.appliance)));

const allUstensils = Array.from(new Set([].concat(...recipes.map(recipe => recipe.ustensils))));


const ingredientDropdown = document.getElementById('IngrédientsDropDown');
allIngredients.forEach(ingredient => {
    const dropdownOption = ingredientDropdown.querySelector(".dropdown-options")
    const optionLi = document.createElement("li");
    optionLi.className = 'option';
    optionLi.setAttribute('data-dropdown', 'IngrédientsDropDown');
    optionLi.textContent = ingredient;
    dropdownOption.appendChild(optionLi);
    ingredientDropdown.appendChild(dropdownOption);
});

const applianceDropdown = document.getElementById('AppareilsDropDown');
allAppliances.forEach(appliance => {
    const dropdownOption = applianceDropdown.querySelector(".dropdown-options")
    const optionLi = document.createElement("li");
    optionLi.className = 'option';
    optionLi.setAttribute('data-dropdown', 'AppareilsDropDown');
    optionLi.textContent = appliance;
    dropdownOption.appendChild(optionLi);
    applianceDropdown.appendChild(dropdownOption);
});

const ustensilDropdown = document.getElementById('UstensilesDropDown');
allUstensils.forEach(ustensil => {
    const dropdownOption = ustensilDropdown.querySelector(".dropdown-options")
    const optionLi = document.createElement("li");
    optionLi.className = 'option';
    optionLi.setAttribute('data-dropdown', 'UstensilesDropDown');
    optionLi.textContent = ustensil;
    dropdownOption.appendChild(optionLi);
    ustensilDropdown.appendChild(dropdownOption);
});

// Filtrage des dropdown 

function Search(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const searchInput = dropdown.querySelector('input[type="search"]');
    const dropdownOptions = dropdown.querySelectorAll('.option');

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.trim().toLowerCase();

        dropdownOptions.forEach(option => {
            const optionText = option.textContent.toLowerCase();
            const isMatch = optionText.includes(searchTerm);
            option.style.display = isMatch ? 'block' : 'none';
        });
    });
}
Search('IngrédientsDropDown');
Search('AppareilsDropDown');
Search('UstensilesDropDown');


function updateRecipeList() {
    const activeOptions = document.querySelectorAll('.active .option');
    const filteredRecipes = filterRecipesByTags(activeOptions);

    // Met à jour le nombre de recettes dans le h1 avec la classe nbr-recettes
    const nbrRecettesElement = document.querySelector('.nbr-recettes');
    nbrRecettesElement.textContent = filteredRecipes.length === recipes.length
        ? '1500 recettes'
        : `${filteredRecipes.length} recettes`;

    // Supprime les recettes 
    const container = document.getElementById('Recette');
    container.innerHTML = '';

    // Affiche les recettes filtrées
    filteredRecipes.forEach(recipe => {
        const recipeTemplate = RecipeTemplate(recipe);
        const card = recipeTemplate.getRecipeCardDOM();
        container.appendChild(card);
    });
}

function DropdownOptionActive() {
    const activeOptionContainer = document.querySelector('.active-option');

    document.addEventListener('click', (e) => {
        const option = e.target.closest('.option');
        if (!option) return;

        // Ignore si on clique sur un tag déjà actif
        if (option.closest('.active-option')) return;

        const alreadySelected = option.getAttribute('data-selected') === 'true';

        if (alreadySelected) return; // déjà actif, on ignore

        // Marquer l'option comme sélectionnée
        option.setAttribute('data-selected', 'true');

        // Créer un clone pour le tag actif
        const clone = option.cloneNode(true);
        clone.classList.add('active');

        // Ajouter le bouton de fermeture
        const optionClose = document.createElement('i');
        optionClose.className = 'fa-solid fa-x';
        optionClose.style.cursor = 'pointer';
        optionClose.addEventListener('click', (ev) => {
            ev.stopPropagation();
            clone.remove();
            option.removeAttribute('data-selected');
            updateRecipeList();
        });

        clone.appendChild(optionClose);
        activeOptionContainer.appendChild(clone);

        // Mettre à jour les recettes après ajout du tag
        updateRecipeList();
    });
}

DropdownOptionActive();

function updateDropdownOptions(filteredRecipes) {
    // Mettre à jour les options de chaque dropdown
    updateDropdownOptionsForCategory('IngrédientsDropDown', filteredRecipes, 'ingredients');
    updateDropdownOptionsForCategory('AppareilsDropDown', filteredRecipes, 'appliance');
    updateDropdownOptionsForCategory('UstensilesDropDown', filteredRecipes, 'ustensils');
}

function updateDropdownOptionsForCategory(dropdownId, filteredRecipes, category) {
    const dropdown = document.getElementById(dropdownId);
    const dropdownOptions = dropdown.querySelectorAll('.option');

    // Extract unique values for the given category from the filtered recipes
    const uniqueValues = Array.from(new Set([].concat(
        ...filteredRecipes.map(recipe => {
            const categoryItems = recipe[category];

            // Check if categoryItems is an array, and if not, convert it to an array
            const itemsArray = Array.isArray(categoryItems) ? categoryItems : [categoryItems];

            return itemsArray.map(item => {
                // For ingredients, we need to consider a nested structure
                if (category === 'ingredients') {
                    return typeof item.ingredient === 'string'
                        ? item.ingredient.toLowerCase()
                        : String(item.ingredient).toLowerCase();
                } else {
                    // Check if item is a string, and if not, convert it to a string
                    return typeof item === 'string' ? item.toLowerCase() : String(item).toLowerCase();
                }
            });
        })
    )));

    // Update dropdown options
    dropdownOptions.forEach(option => {
        const optionText = option.textContent.toLowerCase();
        const isMatch = uniqueValues.includes(optionText);
        option.style.display = isMatch ? 'block' : 'none';
    });
}