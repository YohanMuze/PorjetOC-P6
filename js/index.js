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
var addedPicture;
const formAddPicture = document.forms.namedItem("add-picture");
const preview = document.getElementById("preview-picture");
const title = document.getElementById("title");
const cat = document.getElementById("cat");
const inputAddPicture = document.getElementById("unseen-input-add-picture")


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
    var result = arr.filter(function (projet) {
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
    for (const element of node) {
        element.remove();
    }
}

function addTextError(selectId, errorTxt) {
    const node = document.getElementById(selectId);
    node.insertAdjacentHTML("beforebegin",
        `<p id="error" class="error-txt">${errorTxt}</p>`);
}

function removeElement(selector) {
    const errorElement = document.getElementById(selector);
    if (errorElement !== null) {
        errorElement.remove();
    } else {
        return;
    }
}

function printError(id, selectId, errorTxt) {
    removeElement(id);
    addTextError(selectId, errorTxt);
}


function displayGallery() {
    document.querySelector(".gallery").innerHTML = "";
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
}

//Dynamic Gallery display :
displayGallery();


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


    //Modals Events
    document.querySelectorAll(".modal-link").forEach(a => {
        a.addEventListener("click", (openModal))
    })

    document.querySelectorAll(".x-close").forEach(i => {
        i.addEventListener("click", (closeModal))
    })

    document.querySelectorAll(".arrow-prev").forEach(i => {
        i.addEventListener("click", (prevModal))
    })

    document.querySelectorAll(".modal").forEach(modal => {
        modal.addEventListener("click", (e) => {
            if (e.target === modalActive) {
                modalActive.close();
                modalActive.style.display = null;
            }
        });
    })

    deleteWork();

    inputAddPicture.addEventListener("change", renderPreview)
}

formAddPicture.addEventListener("submit", (event) => {
    const formData = new FormData(formAddPicture);
    console.log(formData);
    event.preventDefault();
},
    false,
);

formAddPicture.addEventListener("formdata", (e) => {
    e.preventDefault();
    console.log("fired");
    let data = e.formData;
    for (const value of data.values()) {
        console.log(value);
    }
    const token = sessionStorage.getItem("logToken");
    console.log(token);

    fetch("http://localhost:5678/api/works", {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: data
    })
        .then(response => {
            switch (response.status) {
                case 400:
                    printError("error", "btn-form-add-picture", "Bad Request");
                    break;
                case 401:
                    printError("error", "btn-form-add-picture", "Unauthorized - veuillez vous connecter");
                    break;
                case 500:
                    printError("error", "btn-form-add-picture", "Unexpected Error");
                    break;
                case 201:
                    closeModal();
                    displayGallery();
                    break;
                default:
                    console.log("une erreur inconnue s'est produite")
            }
        })
})

function deleteWork() {
    document.querySelectorAll(".card-trash").forEach(i => {
        i.addEventListener("click", () => {
            const token = sessionStorage.getItem("logToken");
            console.log(token);
    
            fetch("http://localhost:5678/api/works/" + i.id, {
                method: 'DELETE',
                headers: {
                    'accept': '*/*',
                    'Authorization': 'Bearer ' + token
                },
            })
                .then(response => {
                    switch (response.status) {
                        case 401:
                            printError("error", "link-add-picture", "Unauthorized - veuillez vous connecter");
                            break;
                        case 500:
                            printError("error", "link-form-add-picture", "Unexpected Error");
                            break;
                        case 204:
                            fetch("http://localhost:5678/api/works")
                            .then(data => data.json())
                            .then(gallery => {
                                    galleryFull = gallery;
                                    document.querySelector(".gallery").innerHTML = "";
                                    fillGallery(gallery);
                                    addGalleryView(modalActive);})
                            break;
                        default:
                            console.log("une erreur inconnue s'est produite")
                    }
                })
        })
    })
}

function renderPreview(e) {
    const [picture] = e.target.files;
    if (picture) {
        preview.src = URL.createObjectURL(picture);
        inputAddPicture.style.height = "1250%";
        inputAddPicture.style.bottom = "850%";
    }
    inputAddPicture.addEventListener("change", renderPreview);
}

function prevModal() {
    modalPrev.showModal();
    modalPrev.style.display = "flex";
    addGalleryView(modalPrev);
    modalActive.close();
    modalActive.style.display = null;
    modalActive = modalPrev;
}

function closeModal() {
    modalPrev = modalActive;
    modalActive.close();
    modalActive.style.display = null;
    preview.src = "";
    title.value = "";
    cat.value = "";
    inputAddPicture.style.height = "250%";
    inputAddPicture.style.bottom = "180%";
}

function openModal(e) {
    if (modalActive != null && modalActive != undefined && modalActive != "") {
        closeModal();
    }
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute("href"));
    target.showModal();
    target.style.display = "flex";
    addGalleryView(target);
    deleteWork();
    modalActive = target;
}

function addGalleryView(modal) {
    if (modal.id === "modal-gallery") {
        clearGallery(".gallery-view");
        for (let i = 0; i < galleryFull.length; i++) {
            document.querySelector(".gallery-view")
                .innerHTML += `<figure>
                        <div class="card-img">
                            <a id="${galleryFull[i].id}" class="card-trash">
                                <i class="trash fa-sm fa-solid fa-trash-can"></i>
                            </a>
                            <img src="${galleryFull[i].imageUrl}" alt="${galleryFull[i].title}">
                        </div>
                        <p>éditer</p>
                    </figure>`;
        }
        let picture1 = galleryView.firstChild;
        picture1.querySelector(".card-img").innerHTML += `<div class="card-move">
            <i class="move fa-solid fa-arrows-up-down-left-right"></i>
        </div>`;
    }
}