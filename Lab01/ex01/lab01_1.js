'use strict';
const dayjs = require('dayjs');

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
}

let f1 = new Film(1, 'Pulp Fiction', true, '2022-03-10', 5);
let f2 = new Film(2, '21 Grams', true, '2022-03-17', 4);
let f3 = new Film(3, 'Star Wars');
let f4 = new Film(4, 'Matrix');
let f5 = new Film(5, 'Shrek', false, '2022-03-21', 3);

const myFilmLibrary = new FilmLibrary();

myFilmLibrary.addNewFilm(f1);
myFilmLibrary.addNewFilm(f2);
myFilmLibrary.addNewFilm(f3);
myFilmLibrary.addNewFilm(f4);
myFilmLibrary.addNewFilm(f5);

