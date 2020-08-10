import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (err) {
            alert(`getRecipeError: \n${err}`);
        }
    }

    // fake function to simulate the cooking time
    calculateTime() {
        const numOfIngs = this.ingredients.length;
        const periods = Math.ceil(numOfIngs / 3);
        this.time = periods * 15; 
    }

    // fake function to simulate the number of servings
    calculateServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(elem => {
            // uniform units
            let ingredient = elem.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // parse ingredients into count, unit and the ingredient itself
            const ingArray = ingredient.split(' ');
            // find if the unit exists, if it does, find its index
            const unitIndex = ingArray.findIndex(el => units.includes(el));

            let ingObject;
            if (unitIndex > -1) {
                // the unit exists
                const countArray = ingArray.slice(0, unitIndex);
                let count;

                if (countArray.length === 1) {
                    // only 1 element in the count array
                    count = eval(countArray[0].replace('-', '+'));
                } else {
                    // more than 1 element in the count array
                    count = eval(countArray.join('+'));
                }

                ingObject = {
                    count,
                    unit: ingArray[unitIndex],
                    ingredient: ingArray.slice(unitIndex + 1).join(' ')
                }
            } else if (parseInt(ingArray[0], 10)) {
                // no unit, but the first position contains a number
                ingObject = {
                    count: parseInt(ingArray[0], 10),
                    unit: '',
                    ingredient: ingArray.slice(1).join(' ')
                }
            } else {
                // no unit
                ingObject = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return ingObject;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        // update servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // update ingredients
        this.ingredients.forEach(ingredient => ingredient.count *= (newServings / this.servings));

        this.servings = newServings;
    }
}