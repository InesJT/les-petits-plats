import { Ingredient } from "./ingredient.js";

export class Recipe {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.image = data.image;
    this.description = data.description;
    this.time = data.time;
    this.servings = data.servings;
    this.appliance = data.appliance;
    this.ustensils = data.ustensils;
    this.ingredients = data.ingredients.map(d => new Ingredient(d) );
  }
}