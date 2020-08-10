// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/SearchView';
import * as recipeView from './views/RecipeView';
import * as listView from './views/ListView';
import * as likesView from './views/LikesView';
import { elements, renderLoader, clearLoader } from './views/base';


/* Global state of the app
 * - search object
 * - current recipe object
 * - shopping list object
 * - liked recipes
*/
const state = {};


/* SEARCH CONTROLLER */

const controlSearch = async () => {
    // get query from the page
    const query = searchView.getInput();

    if (query) {
        // create a new search object and add to state
        state.search = new Search(query);

        // prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResults);

        try {
            // search for recipes
            await state.search.getResults();

            // render results on UI
            clearLoader();
            searchView.renderResults(state.search.results);
        } catch (err) {
            alert(`controlSearchError: \n${err}`);
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    controlSearch();
});

elements.searchResultPages.addEventListener('click', event => {
    const btn = event.target.closest('.btn-inline');

    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        // clear results before displaying results on other pages
        searchView.clearResults();
        searchView.renderResults(state.search.results, goToPage);
    }
});


/* RECIPE CONTROLLER */ 

const controlRecipe = async () => {
    // get recipe ID from URL
    const id = window.location.hash.replace('#', '');

    if (id) {
        // prepare UI for the change of recipe
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // highlight the selecter recipe
        if (state.search) {
            searchView.highlightRecipe(id);
        }

        // create a new recipe object
        state.recipe = new Recipe(id);

        try {
            // get the recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // calculate cooking time and number of servings
            state.recipe.calculateTime();
            state.recipe.calculateServings();

            // render the recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

        } catch (err) {
            alert(`controlRecipeError: \n${err}`);
        }
    }
};

/* SHOPPING LIST CONTROLLER */ 

const controlList = () => {
    // create a new list if there's no list
    if (!state.list) state.list = new List();

    // add each ingredient to the list
    state.recipe.ingredients.forEach(ing => {
        const item = state.list.addItem(ing.count, ing.unit, ing.ingredient);
        listView.renderItem(item);
    });
};

// event listeners to display the recipe
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// event listeners to recipe buttons
elements.recipe.addEventListener('click', event => {
    // decrease button clicked
    if (event.target.matches('.btn-decrease, .btn-decrease *')) {   
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    // increase button clicked    
    } else if (event.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    // add-to-shopping-list button clicked
    } else if (event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    // like button clicked
    } else if (event.target.matches('.recipe__love, .recipe__love *')) {
        controlLikes();
    }
});

// event listeners to change the amount of ingredients
elements.shoppingList.addEventListener('click', event => {
    const id = event.target.closest('.shopping__item').dataset.item_id;

    // item deletion button
    if (event.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete the data
        state.list.deleteItem(id);

        // delete from UI
        listView.deleteItem(id);
    
    // update ingredient count button
    } else if (event.target.matches('.shopping__count-value')) {
        const val = parseFloat(event.target.value);
        state.list.updateCount(id, val);
    }
});

/* LIKE CONTROLLER */ 
const controlLikes = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // user wants to add the recipe to the liked list
    if (!state.likes.isLiked(currentID)) {
        // add like to the recipe
        const newLike = state.likes.addLike(
            currentID, state.recipe.title, state.recipe.author, state.recipe.img
        );

        // toggle the like button
        likesView.toggleLikeBtn(true);

        // add like to the UI list
        likesView.renderLikedMenu(newLike);

    // use wants to cancel the like to the recipe
    } else {
        // remove like to the recipe
        state.likes.deleteLike(
            currentID, state.recipe.title, state.recipe.author, state.recipe.img
        );

        // toggle the like button
        likesView.toggleLikeBtn(false);

        // remove like to the UI list
        likesView.removeLikedMenu(currentID);
    }
    
    // hide the liked menu if there's no liked recipe
    likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
};

// restore the liked list from local storage when reloading the page
window.addEventListener('load', () => {
    state.likes = new Likes();

    // restore from local storage
    state.likes.readStorage();

    // toggle the like menu button
    likesView.toggleLikeMenu(state.likes.getNumberOfLikes());

    // render the liked list
    state.likes.likedList.forEach(item => {
        likesView.renderLikedMenu(item);
    });
})