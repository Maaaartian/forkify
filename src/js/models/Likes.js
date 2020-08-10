export default class Likes {
    constructor() {
        this.likedList = [];
    }

    addLike(id, title, author, img) {
        const liked = { id, title, author, img };
        this.likedList.push(liked);

        // persist the data in local storage
        this.persistData();

        return liked;
    }

    deleteLike(id) {
        // find the index of the target item
        const index = this.likedList.findIndex(elem => elem.id === id);

        // delete the item from the list array
        this.likedList.splice(index, 1);

        // persist the data in local storage
        this.persistData();
    }

    isLiked(id) {
        return this.likedList.findIndex(elem => elem.id === id) !== -1;
    }

    getNumberOfLikes() {
        return this.likedList.length;
    }

    persistData() {
        localStorage.setItem('likedList', JSON.stringify(this.likedList));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likedList'));
        if (storage) this.likedList = storage;
    }
}