'use strict';
const dayjs = require('dayjs');
const sqlite = require('sqlite3');

function Film (id, title, favorite = 0, dateOfWatching = null, rating = null) {
    this.id=id;
    this.title=title;
    this.favorite=favorite;
    this.dateOfWatching=dayjs(dateOfWatching);
    this.rating=rating;
}

function FilmLibrary () {
    this.library = [];
    
    this.addNewFilm=(film)=>{
        this.library.push(film);
    }

     this.sortByDate=()=> {
        const result= this.library.filter(a=>a.dateOfWatching.isValid()).sort( (a, b) =>  a.dateOfWatching.isBefore(b.dateOfWatching) ? 1: -1)
                .concat(this.library.filter(a=>!a.dateOfWatching.isValid()));
        return result;
    }

    this.deleteFilm=(id)=>{
        this.library = this.library.filter( (a) => a.id !== id );
    } 

    this.resetWatchedFilms=()=>{
        this.library.forEach( element => element.dateOfWatching=dayjs(null) );
    }

    this.getRated=()=>{
        const result = this.library.filter( a => a.rating!=null).sort( (a, b) => b.rating-a.rating );
        return result;
    }

    this.print=()=>{ this.library.forEach( element => console.log(
        element.id, 
        element.title, 
        element.favorite, 
        element.dateOfWatching.toString()!=='Invalid Date' ? element.dateOfWatching.format('DD/MM/YYYY') : "---", 
        element.rating !== null ? element.rating : "---"));}

    this.getLibrary=()=>{return this.library};

    

    const db = new sqlite.Database(__dirname+"\\films.db", (err)=> { 
        if (err) {
            throw err;
        }
    });

    this.getAll=()=> {
        return new Promise( (resolve, reject) => {
            const sql_all='SELECT * FROM films';
            db.all(sql_all, (err, rows)=> {
                if (err) {
                    reject(err);
                }       
                else {
                    resolve(rows.map( (f) => new Film(f.id, f.title, f.favorite, f.watchdate, f.rating) ));
                }
            })
        } )
    }

    this.getFavorite= async ()=> {
        const list = await this.getAll();
        return list.filter(a=>a.favorite!=0);
    }

    this.getToday= async()=> {
        const list = await this.getAll();
        return list.filter(a=>dayjs(a.dateOfWatching)==dayjs());
    }

    this.getBeforeDate = async (inputDate) => { 
        return new Promise ( (resolve, reject) => {
            const sql_date = "SELECT * FROM films WHERE ?>watchdate";
            db.all(sql_date, [inputDate], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve( rows.map( (f) => new Film (f.id, f.title, f.favorite, f.watchdate, f.rating) ) );
                }

            })
        } )
    }

    this.getGreaterRating = async (inputRating) => { 
        return new Promise ( (resolve, reject) => {
            const sql_rating = "SELECT * FROM films WHERE rating>=?";
            db.all(sql_rating, [inputRating], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve( rows.map( (f) => new Film (f.id, f.title, f.favorite, f.watchdate, f.rating) ) );
                }

            })
        } )
    }

    this.getFromTitle = async (inputTitle) => { 
        return new Promise ( (resolve, reject) => {
            const sql_title = "SELECT * FROM films WHERE ?==title";
            db.all(sql_title, [inputTitle], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve( rows.map( (f) => new Film (f.id, f.title, f.favorite, f.watchdate, f.rating) ) );
                }

            })
        } )
    }

}


async function main() {
    const myFilmLibrary = new FilmLibrary();

    console.log("-----ALL-----");
    const all= await myFilmLibrary.getAll();
    console.log(all.forEach( element => console.log(
        element.id, 
        element.title, 
        element.favorite, 
        element.dateOfWatching.toString()!=='Invalid Date' ? element.dateOfWatching.format('DD/MM/YYYY') : "---", 
        element.rating !== null ? element.rating : "---")));

    console.log("-----FAVORITE-----");
    const favorite= await myFilmLibrary.getFavorite();
    console.log(favorite.forEach( element => console.log(
        element.id, 
        element.title, 
        element.favorite, 
        element.dateOfWatching.toString()!=='Invalid Date' ? element.dateOfWatching.format('DD/MM/YYYY') : "---", 
        element.rating !== null ? element.rating : "---")));

    console.log("-----TODAY-----");
    const today= await myFilmLibrary.getToday();
    console.log(today.forEach( element => console.log(
        element.id, 
        element.title, 
        element.favorite, 
        element.dateOfWatching.toString()!=='Invalid Date' ? element.dateOfWatching.format('DD/MM/YYYY') : "---", 
        element.rating !== null ? element.rating : "---")));
    
    console.log("-----BEFORE DATE-----");
    const beforeDate = await myFilmLibrary.getBeforeDate("2022-03-18");
    console.log(beforeDate.forEach( element => console.log(
        element.id, 
        element.title, 
        element.favorite, 
        element.dateOfWatching.toString()!=='Invalid Date' ? element.dateOfWatching.format('DD/MM/YYYY') : "---", 
        element.rating !== null ? element.rating : "---")));
    
    console.log("-----GREATER RATING-----");
    const greaterRating = await myFilmLibrary.getGreaterRating(3);
    console.log(greaterRating.forEach( element => console.log(
        element.id, 
        element.title, 
        element.favorite, 
        element.dateOfWatching.toString()!=='Invalid Date' ? element.dateOfWatching.format('DD/MM/YYYY') : "---", 
        element.rating !== null ? element.rating : "---")));

    console.log("-----TITLE-----");
    const title = await myFilmLibrary.getFromTitle("Matrix");
    console.log(title.forEach( element => console.log(
        element.id, 
        element.title, 
        element.favorite, 
        element.dateOfWatching.toString()!=='Invalid Date' ? element.dateOfWatching.format('DD/MM/YYYY') : "---", 
        element.rating !== null ? element.rating : "---")));
    
}

main();