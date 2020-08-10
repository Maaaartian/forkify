// all DOM elements used
export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResults: document.querySelector('.results'),
    searchResultLists: document.querySelector('.results__list'),
    searchResultPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

// store the necessary class names
export const elementStrings = {
    loader: 'loader'
}

// the loader image to be used when loading results
export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

// make the loader disappear after loading results
export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`)
    if (loader) loader.parentElement.removeChild(loader);
}