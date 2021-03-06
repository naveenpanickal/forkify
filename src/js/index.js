import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Like from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";
import Likes from "./models/Likes";
/**Global state of the app
 *- search object
 *- current recipe
 *- shopping list item
 *- liked item
 */
const state = {};
//window.state = state;

/**SEARCH CONTROLLER */
const controlSearch = async () => {
  //1. Get query from view
  const query = searchView.getInput();
  // const query = "pizza";
  if (query) {
    //2. New search object and add to state
    state.search = new Search(query);
    //3. Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    try {
      //4  Search for recipes
      await state.search.getResults();
      //5. Render results to UI
      clearLoader();
      console.log("state.search.result", state.search.result);
      searchView.renderResults(state.search.result);
    } catch (error) {
      alert("Something went wrong with the search..");
      console.log(error);
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});
//Testing
// window.addEventListener("load",e=>{
//     e.preventDefault();
//     controlSearch();
// });

elements.searchResPages.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/**RECIPE CONTROLLER */
const controlRecipe = async () => {
  // Get id from url
  const id = window.location.hash.replace("#", "");
  //console.log(id);
  if (id) {
    //Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    //Highlight selected search item
    if (state.search) {
      searchView.highlightSelected(id);
    }
    //Create new recipe objects
    state.recipe = new Recipe(id);
    try {
      //Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      //Calculate time and servings
      state.recipe.calcTime();
      state.recipe.calcServings();

      //Render recipe to UI
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
      //console.log(state.recipe);
    } catch (error) {
      console.log(error);
      alert("Error processing recipe! :(");
    }
  }
};
window.addEventListener("hashchange", controlRecipe);
["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

/**LIST CONTROLLER */

const controlList = () => {
  // Create a new list if there is none yet
  if (!state.list) state.list = new List();

  // Add each ingredient to the list and UI
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};
// Handle delete and update list item events
elements.shopping.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid;

  // Handle delete button
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    // Delete from state
    state.list.deleteItem(id);
    // Delete from UI
    listView.deleteItem(id);
    // Handle the count update
  } else if (e.target.matches(".shopping__count--value")) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

/**LIKE CONTROLLER */

const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;
  // User has not yet liked the current recipe
  if (!state.likes.isLiked(currentID)) {
    // Add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );

    // Toggle the like button
    likesView.toggleLikeButton(true);
    // Add like to the UI list
    likesView.renderLike(newLike);
    //console.log(state.likes);
  }
  // User has liked the current recipe
  else {
    // Remove like from the state
    state.likes.deleteLike(currentID);
    // Toggle like button
    likesView.toggleLikeButton(false);
    // Remove like button from UI
    likesView.deleteLike(currentID);
    //console.log(state.likes);
  }
  likesView.toggleLikeMenu(state.likes.getNoLikes());
};
// Restore likes data when the window reloads
window.addEventListener("load", () => {
  state.likes = new Likes();
  // Restore likes
  state.likes.readStorage();
  // Toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNoLikes());
  // Render the existing likes
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});
// Handling recipe button clicks
elements.recipe.addEventListener("click", (e) => {
  if (e.target.matches(".btn-decrease , .btn-decrease *")) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase , .btn-increase *")) {
    // Increase button is clicked
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    // Add ingredients to shopping list
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    // Like controller
    controlLike();
  }
});
//window.l = new List();
