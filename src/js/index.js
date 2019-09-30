import Search from "./models/Search";
import * as searchView from "./views/searchView";
import {elements, renderLoader, clearLoader} from "./views/base";
/**Global state of the app
 *- search object
 *- current recipe
 *- shopping list item
 *- liked item
 */
const state = {};

const controlSearch = async ()=>{
//1. Get query from view
    const query = searchView.getInput();
    console.log(query);
    if(query){
//2. New search object and add to state
            state.search = new Search(query);
//3. Prepare UI for results
            searchView.clearInput();
            searchView.clearElements();
            renderLoader(elements.searchRes);
//4  Search for recipes
            await state.search.getResults();
//5. Render results to UI
            clearLoader();
            searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener("submit",e=>{
    e.preventDefault();
    controlSearch();
});




