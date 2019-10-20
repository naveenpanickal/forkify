import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import {elements, renderLoader, clearLoader} from "./views/base";
/**Global state of the app
 *- search object
 *- current recipe
 *- shopping list item
 *- liked item
 */
const state = {};
/**SEARCH CONTROLLER */
const controlSearch = async () => {
//1. Get query from view
    const query = searchView.getInput();
    console.log(query);
    // const query = "pizza";
    if(query){
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
                console.log(state.search.result);
                searchView.renderResults(state.search.result);
                
            } catch (error) {
                alert("Something went wrong with the search..");
                console.log(error);
                clearLoader();
            }

    }
}

elements.searchForm.addEventListener("submit",e=>{
    e.preventDefault();
    controlSearch();
});
//Testing
// window.addEventListener("load",e=>{
//     e.preventDefault();
//     controlSearch();
// });


elements.searchResPages.addEventListener("click",e => {
    const btn = e.target.closest(".btn-inline");
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result,goToPage);
    }
})


/**RECIPE CONTROLLER */
const controlRecipe = async () => {
    // Get id from url
    const id = window.location.hash.replace("#","");
    console.log(id);
    if(id){
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        //Highlight selected search item
        if(state.search){
        searchView.highlightSelected(id);
        };
        //Create new recipe objects
        state.recipe = new Recipe(id);
        try {
        //Get recipe data and parse ingredients
        await state.recipe.getRecipe();
        console.log(state.recipe);
        state.recipe.parseIngredients();
        //Calculate time and servings
        state.recipe.calcTime();
        state.recipe.calcServings();
        
        //Render recipe to UI
        clearLoader();
        recipeView.renderRecipe(state.recipe);
        //console.log(state.recipe);
            
        } catch (error) {
            console.log(error);
            alert("Error processing recipe! :(");
            
        }
  
        
    }
}
window.addEventListener('hashchange',controlRecipe);
["hashchange","load"].forEach(event => window.addEventListener(event,controlRecipe));

// Handling recipe button clicks
elements.recipe.addEventListener("click",e => {
    console.log("i got clicked");
    if(e.target.matches(".btn-decrease , .btn-decrease *")){
        // Decrease button is clicked
        if(state.recipe.servings >1){
            state.recipe.updateServings("dec");
            recipeView.updateServingsIngredients(state.recipe);
        }
    }
    else if(e.target.matches(".btn-increase , .btn-increase *")){
        // Increase button is clicked
        state.recipe.updateServings("inc");
        recipeView.updateServingsIngredients(state.recipe);
    }
    console.log(state.recipe);
});