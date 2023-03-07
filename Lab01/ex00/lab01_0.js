'use strict';

function makeUpString (vet){
    vet.forEach(str => {
        if (str.length<2){
            console.log("");
        }
        else {
            console.log(str.substr(0, 2).concat(str.substr(str.length-2, 2)));
        }
    });
   
}

let vectorOfString = [];
vectorOfString[0]="abcdef";
vectorOfString[1]="qwerty";
vectorOfString[2]="ab";
vectorOfString[3]="poi";
vectorOfString[4]="g";
makeUpString(vectorOfString);