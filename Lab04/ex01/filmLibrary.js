'use strict';

function Film (id, title, favorite = false, dateOfWatching = null, rating = null) {
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

    this.getFavorites=()=>{
        const result = this.library.filter( film => film.favorite);   
        return result;
    } 

    this.getRated=()=>{
        const result = this.library.filter( a => a.rating!=null).sort( (a, b) => b.rating-a.rating );
        return result;
    }

    this.getFiveStars=()=>{
        const result = this.library.filter( a => a.rating==5);
        return result;
    }

    this.getLastMonth=()=>{
        const result=this.library.filter( (film) =>{
            if (film.dateOfWatching.isValid()) {
                if (dayjs().diff(film.dateOfWatching, 'd')<=30 && dayjs().diff(film.dateOfWatching, 'd')>=0) {
                    return true;
                }
                else {
                    return false;
                }
            } else {
                false;
            }
        } );
        return result;
        
    }

    this.deleteFilm=(id)=>{
        this.library = this.library.filter( (a) => a.id !== id );
    } 

    this.deleteFilmByName=(title)=>{
        this.library = this.library.filter( (a) => a.title !== title );
    }

    this.resetWatchedFilms=()=>{
        this.library.forEach( element => element.dateOfWatching=dayjs(null) );
    }


    this.print=()=>{ this.library.forEach( element => console.log(
        element.id, 
        element.title, 
        element.favorite, 
        element.dateOfWatching.toString()!=='Invalid Date' ? element.dateOfWatching.format('DD/MM/YYYY') : "---", 
        element.rating !== null ? element.rating : "---"));}

    this.getLibrary=()=>{return this.library};
}

/* let f1 = new Film(1, 'Pulp Fiction', true, '2022-03-10', 5);
let f2 = new Film(2, '21 Grams', true, '2022-03-17', 4);
let f3 = new Film(3, 'Star Wars');
let f4 = new Film(4, 'Matrix');
let f5 = new Film(5, 'Shrek', false, '2022-02-21', 3); 

const myFilmLibrary = new FilmLibrary();

myFilmLibrary.addNewFilm(f1);
myFilmLibrary.addNewFilm(f2);
myFilmLibrary.addNewFilm(f3);
myFilmLibrary.addNewFilm(f4);
myFilmLibrary.addNewFilm(f5);

console.log("-----LIST-----");
myFilmLibrary.print();

console.log("-----ONLY RATED-----");
const myFilmLibraryRated = myFilmLibrary.getRated();
myFilmLibraryRated.forEach( element => console.log(
    element.id, 
    element.title, 
    element.favorite, 
    element.dateOfWatching.toString()!=='Invalid Date' ? element.dateOfWatching.format('DD/MM/YYYY') : "---", 
    element.rating !== null ? element.rating : "---"));

console.log("-----SORTED-----");
const myFilmLibrarySorted = myFilmLibrary.sortByDate();
myFilmLibrarySorted.forEach( element => console.log(
    element.id, 
    element.title, 
    element.favorite, 
    element.dateOfWatching.toString()!=='Invalid Date' ? element.dateOfWatching.format('DD/MM/YYYY') : "---", 
    element.rating !== null ? element.rating : "---"));

console.log("-----DELETE FILM-----");
myFilmLibrary.deleteFilm(3);
myFilmLibrary.print();

console.log("-----RESET WATCHED FILM-----");
myFilmLibrary.resetWatchedFilms();
myFilmLibrary.print(); */
