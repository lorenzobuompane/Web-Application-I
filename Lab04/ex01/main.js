'use strict'

function generateTable(vet) {
    const tableNode=document.getElementById('filmsList');
    tableNode.innerHTML="";
    vet.forEach(element => {
        const elementToAdd = document.createElement('li');
        elementToAdd.classList.add("list-group-item");
        let starHTML='';
        let starNum=element.rating;
        for (let i=0; i<5; i++) {
            if (starNum>0) {
                starHTML+='<i class="bi bi-star-fill"></i>';
                starNum--;
            }
            else {
                starHTML+='<i class="bi bi-star"></i>';
            }
        }
        elementToAdd.innerHTML= `<div class="row">
                                    <div class="col ${element.favorite ? 'text-danger' : ''}">
                                        ${element.title}
                                    </div>
                                    <div class="col d-flex justify-content-center">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" ${element.favorite ? 'checked' : ''}>
                                            <label class="form-check-label" for="flexCheckChecked">
                                            Favorite
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col d-flex justify-content-center">
                                        ${element.dateOfWatching.isValid() ? dayjs(element.dateOfWatching).format('MMMM D, YYYY') : ""}
                                    </div>
                                    <div class="col d-flex justify-content-end">
                                        ${starHTML}
                                        <i class="bi bi-trash-fill" onclick="trashIconClick('${element.title}', this)" style="margin-left:30px"></i>
                                    </div>
                                    
                                </div>`;

        tableNode.appendChild(elementToAdd);
    });
}

const myFilmLibrary = new FilmLibrary();

document.addEventListener('DOMContentLoaded', (event) => {
    let f1 = new Film(1, 'Pulp Fiction', true, '2022-03-10', 5);
    let f2 = new Film(2, '21 Grams', true, '2022-03-17', 4);
    let f3 = new Film(3, 'Star Wars');
    let f4 = new Film(4, 'Matrix');
    let f5 = new Film(5, 'Shrek', false, '2022-03-21', 3);

    

    myFilmLibrary.addNewFilm(f1);
    myFilmLibrary.addNewFilm(f2);
    myFilmLibrary.addNewFilm(f3);
    myFilmLibrary.addNewFilm(f4);
    myFilmLibrary.addNewFilm(f5);

    generateTable(myFilmLibrary.library);
});

function leftBarClick(node) {
    let vet = [];
    const titleToChange=document.getElementById("tableTitle");
    Array.from(node.parentNode.children).forEach((element)=>{
        element.classList.remove('leftBarSelected');
        element.classList.add('bg-light');
    });
    node.classList.add('leftBarSelected');
    node.classList.remove('bg-light');
    switch (node.textContent) {
        case "All":
            vet = myFilmLibrary.library.filter(film => {return true})
            break;
        case "Favorites":
            vet = myFilmLibrary.getFavorites();
            break;
        case "Best Rated":
            vet = myFilmLibrary.getFiveStars();
            break;
        case "Last Seen":
            vet = myFilmLibrary.sortByDate();
            break;
        case "Seen Last Month":
            vet = myFilmLibrary.getLastMonth();
            break;
    }
    titleToChange.textContent=node.textContent;
    generateTable(vet);
}

function trashIconClick(title, node) {
    myFilmLibrary.deleteFilmByName(title);
    node.parentNode.parentNode.parentNode.remove();
    generateTable(myFilmLibrary.library);
}