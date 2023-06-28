//Global variables declaration :
var galleryFull = new Array();
const buttonAll = document.querySelector("#btn-all");
const buttonObject = document.querySelector("#btn-object");
const buttonAppt = document.querySelector("#btn-appt");
const buttonHotel = document.querySelector("#btn-hotel");
const filters = document.querySelectorAll(".filter");

//functions :
function clearGallery() {
    document.querySelector(".gallery")
                .innerHTML = ``;
}

function removeAllClass(balise, nameClass) {
    for (let i = 0; i < balise.length; i++) {
        balise[i].classList.remove(nameClass);
    }
}

function resetClick(filterId) {
    clearGallery();
    removeAllClass(filters, "filter--active");
    filters[filterId].classList.add("filter--active");
}

function filterByCat(arr, id) {
    var result = arr.filter(function(projet) {
        return projet.categoryId === id;
    });
    return result;
}

function fillGallery(arr) {
    for (let i = 0; i < arr.length; i++) {
        document.querySelector(".gallery")
            .innerHTML += `<figure>
                    <img src="${arr[i].imageUrl}" alt="${arr[i].title}">
                    <figcaption>${arr[i].title}</figcaption>
                </figure>`;
    }
}

fetch("http://localhost:5678/api/works")
    .then(data => data.json())
    .then(gallery => {
        galleryFull = gallery;
        fillGallery(gallery);

        //"All" button :
        buttonAll.addEventListener("click", () => {
            resetClick(0);
            fillGallery(gallery);
        });

        //"Objets" button :
        buttonObject.addEventListener("click", () => { 
            resetClick(1);
            const filtered = filterByCat(galleryFull, 1);
            fillGallery(filtered);
        });

        //"Appartements" button :
        buttonAppt.addEventListener("click", () => {
            resetClick(2);
            const filtered = filterByCat(galleryFull, 2);
            fillGallery(filtered);
        });

        //"Hôtels & restaurants" button :
        buttonHotel.addEventListener("click", () => {
            resetClick(3);
            const filtered = filterByCat(galleryFull, 3);
            fillGallery(filtered);
        });

    });