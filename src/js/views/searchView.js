import {elements} from "./base";
export const getInput = () => elements.searchInput.value;
export const clearInput = ()=> {
    elements.searchInput.value = "";
};
export const clearElements = () =>{
    elements.searchResList.innerHTML= "";
};
const limitRecipeTitle = (title,limit = 17)=>{
    const newTitle = [];
        if(title.length >= limit){
            title.split(" ").reduce((acc,cur)=>{
                if(acc + cur.length <= limit){
                     newTitle.push(cur);
                }
                return acc + cur.length; // this is how an accumulator value is updated in a reduce function
            },0) 

            return `${newTitle.join(" ")} ...`
        }
    return title;
}
const renderRecipe = recipe =>{
    const markUp = `
    <li>
        <a class="results__link" href="${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li> `;
    elements.searchResList.insertAdjacentHTML("beforeend",markUp);
}
const renderButtons = (page,numResults,resPerPage) => {
    const pages = Math.ceil(numResults/resPerPage);
    if(page ==1){
        // Only button to go to next page
    }
    else if(page==pages){
        // Only button to go to previous page
    }
                                        
}
export const renderResults = (recipes,page = 1,resPerPage = 10) => {
    const start = (page - 1)*resPerPage;
    const end = resPerPage;
    recipes.slice(start,end).forEach(renderRecipe);
}