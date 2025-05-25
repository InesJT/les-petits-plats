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

  filterRecipes(recipes, filterChoices) {
    const general = filterChoices.general?.toLowerCase() || "";
    const selectedIngredients = filterChoices.ingredients || [];
    const selectedAppliances = filterChoices.appliances || [];
    const selectedUstensils = filterChoices.ustensils || [];

    return recipes.filter((recipe) => {
      // General search: name, description, or any ingredient
      const matchesGeneral =
        !general ||
        recipe.name.toLowerCase().includes(general) ||
        recipe.description.toLowerCase().includes(general) ||
        recipe.ingredients.some((ing) =>
          ing.ingredient.toLowerCase().includes(general)
        );

      // Ingredients filter: all selected ingredients must be present
      const matchesIngredients =
        selectedIngredients.length === 0 ||
        selectedIngredients.every((ingredientName) =>
          recipe.ingredients.some(     
            (ing) => ing.ingredient.toLowerCase() === ingredientName
          )
        );

      // Appliances filter: all selected appliances must match
      const matchesAppliances =
        selectedAppliances.length === 0 ||
        selectedAppliances.every(
          (applianceName) => recipe.appliance.toLowerCase() === applianceName
        );

      // Ustensils filter: all selected ustensils must be present
      const matchesUstensils =
        selectedUstensils.length === 0 ||
        selectedUstensils.every((ustensilName) =>
          recipe.ustensils.some(
            (ustensil) => ustensil.toLowerCase() === ustensilName
          )
        );

      return (
        matchesGeneral &&
        matchesIngredients &&
        matchesAppliances &&
        matchesUstensils
      );
    });
  }
}
