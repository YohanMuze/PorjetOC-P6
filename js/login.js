//Global variables declaration :
const buttonLogin = document.querySelector(".form-login__btn");
const error401Txt = "La combinaison E-mail/mot de passe est incorrect";
const error404Txt = "Utilisateur inconnu";
const errorEmptyFieldTxt = "Veuillez saisir une adresse E-mail et un mot de passe";
var submittedEmail = "";
var submittedPassword = "";

//Functions declaration :
function checkVar(variable) {
  if(variable === undefined || variable === null || variable === "") {
    throw new Error("Empty field(s)");
  }
}

function addTextError(errorTxt) {
  document.getElementById("password").insertAdjacentHTML("afterend",
  `<p id="error" class="error-txt">${errorTxt}</p>`);
}

function removeElement(selector) {
  const errorElement = document.getElementById(selector);
  if(errorElement !== null) {
    errorElement.remove();
  } else {
    return;
  }
}

function printError(id, errorTxt) {
  removeElement(id);
  addTextError(errorTxt);
}

//"Se connecter" button :
buttonLogin.addEventListener("click", function(event) {
  submittedEmail = document.getElementById("email").value;
  submittedPassword = document.getElementById("password").value;
  let submitted = {
    email : submittedEmail,
    password : submittedPassword,
  }
  try {
    checkVar(submittedEmail);
    checkVar(submittedPassword);
    //API login request :
    fetch("http://localhost:5678/api/users/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify (submitted)
    })
    .then(response => {
      switch (response.status) {
        case 401:
          printError("error", error401Txt);
        break;
        case 404:
          printError("error", error404Txt);
        break;
        case 200:
          response = response.json();
          response.then(authentication => {
            var token = authentication.token;
            sessionStorage.setItem("logToken", token);
            document.location.href="./index.html";
          })
        break;
        default: 
          console.log("une erreur inconnue s'est produite")
        }
      })
    }
  catch(e) {
    console.error(e.message);
    printError("error", errorEmptyFieldTxt);
  }
  event.preventDefault();
});