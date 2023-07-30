/*********** Global variables declaration : *********/
var galleryFull = new Array();

//filters' button : 
const buttonAll = document.querySelector("#btn-all");
const buttonObject = document.querySelector("#btn-object");
const buttonAppt = document.querySelector("#btn-appt");
const buttonHotel = document.querySelector("#btn-hotel");
const filters = document.querySelectorAll(".filter");

//Login :
const loginOut = document.querySelector("#login-logout");
const buttonLogin = document.querySelector("#login")

//Modals :
var modalActive;
var modalPrev;
const galleryView = document.querySelector(".gallery-view");
var addedPicture;
const formAddPicture = document.forms.namedItem("add-picture");
const inputAddPicture = document.getElementById("unseen-input-add-picture");
const preview = document.getElementById("preview-picture");
const title = document.getElementById("title");
const cat = document.getElementById("cat");
const inputsFormAddPicture = [inputAddPicture, title, cat];
const btnFormAddPicture = document.getElementById("btn-form-add-picture");


/********** functions declaration : **********/

/********* Gallery display functions : **********/
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

/********* End of gallery display functions **********/

/************* Modal's functions : ****************/

function prevModal() {
    modalPrev.showModal();
    modalPrev.style.display = "flex";
    addGalleryView(modalPrev);
    modalActive.close();
    modalActive.style.display = null;
    modalActive = modalPrev;
}

function clearForm() {
    preview.src = "";
    preview.style.display = null;
    inputAddPicture.value = "";
    title.value = "";
    cat.value = "";
}

function closeModal() {
    modalPrev = modalActive;
    modalActive.close();
    modalActive.style.display = null;
    clearForm();
}

function filterClassJS(arr) {
    return arr.filter(function (target) {
        return target.indexOf("modal");
    })
}

function openModal(e) {
    if (modalActive != null && modalActive != undefined && modalActive != "") {
        closeModal();
    }
    e.preventDefault();
    const target = Object.values(e.target.classList);
    const filteredTarget = filterClassJS(target);
    const dialogBox = document.querySelectorAll("dialog");
    let modalTarget; 
    dialogBox.forEach(el => {
        if(el.classList.contains(filteredTarget[0]) === true) {
            return modalTarget = el
        }
    });
    modalTarget.showModal();
    modalTarget.style.display = "flex";
    addGalleryView(modalTarget);
    btnFormAddPicture.style.backgroundColor = "darkgrey";
    modalActive = modalTarget;
}


function addGalleryView(modal) {
    if (modal.id === "modal-gallery") {
        clearGallery(".gallery-view");
        for (let i = 0; i < galleryFull.length; i++) {
            document.querySelector(".gallery-view")
                .innerHTML += `<figure>
                        <div class="card-img">
                            <a class="card-trash" tabindex="0">
                                <i id="${galleryFull[i].id}" class="trash fa-sm fa-solid fa-trash-can"></i>
                            </a>
                            <img src="${galleryFull[i].imageUrl}" alt="${galleryFull[i].title}">
                        </div>
                        <p>éditer</p>
                    </figure>`;
        }
        let picture1 = galleryView.firstChild;
        picture1.querySelector(".card-img").innerHTML += `<div class="card-move" tabindex="0">
            <i class="move fa-solid fa-arrows-up-down-left-right"></i>
        </div>`;
    }
}

function renderPreview(e) {
    const [picture] = e.target.files;
    if (picture) {
        preview.src = URL.createObjectURL(picture);
        preview.style.display = "block";
    }
    inputAddPicture.addEventListener("change", renderPreview);
}

function deleteWork(id) {
    console.log("enter");
            const token = sessionStorage.getItem("logToken");
            fetch("http://localhost:5678/api/works/" + id, {
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
                                    addGalleryView(modalActive);
                                })
                            break;
                        default:
                            console.log("une erreur inconnue s'est produite")
                    }
                })
}
/**************** End of modal's functions *************/

/************** Errors feature functions **************/
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

function removeError(selector) {
    const errorElement = document.getElementById(selector);
    if (errorElement !== null) {
        errorElement.remove();
    } else {
        return;
    }
}

function printError(selector, selectId, errorTxt) {
    removeError(selector);
    addTextError(selectId, errorTxt);
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
    document.querySelector("#header").insertAdjacentHTML("beforeend",
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
        <a class="modal-link js-modal-gallery" href="#modal-gallery">Modifier</a>
    </div>`)
    document.querySelector("#introduction").insertAdjacentHTML("afterend",
        `<div id="modifier-introduction" class="modifier">
        <i class="fa-solid fa-pen-to-square"></i>
        <a href="#">Modifier</a>
    </div>`)


    /****** Modals Events*****/
    //Navigation with link inside modals
    document.querySelectorAll(".modal-link").forEach(a => {
        a.addEventListener("click", (openModal))
    })
    //Close button
    document.querySelectorAll(".x-close").forEach(i => {
        i.addEventListener("click", (closeModal))
    })
    //Previous button
    document.querySelectorAll(".arrow-prev").forEach(i => {
        i.addEventListener("click", (prevModal))
    })
    //Delete element from gallery & close by clicking outside of modal
    document.querySelectorAll(".modal").forEach(modal => {
        modal.addEventListener("click", (e) => {
            let trash = e.target.classList.contains("trash");
            if (trash === true) {
                let id = e.target.id;
                console.log(id);
                deleteWork(id);
            }
            if (e.target === modalActive) {
                modalActive.close();
                modalActive.style.display = null;
            }
        });
    })


    /***** Add picture input & Preview picture *****/
    inputAddPicture.addEventListener("change", renderPreview);

    btnFormAddPicture.addEventListener("click", (e) => {
        if (inputAddPicture.value != null && inputAddPicture.value != undefined && inputAddPicture.value != ""
        && title.value != null && title.value != undefined && title.value != ""
        && cat.value != null && cat.value != undefined && cat.value != "") {
            removeError("error");
        } else {
            e.preventDefault();
            removeError("error");
            printError("error", "btn-form-add-picture", "Veuillez remplir tous les champs");
        }
    })
    inputsFormAddPicture.forEach(input => {
        input.addEventListener("change", () => {
            if (inputAddPicture.value != null && inputAddPicture.value != undefined && inputAddPicture.value != ""
                && title.value != null && title.value != undefined && title.value != ""
                && cat.value != null && cat.value != undefined && cat.value != "") {
                btnFormAddPicture.style.backgroundColor = "#1D6154";
            } else {
                btnFormAddPicture.style.backgroundColor = "darkgrey";
                
            }
        })
    })


    /******** Add work form *******/
    formAddPicture.addEventListener("submit", (e) => {
        const formData = new FormData(formAddPicture);
        e.preventDefault();
    },
        false,
    );

    formAddPicture.addEventListener("formdata", (e) => {
        e.preventDefault();
        let data = e.formData;
        const token = sessionStorage.getItem("logToken");
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
}