// On requête l'API pour récupérer uniquement le produit dont l'id est dans l'url de la page :

getProductsData();

function getProductsData() {

let myApi = "http://localhost:3000/api/products";
fetch(myApi)
.then((response) => response.json())
.then(async function (requestResults) {
  const products = await requestResults;
  console.log(products[2]._id);  
})
}






  


// console.log(getProductbyId('055743915a544fde83cfdfc904935ee7').then(function(data){return data;}));


let localStorageTest;
localStorageTest = (JSON.parse(localStorage.getItem('productsInCart')));
// console.log(localStorageTest);

// On met en place une boucle qui vient itérer sur chaque produit dans le local storage et on récupère les bonnes données aux bons endroits :
let cart__items = document.querySelector('#cart__items');

for (let i = 1; i <= localStorageTest.length; i++) {
  cart__items.innerHTML += '<article class="cart__item" data-id="'
    + (localStorageTest[i].id) + '" data-color="'
    + (localStorageTest[i].color)
    + '"><div class="cart__item__img"><img src="'
    + getData(i)[0] + '" alt="'
    + getData(i)[1] + '"></div><div class="cart__item__content"><div class="cart__item__content__description"><h2>'
    + getData(i)[2] + '</h2><p>'
    + (localStorageTest[i].color)
    + '</p><p>'
    + getData(i)[3] + ' €</p></div><div class="cart__item__content__settings"><div class="cart__item__content__settings__quantity"><p>Qté : </p><input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="'
    + (localStorageTest[i].quantity) + '"></div><div class="cart__item__content__settings__delete"><p class="deleteItem">Supprimer</p></div></div></div></article>';
}  
