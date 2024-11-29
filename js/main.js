var siteName = document.getElementById("siteName");
var siteUrl = document.getElementById("siteUrl");
var row = document.getElementById("row");
var availableWebsites=document.getElementById("availableWebsites");
var addBtn = document.getElementById("addBtn");
var updateBtn = document.getElementById("updateBtn");
var siteSearch = document.getElementById("siteSearch");
var nameErrorMessage = document.getElementById("nameErrorMessage");
var nameErrorMessage2 = document.getElementById("nameErrorMessage2");
var urlErrorMessage = document.getElementById("urlErrorMessage");
var urlRules = document.getElementById("urlRules");
var nameEmptyError=document.getElementById("nameEmptyError");
var urlEmptyError=document.getElementById("urlEmptyError");

var globalIndex;
var siteList;
if (localStorage.getItem("siteList")) {
  siteList = JSON.parse(localStorage.getItem("siteList"));
  displaySites(siteList);
} else {
  siteList = [];
}

// Function Add Site
addBtn.addEventListener("click", function () {
  if(emptyName() && emptyUrl()){
  addSite();
  }
});

function addSite() {
  if (siteNameValidation() && siteUrlValidation()) {
    var sites = {
      name: siteName.value,
      Url: siteUrl.value,
    };

    siteList.push(sites);
    displaySites(siteList);
    clearInputs();
    saveToLocalStorage();
    siteName.classList.remove("is-valid");
    siteUrl.classList.remove("is-valid");
  } else {
    console.log("error");
  }
}

// Function Display Sites
function displaySites(sList, term = 0) {
  if (sList.length > 0) {
    var cartoona = "";
    for (var i = 0; i < sList.length; i++) {
      cartoona += `<div class="col">
      <div class="index ">${i + 1}</div>
    </div>
    <div class="col"><div class="name ">${sList[i].name}</div></div>
    <div class="col">
      <div class="visite">
        <a href="${
          sList[i].Url
        }" target="_blank"><button class="btn visiteBtn"><i class="fa-solid fa-eye me-0 me-lg-1"></i> Visite</button></a>
      </div>
    </div>
    <div class="col">
      <div class="delete">
        <button onclick="deleteSite(${i})" class="btn deleteBtn"><i class="fa-solid fa-trash-can me-0 me-lg-1"></i> Delete</button>
      </div>
    </div>
    <div class="col">
      <div onclick="setFormToUpdate(${i})" class="update"><button class="btn updateBtn"><i class="fa-solid fa-arrows-rotate me-0 me-lg-1 "></i> Update</button></div>
    </div>`;
    }
    row.innerHTML = cartoona;
    availableWebsites.style.border = "2px solid #edd66c";
    document.getElementById("staticRow").classList.remove("d-none");

  } 
  else if (sList.length === 0 && term === 0) {
    row.innerHTML = "";
  } else {
    row.innerHTML = `<div class="w-100 not-found text-center mt-5">
    <img src="./images/not-found.png"  alt="notfound image">
    <p class="mt-4">Oops,Not found what you're looking for</p>
  </div>`;
  availableWebsites.style.border = "none";
  document.getElementById("staticRow").classList.add("d-none");

  }
}

// Function Clear Inputs After Add Site
function clearInputs() {
  siteName.value = null;
  siteUrl.value = null;
}

// Function Save To Local Storage
function saveToLocalStorage() {
  localStorage.setItem("siteList", JSON.stringify(siteList));
}

// Function Delete Site
function deleteSite(index) {
  siteList.splice(index, 1);
  displaySites(siteList);
  saveToLocalStorage();
}

// Function Set Form To Update
function setFormToUpdate(index) {
  globalIndex = index;
  siteName.value = siteList[index].name;
  siteUrl.value = siteList[index].Url;
  addBtn.classList.add("d-none");
  updateBtn.classList.remove("d-none");
}

// Function Update Site
updateBtn.addEventListener("click", function () {
  if (siteNameValidation() && siteUrlValidation()) {
    updateSite();
  }
});
function updateSite() {
  siteList[globalIndex].name = siteName.value;
  siteList[globalIndex].Url = siteUrl.value;
  displaySites(siteList);
  saveToLocalStorage();
  clearInputs();
  addBtn.classList.remove("d-none");
  updateBtn.classList.add("d-none");
  siteName.classList.remove("is-valid");
  siteUrl.classList.remove("is-valid");
}

