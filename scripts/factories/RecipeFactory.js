import { Recipe } from "../classes/recipe.js";

export class RecipeFactory {
  getRecipes(recipes) {
    const result = [];
    for (let i = 0; i < recipes.length; i++) {
      result.push(new Recipe(recipes[i]));
    }
    return result;
  }

  getFilters(recipes) {
    const ingredients = new Set();
    const appliances = new Set();
    const ustensils = new Set();

    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];

      for (let j = 0; j < recipe.ingredients.length; j++) {
        ingredients.add(recipe.ingredients[j].ingredient.toLowerCase());
      }

      appliances.add(recipe.appliance.toLowerCase());

      for (let k = 0; k < recipe.ustensils.length; k++) {
        ustensils.add(recipe.ustensils[k].toLowerCase());
      }
    }

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

    const filteredRecipes = [];
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];

      // General search: name, description, or any ingredient
      let matchesGeneral = !general;
      if (!matchesGeneral) {
        if (recipe.name.toLowerCase().includes(general) ||
          recipe.description.toLowerCase().includes(general)) {
          matchesGeneral = true;
        } else {
          for (let j = 0; j < recipe.ingredients.length; j++) {
            if (recipe.ingredients[j].ingredient.toLowerCase().includes(general)) {
              matchesGeneral = true;
              break;
            }
          }
        }
      }

      // Ingredients filter: all selected ingredients must be present
      let matchesIngredients = selectedIngredients.length === 0;
      if (!matchesIngredients) {
        matchesIngredients = true;
        for (let idx = 0; idx < selectedIngredients.length; idx++) {
          const ingredientName = selectedIngredients[idx];
          let found = false;
          for (let j = 0; j < recipe.ingredients.length; j++) {
            if (recipe.ingredients[j].ingredient.toLowerCase() === ingredientName) {
              found = true;
              break;
            }
          }
          if (!found) {
            matchesIngredients = false;
            break;
          }
        }
      }

      // Appliances filter: all selected appliances must match
      let matchesAppliances = selectedAppliances.length === 0;
      if (!matchesAppliances) {
        matchesAppliances = true;
        for (let idx = 0; idx < selectedAppliances.length; idx++) {
          const applianceName = selectedAppliances[idx];
          if (recipe.appliance.toLowerCase() !== applianceName) {
            matchesAppliances = false;
            break;
          }
        }
      }

      // Ustensils filter: all selected ustensils must be present
      let matchesUstensils = selectedUstensils.length === 0;
      if (!matchesUstensils) {
        matchesUstensils = true;
        for (let idx = 0; idx < selectedUstensils.length; idx++) {
          const ustensilName = selectedUstensils[idx];
          let found = false;
          for (let j = 0; j < recipe.ustensils.length; j++) {
            if (recipe.ustensils[j].toLowerCase() === ustensilName) {
              found = true;
              break;
            }
          }
          if (!found) {
            matchesUstensils = false;
            break;
          }
        }
      }

      if (
        matchesGeneral &&
        matchesIngredients &&
        matchesAppliances &&
        matchesUstensils
      ) {
        filteredRecipes.push(recipe);
      }
    }
    return filteredRecipes;
  }
}
