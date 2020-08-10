import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }

        this.items.push(item);
        return item;
    }

    deleteItem (id) {
        // find the index of the target item
        const index = this.items.findIndex(elem => elem.id === id);

        // delete the item from the list array
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        this.items.find(elem => elem.id === id).count = newCount;
    }
}