// Function To Search Site
siteSearch.addEventListener("input", function () {
  searchSite();
});
function searchSite() {
  var term = siteSearch.value;
  var searchList = [];
  for (var i = 0; i < siteList.length; i++) {
    if (siteList[i].name.toLowerCase().includes(term.toLowerCase())) {
      searchList.push(siteList[i]);
    } else {
      console.log("not match");
    }
    displaySites(searchList, term);
  }
}

// Function Site Name Validation
siteName.addEventListener("input", function () {
  siteNameValidation();
});
function siteNameValidation() {
  var regex = /^[A-Za-z0-9]{3,}$/;

  // Check if the user wants to keep the same name during Updating
  if (
    globalIndex !== undefined &&
    siteName.value === siteList[globalIndex].name
  ) {
    // Mark as valid and skip further validation
    siteName.classList.remove("is-invalid");
    siteName.classList.add("is-valid");
    nameErrorMessage.classList.replace("d-block", "d-none");
    nameErrorMessage2.classList.replace("d-block", "d-none");
    return true;
  }

  // Regex validation for the site name
  if (regex.test(siteName.value)) {
    nameErrorMessage.classList.replace("d-block", "d-none");
    nameEmptyError.classList.replace("d-block", "d-none");

  } else {
    nameEmptyError.classList.replace("d-block", "d-none");
    nameErrorMessage.classList.replace("d-none", "d-block");
    nameErrorMessage2.classList.replace("d-block", "d-none");
    siteName.classList.add("is-invalid");
    return false;
  }

  // Check for duplicate names
  for (var i = 0; i < siteList.length; i++) {
    if (siteList[i].name.toLowerCase() === siteName.value.toLowerCase()) {
      siteName.classList.add("is-invalid");
      siteName.classList.remove("is-valid");
      nameErrorMessage2.classList.replace("d-none", "d-block");
      return false;
    }
  }
  nameErrorMessage2.classList.replace("d-block", "d-none");
  siteName.classList.add("is-valid");
  siteName.classList.remove("is-invalid");
  return true;
}

// Function Site URL Validation
siteUrl.addEventListener("input", function () {
  siteUrlValidation();
});
function siteUrlValidation() {
  var regex = /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\/?$/;

  // Check if the user wants to keep the same URL during Updating
  if (
    globalIndex !== undefined &&
    siteUrl.value === siteList[globalIndex].Url
  ) {
    // Mark as valid and skip further validation
    siteUrl.classList.remove("is-invalid");
    siteUrl.classList.add("is-valid");
    urlErrorMessage.classList.replace("d-block", "d-none");
    urlRules.classList.replace("d-block", "d-none");
    return true;
  }

  // Regex validation for the site URL
  if (regex.test(siteUrl.value)) {
    urlRules.classList.replace("d-block", "d-none");
    urlEmptyError.classList.replace("d-block", "d-none");
  } else {
    urlRules.classList.replace("d-none", "d-block");
    urlEmptyError.classList.replace("d-block", "d-none");
    urlErrorMessage.classList.replace("d-block", "d-none");
    siteUrl.classList.add("is-invalid");

    return false;
  }

  // Check for duplicate URLS
  for (var i = 0; i < siteList.length; i++) {
    if (siteList[i].Url === siteUrl.value) {
      siteUrl.classList.add("is-invalid");
      siteUrl.classList.remove("is-valid");
      urlErrorMessage.classList.replace("d-none", "d-block");
      return false;
    }
  }
  urlErrorMessage.classList.replace("d-block", "d-none");
  siteUrl.classList.add("is-valid");
  siteUrl.classList.remove("is-invalid");
  return true;
}


function emptyName(){
  if(siteName.value === "" ){
    nameErrorMessage.classList.replace("d-block", "d-none");
    nameEmptyError.classList.replace("d-none", "d-block");
return false;
  }else{
    nameEmptyError.classList.replace("d-block", "d-none");
    return true;
  }
}
function emptyUrl(){
  if(siteUrl.value === "" ){
    urlRules.classList.replace("d-block", "d-none");
    urlEmptyError.classList.replace("d-none", "d-block");
return false;
  }else{
    urlEmptyError.classList.replace("d-block", "d-none");
    return true;
  }
}