//Global variables declaration :
var galleryFull = new Array();
const buttonAll = document.querySelector("#btn-all");
const buttonObject = document.querySelector("#btn-object");
const buttonAppt = document.querySelector("#btn-appt");
const buttonHotel = document.querySelector("#btn-hotel");
const filters = document.querySelectorAll(".filter");
const loginOut = document.querySelector("#login-logout");
const buttonLogin = document.querySelector("#login")
var modalActive;
var modalPrev;
const galleryView = document.querySelector(".gallery-view");

//functions declaration :
function clearGallery(selector) {
    document.querySelector(selector)
                .innerHTML = ``;
}

function removeAllClass(balise, nameClass) {
    for (let i = 0; i < balise.length; i++) {
        balise[i].classList.remove(nameClass);
    }
}

function resetClick(filterId) {
    clearGallery(".gallery");
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

function removeAllElementFrom(node) {
    for(const element of node) {
        element.remove();
    }
}


//Dynamic Gallery display :
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


//Logged display :

if (sessionStorage.getItem("logToken")) {
    loginOut.removeChild(buttonLogin);
    loginOut.insertAdjacentHTML("afterbegin", 
    `<a id="logout" href="./index.html">logout<a/>`)
    document.querySelector("#logout").addEventListener("click", () => {
        sessionStorage.removeItem("logToken");
    })
    removeAllElementFrom(filters);
    document.querySelector("#header").insertAdjacentHTML("afterend", 
    `<div id="edit-header">
        <div class="modifier">
            <i class="fa-solid fa-pen-to-square"></i>
            <p>Mode édition</p>
        </div>
        <input id="btn-publish-changes" type="submit" value="Publier les changements">
    </div>`)
    document.querySelector("#portfolio-header").insertAdjacentHTML("beforeend", 
    `<div class="modifier">
        <i class="fa-solid fa-pen-to-square"></i>
        <a class="modal-link" href="#modal-gallery">Modifier</a>
    </div>`)
    document.querySelector("#introduction").insertAdjacentHTML("afterend", 
    `<div id="modifier-introduction" class="modifier">
        <i class="fa-solid fa-pen-to-square"></i>
        <a href="#">Modifier</a>
    </div>`)

    document.querySelectorAll(".modal-link").forEach(a => {
        a.addEventListener("click", (openModal))
    })

    document.querySelectorAll(".x-close").forEach(i => {
        i.addEventListener("click", (closeModal))
    })
    
    document.querySelectorAll(".arrow-prev").forEach(i =>{
        i.addEventListener("click", (prevModal))
    })

}

function prevModal() {
    modalPrev.showModal();
    modalPrev.style.display = "flex";
    addGalleryView(modalPrev);
    modalActive = modalPrev;
}

function closeModal() {
    modalPrev = modalActive;
    modalActive.close();
    modalActive.style.display = null;
    console.log(modalPrev);
}

function openModal (e) {
    if (modalActive != null && modalActive != undefined && modalActive != "") {
        closeModal();
    }
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute("href"));
    target.showModal();
    target.style.display = "flex";
    addGalleryView(target);
    modalActive = target;
}

function addGalleryView(modal) {
    if (modal.id === "modal-gallery") {
        console.log(galleryFull);
        clearGallery(".gallery-view");
        for (let i = 0; i < galleryFull.length; i++) {
            document.querySelector(".gallery-view")
                .innerHTML += `<figure>
                        <div class="card-img">
                            <img src="${galleryFull[i].imageUrl}" alt="${galleryFull[i].title}">
                        </div>
                        <p>éditer</p>
                    </figure>`;
        }
    }
}