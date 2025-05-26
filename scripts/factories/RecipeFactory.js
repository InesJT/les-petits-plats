import { Recipe } from "../classes/recipe.js";

export class RecipeFactory {
  getRecipes(recipes) {
    return recipes.map(recipe => new Recipe(recipe));
  }

  getFilters(recipes) {
    const ingredients = new Set([]);
    const appliances = new Set([]);
    const ustensils = new Set([]);

    recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ing) => {
        ingredients.add(ing.ingredient.toLowerCase());
      });

      appliances.add(recipe.appliance.toLowerCase());

      recipe.ustensils.forEach((ustensil) => {
        ustensils.add(ustensil.toLowerCase());
      });
    });

    return {
      ingredients: ingredients,
      appliances: appliances,
      ustensils: ustensils,
    };
  }

  generalSearch(recipe, filterChoices) {
    const general = filterChoices.general?.toLowerCase() || "";
    return !general ||
        recipe.name.toLowerCase().includes(general) ||
        recipe.description.toLowerCase().includes(general) ||
        recipe.ingredients.some((ing) =>
          ing.ingredient.toLowerCase().includes(general)
        );
  }

  criteriaSearch(recipe, filterChoices) {
     const selectedIngredients = filterChoices.ingredients || [];
    const selectedAppliances = filterChoices.appliances || [];
    const selectedUstensils = filterChoices.ustensils || [];

    // Filtre des ingrédients: tous les ingrédients sélectionnés doivent être présents
    const matchesIngredients =
      selectedIngredients.length === 0 ||
      selectedIngredients.every((ingredientName) =>
        recipe.ingredients.some(     
          (ing) => ing.ingredient.toLowerCase() === ingredientName
        )
      );

    // Filtre des appareils : tous les appareils doivent être présents
    const matchesAppliances =
      selectedAppliances.length === 0 ||
      selectedAppliances.every(
        (applianceName) => recipe.appliance.toLowerCase() === applianceName
      );

    // Filtre des ustensils : tous les ustensils doivent être présents
    const matchesUstensils =
      selectedUstensils.length === 0 ||
      selectedUstensils.every((ustensilName) =>
        recipe.ustensils.some(
          (ustensil) => ustensil.toLowerCase() === ustensilName
        )
      );
    
    return {
      matchesIngredients,
      matchesAppliances,
      matchesUstensils,
    }
  }

  filterRecipes(recipes, filterChoices) {
    return recipes.filter((recipe) => {
      // Recherche générale : nom, déscription ou ingrédient
      const matchesGeneral = this.generalSearch(recipe, filterChoices);

      const {matchesIngredients, matchesAppliances, matchesUstensils} = this.criteriaSearch(recipe, filterChoices);      

      return (
        matchesGeneral &&
        matchesIngredients &&
        matchesAppliances &&
        matchesUstensils
      );
    });
  }
}
