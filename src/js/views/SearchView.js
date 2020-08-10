import { elements, elementStrings } from './base';


// obtain the search query from input
export const getInput = () => elements.searchInput.value;

// clear the search area after searching for once
export const clearInput = () => {
    elements.searchInput.value = '';
}

// clear the results list and pagination buttons after searching for once
export const clearResults = () => {
    elements.searchResultLists.innerHTML = '';
    elements.searchResultPages.innerHTML = '';
};

// highlight the current recipe
export const highlightRecipe = id => {
    // deactivate all recipes before selecting a new one
    const recipeArray = Array.from(document.querySelectorAll('.results__link'));
    recipeArray.forEach(elem => elem.classList.remove('results__link--active'));

    // activate the selected recipe
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
};

// limit the length of the recipe title displayed on the page
export const limitRecipeTitle = (title, maxLength=17) => {
    const newTitle = [];

    if (title.length > maxLength) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= maxLength) {
                newTitle.push(cur);
            };
            return acc + cur.length;
        }, 0);
        title = `${newTitle.join(' ')} ...`;
    }
    return title;
};

// render the searching result to HTML for each recipe
const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResultLists.insertAdjacentHTML("beforeend", markup);
}

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? page - 1 : page + 1}">
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numberOfResults, resultsPerPage) => {
    const numberOfPages = Math.ceil(numberOfResults / resultsPerPage);

    let button;
    if (page === 1 && numberOfPages > 1) {
        // only render the button for next page
        button = createButton(page, 'next');
    } else if (page < numberOfPages) {
        // render both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === numberOfPages && numberOfPages > 1) {
        // only render the button for previous page
        button = createButton(page, 'prev');
    }

    elements.searchResultPages.insertAdjacentHTML("afterbegin", button);
};

// display the searching results containing all recipes
export const renderResults = (recipes, page=1, resultsPerPage=10) => {
    // render results for the current page
    const start = (page - 1) * resultsPerPage;
    const end = page * resultsPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    // render pagination buttons
    renderButtons(page, recipes.length, resultsPerPage);
}