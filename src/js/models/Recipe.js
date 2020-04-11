import axios from "axios";
import { key, proxy } from "../config";
export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const data = {
        recipe: {
          publisher: "Real Simple",
          f2f_url: "http://food2fork.com/view/37859",
          ingredients: [
            "1 1/2 cups shredded rotisserie chicken",
            "1 1/2 cups grated Gruyre",
            "1 cup frozen peas",
            "2 sheets (one 17.25-ounce package) frozen puff pastry, thawed",
            "1 large egg, beaten",
            "1/4 cup Dijon mustard\n",
          ],
          source_url:
            "http://www.realsimple.com/food-recipes/browse-all-recipes/chicken-and-gruyere-turnovers-00000000052482/index.html",
          recipe_id: "37859",
          image_url:
            "http://static.food2fork.com/chickenturnover2_300e6667e66.jpg",
          social_rank: 99.84842829206659,
          publisher_url: "http://realsimple.com",
          title: "Chicken and Gruyre Turnovers",
        },
      };
      this.title = data.recipe.title;
      this.author = data.recipe.publisher;
      this.img = data.recipe.image_url;
      this.url = data.recipe.source_url;
      this.ingredients = data.recipe.ingredients;
      //console.log(this.ingredients);
    } catch (error) {
      console.log(error);
      alert("Something went wrong :(");
    }
  }

  calcTime() {
    //Assuming 15 mins for each 3 ingredients
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }
  calcServings() {
    this.servings = 4;
  }
  parseIngredients() {
    const unitsLong = [
      "tablespoons",
      "tablespoon",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pounds",
    ];
    const unitsShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound",
    ];
    const units = [...unitsShort, "kg", "g"];
    const newIngredients = this.ingredients.map((el) => {
      // 1. Uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });
      // 2. Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

      // 3. Parse the ingredients into count, unit and ingredient
      const arrIng = ingredient.split(" ");
      const unitIndex = arrIng.findIndex((el2) => units.includes(el2));
      let objIng;

      if (unitIndex > -1) {
        // Unit exists
        // For ex 4 1/2 cup => arrCount = [4,1/2] => eval(4 + 1/2) = 4.5
        // For ex 4 cup => arrCount = [4]
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace("-", "+"));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join("+"));
        }
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(" "),
        };
      } else if (parseInt(arrIng[0], 10)) {
        // There is no unit but first element is a number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: "",
          ingredient: arrIng.slice(1).join(" "), //here 1 shows te position of the starting argument
        };
      } else if (unitIndex === -1) {
        // Neither unit nor number present at the front
        objIng = {
          count: 1,
          unit: "",
          ingredient, // instead of writing ingredient:ingredient (ES6)
        };
      }

      return objIng;
    });
    this.ingredients = newIngredients;
  }
  updateServings(type) {
    // Servings
    const newServings = type === "dec" ? this.servings - 1 : this.servings + 1;
    // Ingredients
    this.ingredients.forEach((ing) => {
      ing.count *= newServings / this.servings;
    });

    this.servings = newServings;
  }
}
