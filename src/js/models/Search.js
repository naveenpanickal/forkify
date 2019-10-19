import axios from "axios";
import {key, proxy} from "../config-prod";
export default class Search{
    constructor(query){
        this.query = query;
    }
    async getResults(){
        
        try{
            const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
            console.log(res);
        }
        catch(error){
            console.log("error in getting results");
            alert(error);
        }
    }

}