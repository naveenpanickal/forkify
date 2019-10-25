export default class Likes{
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img){
        const like = {id, title, author, img};
        this.likes.push(like);
        // Persist the data in local storage
        this.persistData();
        return like;

    }
    deleteLike(id){
        const index = this.likes.findIndex(el => el.id === id);
        // [2,4,8].splice(1,2) returns (4,8) and the original array is [2]
        // [2,4,8].slice(1,2) returns (4), original array is [2,4,8]
        this.likes.splice(index, 1);
        // Persist the data in local storage
        this.persistData();
    }
    isLiked(id){
        return this.likes.findIndex(el => el.id === id) !== -1;
    }
    getNoLikes(){
        return this.likes.length;
    }
    persistData(){
        localStorage.setItem("likes",JSON.stringify(this.likes));
    }
    readStorage(){
        const storage = JSON.parse(localStorage.getItem("likes"));
        if(storage) this.likes = storage;
    }
}