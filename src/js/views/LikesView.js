import { elements } from './base';
import { limitRecipeTitle } from './SearchView';

// toggle the like button
export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

// toggle the like menu icon
export const toggleLikeMenu = numberOfLikes => {
    elements.likesMenu.style.visibility = numberOfLikes > 0 ? 'visible' : 'hidden';
};

// display the liked recipe to the liked list
export const renderLikedMenu = item => {
    const markup = `
        <li>
            <a class="likes__link" href="#${item.id}">
                <figure class="likes__fig">
                    <img src="${item.img}" alt="${item.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(item.title)}</h4>
                    <p class="likes__author">${item.author}</p>
                </div>
            </a>
        </li>
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
}

// remove the liked recipe from the liked list
export const removeLikedMenu = id => {
    const elem = document.querySelector(`.likes__link[href="#${id}"]`).parentElement;
    if (elem) elem.parentElement.removeChild(elem);
}