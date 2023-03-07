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

    this.store = async (film) => {
        return new Promise( (resolve, reject) => {
            const sql_insert = "INSERT INTO films (id, title, favorite, watchdate, rating) VALUES(?,?,?,?,?)";
            db.all(sql_insert, [film.id, film.title, film.favorite, film.watchdate, film.rating], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(true);
                }
            }) 
        })
    }

    this.delete = async (inputId) => {
        return new Promise( (resolve, reject) => {
            const sql_delete = "DELETE FROM films WHERE id==?";
            db.all(sql_delete, [inputId], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(true);
                }
            })
        } )
    }

    this.deleteAllWatchdate = async () => {
        return new Promise( (resolve, reject) => {
            const sql_delDate= "UPDATE films SET watchdate='NULL'"
            db.all(sql_delDate, (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(true);
                }
            })
        } )
    }

}


async function main() {
    const myFilmLibrary = new FilmLibrary();

    try {
        await myFilmLibrary.store(new Film(7, 'Taken', 4))
    } catch (error) {
        console.log("Insert was not possible");
    }

    console.log("-----INSERT 7-----");
    const insert_= await myFilmLibrary.getAll();
    console.log(insert_.forEach( element => console.log(
        element.id, 
        element.title, 
        element.favorite, 
        element.dateOfWatching.toString()!=='Invalid Date' ? element.dateOfWatching.format('DD/MM/YYYY') : "---", 
        element.rating !== null ? element.rating : "---")));
    
    try {
        await myFilmLibrary.delete(7)
    } catch (error) {
        console.log("Delete was not possible");
    }
    
    console.log("-----DELETE 7-----");
    const delete_= await myFilmLibrary.getAll();
    console.log(delete_.forEach( element => console.log(
        element.id, 
        element.title, 
        element.favorite, 
        element.dateOfWatching.toString()!=='Invalid Date' ? element.dateOfWatching.format('DD/MM/YYYY') : "---", 
        element.rating !== null ? element.rating : "---")));

    try {
        await myFilmLibrary.deleteAllWatchdate();
    } catch (error) {
        console.log("Delete all watchdate was not possible");
    }
    
    console.log("-----DELETE ALL WATCHDATE-----");
    const delete_date= await myFilmLibrary.getAll();
    console.log(delete_date.forEach( element => console.log(
        element.id, 
        element.title, 
        element.favorite, 
        element.dateOfWatching.toString()!=='Invalid Date' ? element.dateOfWatching.format('DD/MM/YYYY') : "---", 
        element.rating !== null ? element.rating : "---")));

}

main();