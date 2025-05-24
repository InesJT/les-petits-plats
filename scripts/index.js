import { recipesData } from "../data/recipes.js";
import { RecipeFactory } from "./factories/RecipeFactory.js";
import { Filter } from "./classes/filter.js";

class App {
  filterChoices = null;
  recipes = [];
  filteredRecipes = [];
  filterNames = ['ingredients', 'appliances', 'ustensils'];
  constructor() {
    const recipeFactory = new RecipeFactory();
    this.recipes = recipeFactory.getRecipes(recipesData);
    this.filteredRecipes = this.recipes;
    this.filterChoices = new Filter();
  }

  init() {
    // Afficher les recettes
    this.buildRecipes(this.recipes);

    // Construire les filtres
    this.buildFilters(this.recipes);

    // Ajouter le listner sur le click des boutons pour ouvrir les menus 
    this.initFilterButtonAction();

    // Ajouter le listner sur les champs de recherche des menus du filtre
    this.initGeneralSearchAction();

    // Ajouter le listner sur le click sur les éléments des menus des filtres (choix des ingredients, ...)
    this.initFilterSearchAction();

    // Afficher le nombre total des recettes après le filtre
    this.displayTotalRecipes(this.recipes);
  }

  buildRecipes(recipes) {
    const recipesContainer = document.querySelector(".recipes .row");
    recipesContainer.innerHTML = "";
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      const article = document.createElement("article");
      article.classList = "col-lg-4 col-sm-6 mb-5";
      const articleModel = articleTemplate(recipe);
      article.innerHTML = articleModel.getInnerHtml();
      const ingredientsContainer = article.querySelector(".ingredients-container");
      const ingredientsElements = this.buildIngredients(recipe.ingredients);
      for (let j = 0; j < ingredientsElements.length; j++) {
        ingredientsContainer.appendChild(ingredientsElements[j]);
      }
      recipesContainer.appendChild(article);
    }
    if (recipes.length === 0) {
      const errorMessageElement = document.createElement("p");
      const searchTextElement = document.querySelector("input");
      errorMessageElement.textContent = `Aucune recette ne contient "${searchTextElement.value}" vous pouvez chercher «
      tarte aux pommes », « poisson », etc.`;
      errorMessageElement.classList = "text-center";
      recipesContainer.appendChild(errorMessageElement);
    }
  }

  buildIngredients(ingredients) {
    const ingredientsElements = [];
    for (let i = 0; i < ingredients.length; i++) {
      const ingredient = ingredients[i];
      if (ingredient.unit === undefined) {
      ingredient.unit = "";
      }
      if (ingredient.quantity === undefined) {
      ingredient.quantity = "-";
      }

      const ingredientCard = document.createElement("div");
      ingredientCard.classList.add("col-6", "mb-4");
      const ingredientModel = ingredientCardTemplate(ingredient);
      ingredientCard.innerHTML = ingredientModel.getInnerHtml();
      ingredientsElements.push(ingredientCard);
    }
    return ingredientsElements;
  }

  buildFilters(data) {
    const recipeFactory = new RecipeFactory();
    const filtersData = recipeFactory.getFilters(data);
    for (let i = 0; i < this.filterNames.length; i++) {
      const filterName = this.filterNames[i];
      this.buildFilter(filtersData[filterName], filterName);
    }
    this.initFilterChoiceAction();
  }

  buildFilter(values, menuName) {
    const menuElement = document.querySelector(`.${menuName}-menu .dropdown-menu-items`);
    menuElement.innerHTML = "";
    
    values.forEach((value) => {
      const menuItem = document.createElement("a");
      menuItem.classList.add("dropdown-item");
      menuItem.setAttribute("href", "#filters");
      menuItem.dataset.filterName = menuName;
      menuItem.textContent = value;
      menuElement.appendChild(menuItem);
    });
    
  }

  initFilterChoiceAction() {
    const selectItems = document.querySelectorAll(".dropdown-item");
    selectItems.forEach((selectItem) => {
      selectItem.addEventListener("click", (event) => {
        const clickedValue = event.target.textContent.toLowerCase();
        const filterName = event.target.dataset.filterName;
        if (!this.filterChoices[filterName].includes(clickedValue)) {
          this.filterChoices[filterName].push(clickedValue);
        }
        const dropdownMenu = event.target.closest(".dropdown-menu");
        dropdownMenu.style.display = "none";
        this.whenFilterChanged();
      });
    });
  }

  // Afficher / cacher les menus des filtres
  initFilterButtonAction() {
    const filtersButtons = document.querySelectorAll(".filter-button");
    filtersButtons.forEach((filtersButton) => {
      filtersButton.addEventListener("click", (event) => {
        const dropdownMenu = event.target
          .closest(".dropdown")
          .querySelector(".dropdown-menu");
        const chevron = event.target
          .closest("button")
          .querySelector(".chevron");
        if (dropdownMenu.style.display === "none") {
          this.closeAllDropdowns();
          dropdownMenu.style.display = "block";
          chevron.classList.remove("fa-chevron-down");
          chevron.classList.add("fa-chevron-up");
        } else {
          dropdownMenu.style.display = "none";
          chevron.classList.remove("fa-chevron-up");
          chevron.classList.add("fa-chevron-down");
        }
      });
    });

    // Fermer le menu si on clique dehors
    window.addEventListener("click", (event) => {
      let menus = document.querySelectorAll(".dropdown-menu");
      menus.forEach((menu) => {
        if (!event.target.closest(".dropdown")) {
          menu.style.display = "none";
          this.closeDropdownsChevrons();
        }
        // Vider le champs de recherche des filtres 
        const inputfilterSearch = menu.querySelector('input.form-control')
        inputfilterSearch.value = null;
        this.buildFilters(this.filteredRecipes)
      });
    });
  }

  //fermer tous les dropdowns si on ouvre un seul
  closeAllDropdowns() {
    const allDropdownsMenu = document.querySelectorAll(".dropdown-menu");
    allDropdownsMenu.forEach((dropdown) => {
      dropdown.style.display = "none";
    });
    this.closeDropdownsChevrons();
  }

  closeDropdownsChevrons() {
    const chevrons = document.querySelectorAll(".chevron");
    chevrons.forEach((chevron) => {
      chevron.classList.remove("fa-chevron-up");
      chevron.classList.add("fa-chevron-down");
    });
  }

  // initialiser le addEventListener pour la recherche principale
  initGeneralSearchAction() {
    const generalSearchInput = document.querySelector("form.search-form input");
    generalSearchInput.addEventListener("input", (event) => {
      // Supprime les caractères non valides de la saisie
      const regex = /^[a-zA-Z0-9 \-'()]*$/;
      const value = event.target.value;

      if (!regex.test(value)) {
        // Supprimer le dernier caractère non valide
        event.target.value = value.slice(0, -1);
      }

      const searchText = event.target.value.toLowerCase();

      //ne rien faire si le texte est inférieur à 3 caractères
      if (searchText.length < 3) {
        this.filterChoices.general = "";
      } else {
        this.filterChoices.general = searchText;
      }
      this.whenFilterChanged();
    });
  }

  initFilterSearchAction() {
    const recipeFactory = new RecipeFactory();
    const filtersData = recipeFactory.getFilters(this.filteredRecipes);
    let filteredData = [];
    const filterInputs = document.querySelectorAll(
      ".filters input.form-control"
    );
    filterInputs.forEach((filterInput) => {
      filterInput.addEventListener("input", (event) => {
        const searchText = event.target.value.toLowerCase();

        if (event.target.classList.contains("ingredients-input")) {
          filteredData = filtersData.ingredients.filter((data) =>
            data.includes(searchText)
          );
          this.buildFilter(filteredData, "ingredients");
        }

        if (event.target.classList.contains("appliances-input")) {
          filteredData = filtersData.appliances.filter((data) =>
            data.includes(searchText)
          );
          this.buildFilter(filteredData, "appliances");
        }

        if (event.target.classList.contains("ustensils-input")) {
          filteredData = filtersData.ustensils.filter((data) =>
            data.includes(searchText)
          );
          this.buildFilter(filteredData, "ustensils");
        }

        this.initFilterChoiceAction();
      });
    });
  }

  // afficher les recettes filtrées
  executeFilter(recipes) {
    // Afficher les recettes filtrées
    this.buildRecipes(recipes);
  }

  // afficher les résultats des choix des 3 filtres
  buildFilterResults() {
    this.filterNames.forEach((filterName) => {
      const filterResultElement = document.querySelector(
        `.filter-results-${filterName}`
      );
      filterResultElement.innerHTML = "";
      this.filterChoices[filterName].forEach((value) => {
        const resultElement = document.createElement("button");
        resultElement.classList =
          "btn w-100 d-flex justify-content-between align-items-center mb-3";
        resultElement.innerHTML = `                  
                <span>${value}</span>
                <i class="fa-solid fa-xmark"></i>
                <i class="fa-solid fa-circle-xmark"></i>`;
        resultElement.dataset.filterName = filterName;
        filterResultElement.appendChild(resultElement);
      });
    });
    this.deleteFilterChoicesAction();
  }

  displayTotalRecipes(recipes) {
    const recipesCountElement = document.querySelector(".recipe-count");
    recipesCountElement.textContent = `${recipes.length} recettes`;
  }

  //fermer les éléments choisis
  deleteFilterChoicesAction() {
    const filterChoices = document.querySelectorAll('.filter-results button');
    filterChoices.forEach((choice) => {
      choice.addEventListener('click', () => {

        const filterName = choice.dataset.filterName;
        const choiceValue = choice.textContent.trim().toLowerCase();

        this.filterChoices[filterName] = this.filterChoices[filterName].filter(
          (item) => item !== choiceValue
        );

        this.whenFilterChanged();
      });
    });
  }

  whenFilterChanged() {
    // filtrer les recettes
    const recipeFactory = new RecipeFactory();
    this.filteredRecipes = recipeFactory.filterRecipes(
      this.recipes,
      this.filterChoices
    );

    // afficher les recettes filtrées
    this.buildRecipes(this.filteredRecipes);

    //reconstuire les filtres suivant les recettes filtées
    this.buildFilters(this.filteredRecipes);

    this.initFilterSearchAction();

    // afficher les résultats des choix des 3 filtres
    this.buildFilterResults();

    //afficher le nombre de résultat
    this.displayTotalRecipes(this.filteredRecipes);
  }
}

const app = new App();
app.init();
