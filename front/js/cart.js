getProductsData();
checkFormAndPostRequest();


function getProductsData() {

  let myApi = "http://localhost:3000/api/products";
  fetch(myApi)
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(async function (requestResults) {

      const products = await requestResults;

      // On créé une fonction qui prend en paramètre l'id du produit et qui renvoie les données correspondantes dont nous aurons besoin (hors ce qui est déja stocké dans le localStorage)
      function getDatasFromId(id) {
        for (let i = 0; i <= products.length; i++) {
          if (id == products[i]._id) {
            let productObject = {
              imageUrlFromSofaNumber: products[i].imageUrl,
              altTxtFromSofaNumber: products[i].altTxt,
              nameFromSofaNumber: products[i].name,
              priceFromSofaNumber: products[i].price
            };
            return productObject;
          }
        }
      }

      // On met en place une boucle qui itère et récupère une partie des données dans le localStorage et l'autre partie grâce à la fonction getDatasFromId.
      // On place les données aux bons endroits
      let cart__items = document.querySelector('#cart__items');
      let parsedLocalStorage = (JSON.parse(localStorage.productsInCart));
      for (let i = 0; i < parsedLocalStorage.length; i++) {
        if (parsedLocalStorage.length != 0) {
          cart__items.innerHTML += '<article class="cart__item" data-id="'
            + parsedLocalStorage[i].id + '" data-color="'
            + parsedLocalStorage[i].color
            + '"><div class="cart__item__img"><img src="'
            + getDatasFromId(parsedLocalStorage[i].id).imageUrlFromSofaNumber + '" alt="'
            + getDatasFromId(parsedLocalStorage[i].id).altTxtFromSofaNumber + '"></div><div class="cart__item__content"><div class="cart__item__content__description"><h2>'
            + getDatasFromId(parsedLocalStorage[i].id).nameFromSofaNumber + '</h2><p>'
            + parsedLocalStorage[i].color
            + '</p><p>'
            + numStr(parseInt(getDatasFromId(parsedLocalStorage[i].id).priceFromSofaNumber)) + ' €</p></div><div class="cart__item__content__settings"><div class="cart__item__content__settings__quantity"><p>Qté : </p><input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="'
            + parsedLocalStorage[i].quantity + '"></div><div class="cart__item__content__settings__delete"><p class="deleteItem">Supprimer</p></div></div></div></article>';
        }
      }

      // On créé une fonction permettant d'afficher la quantité totale de products dans le panier :
      function getTotalQuantity() {
        // On récupère la quantité totale de products dans le panier :  
        var total_quantity = 0;
        for (let i = 0; i < parsedLocalStorage.length; i++) {
          total_quantity += parseInt(parsedLocalStorage[i].quantity);
        }
        return total_quantity;
      }

      // On affiche la quantité totale de products dans le panier au bon endroit : // mettre l'ensemble dans une fonction et appeler à la fin des addEvent listener
      let totalQuantityId = document.querySelector('#totalQuantity');
      totalQuantityId.innerHTML = getTotalQuantity();

      // On créé une fonction permettant de séparer les milliers pour plus de lisibilité :
      function numStr(a, b) {
        a = '' + a;
        b = b || ' ';
        var c = '',
          d = 0;
        while (a.match(/^0[0-9]/)) {
          a = a.substr(1);
        }
        for (var i = a.length - 1; i >= 0; i--) {
          c = (d != 0 && d % 3 == 0) ? a[i] + b + c : a[i] + c;
          d++;
        }
        return c;
      }

      // On créé une fonction permettant d'afficher le montant total du panier :
      function getTotalCartPrice() {
        // On récupère le montant total du panier :  
        var total_price = 0;
        for (let i = 0; i < parsedLocalStorage.length; i++) {
          total_price += ((parsedLocalStorage[i].quantity * getDatasFromId(parsedLocalStorage[i].id).priceFromSofaNumber));
        }
        return total_price;
      }

      getTotalCartPrice();

      // On affiche le montant total du panier au bon endroit :   
      let totalPriceId = document.querySelector('#totalPrice');
      totalPriceId.innerHTML = numStr(parseInt(getTotalCartPrice()));

      // On intervient à la modification du sélecteur de quantités :
      let allItemQuantity = document.querySelectorAll(".itemQuantity");
      allItemQuantity.forEach(element =>
        element.addEventListener('change', function () {
          let quantityBeforeChange = parseInt(element.getAttribute('value'));
          // On met à jour le DOM instantanément à chaque modification sur le sélecteur de quantité :
          element.setAttribute('value', this.value);
          // On vérifie si l'utilisateur a ajouté ou retiré un produit et combien de fois :
          let quantityAfterChange = parseInt(element.getAttribute('value'));
          let oldItems = JSON.parse(localStorage.getItem('productsInCart'));
          let oldTotalQuantity = 0;
          for (var z in oldItems) {
            oldTotalQuantity += parseInt(oldItems[z].quantity);
          }
          let oldTotalPrice = 0;
          for (let r = 0; r < oldItems.length; r++) {
            oldTotalPrice += ((oldItems[r].quantity * getDatasFromId(oldItems[r].id).priceFromSofaNumber));
          }
          // On met à jour le localStorage avec la même valeur :
          let elementId = element.parentElement.parentElement.parentElement.parentElement.getAttribute('data-id');
          let elementColor = element.parentElement.parentElement.parentElement.parentElement.getAttribute('data-color');
          const afterFilter = oldItems.filter(item => item.id === elementId && item.color === elementColor);
          let indexWanted = oldItems.indexOf(afterFilter[0]);
          oldItems[indexWanted].quantity = element.getAttribute('value');
          localStorage.setItem('productsInCart', JSON.stringify(oldItems));
          // On met à jour la quantité d'article du panier :
          let totalQuantityId = document.querySelector('#totalQuantity');
          if (quantityAfterChange > quantityBeforeChange) {
            totalQuantityId.innerHTML = parseInt(oldTotalQuantity) + 1;
          }
          else {
            totalQuantityId.innerHTML = parseInt(oldTotalQuantity) - 1;
          }
          // On met à jour le prix total du panier :
          let newItems = JSON.parse(localStorage.getItem('productsInCart'));
          if (quantityAfterChange > quantityBeforeChange) {
            new_total_price = oldTotalPrice + parseInt(getDatasFromId(newItems[indexWanted].id).priceFromSofaNumber);
          }
          else {
            new_total_price = oldTotalPrice - parseInt(getDatasFromId(newItems[indexWanted].id).priceFromSofaNumber);
          }
          let totalPriceId = document.querySelector('#totalPrice');
          totalPriceId.innerHTML = numStr(parseInt(new_total_price));
        }
        )
      );

      // On intervient au clic du bouton "Supprimer"
      let deleteItem = document.querySelectorAll(".deleteItem");
      deleteItem.forEach(element =>
        element.addEventListener('click', () => {
          // let thisQuantity = element.parentElement.parentElement.children[0].children[1].getAttribute('value');
          // On met à jour le DOM instantanément à chaque clic du bouton "Supprimer":
          let cartItem = element.parentElement.parentElement.parentElement.parentElement;
          cartItem.remove();
          // On met à jour le localStorage pour chaque suppression : 
          let oldItems = JSON.parse(localStorage.getItem('productsInCart'));
          let elementId = element.parentElement.parentElement.parentElement.parentElement.getAttribute('data-id');
          let elementColor = element.parentElement.parentElement.parentElement.parentElement.getAttribute('data-color');
          const afterFilter = oldItems.filter(item => item.id === elementId && item.color === elementColor);
          let indexWanted = oldItems.indexOf(afterFilter[0]);
          // let totalPriceDeleted = parseInt((thisQuantity * getDatasFromId(oldItems[indexWanted].id).priceFromSofaNumber));
          // console.log(totalPriceDeleted);
          oldItems.splice(indexWanted, 1);
          localStorage.setItem('productsInCart', JSON.stringify(oldItems));
          // On met à jour la quantité d'article du panier :
          let totalQuantityAfterDelete = 0;
          for (var y in oldItems) {
            totalQuantityAfterDelete += parseInt(oldItems[y].quantity);
          }
          let totalQuantityId = document.querySelector('#totalQuantity');
          totalQuantityId.innerHTML = totalQuantityAfterDelete;
          // On met à jour le prix total du panier :
          let newTotalPrice = 0;
          for (let x = 0; x < oldItems.length; x++) {
            newTotalPrice += ((oldItems[x].quantity * getDatasFromId(oldItems[x].id).priceFromSofaNumber));
          }
          let totalPriceId = document.querySelector('#totalPrice');
          totalPriceId.innerHTML = numStr(parseInt(newTotalPrice));
        }
        )
      )

    }
    )

    .catch((err) => {
      alert("Il y a eu une erreur : " + err);
    });
  ;
}

let localStorageConfirmed = JSON.parse(localStorage.getItem('productsInCart'));

for (let i = 0; i < localStorageConfirmed.length; i++) {
  delete localStorageConfirmed[i].color;
  delete localStorageConfirmed[i].quantity;
}

let arrayWithOnlyIds = [];
for (let i = 0; i < localStorageConfirmed.length; i++) {
  let allIds = '';
  allIds += localStorageConfirmed[i].id;
  arrayWithOnlyIds.push(allIds);
}

async function checkFormAndPostRequest() {

  // On récupère les emplacements des champs d'inputs depuis le DOM :

  let inputFirstName = document.querySelector('#firstName');
  let inputLastName = document.querySelector('#lastName');
  let inputAddress = document.querySelector('#address');
  let inputCity = document.querySelector('#city');
  let inputEmail = document.querySelector('#email');
  const submit = document.querySelector('#order');

  let firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
  let lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
  let addressErrorMsg = document.querySelector("#addressErrorMsg");
  let cityErrorMsg = document.querySelector("#cityErrorMsg");
  let emailErrorMsg = document.querySelector("#emailErrorMsg");


  submit.addEventListener("click", (e) => {
    e.preventDefault();
    // Si le formulaire est valide, on créé un objet qui contiendra :
    // 1. 1 tableau qui contiendra les produits confirmés 
    // 2. 1 objet avec les données client du formulaire

    if (
      !inputFirstName.value ||
      !inputLastName.value ||
      !inputAddress.value ||
      !inputCity.value ||
      !inputEmail.value
    ) {
      firstNameErrorMsg.innerHTML = "Vous devez renseigner tous les champs !";
      lastNameErrorMsg.innerHTML = "Vous devez renseigner tous les champs !";
      addressErrorMsg.innerHTML = "Vous devez renseigner tous les champs !";
      cityErrorMsg.innerHTML = "Vous devez renseigner tous les champs !";
      emailErrorMsg.innerHTML = "Vous devez renseigner tous les champs !";
      e.preventDefault();
    }
    else {
      const order = {
        contact: {
          firstName: inputFirstName.value.toString(),
          lastName: inputLastName.value.toString(),
          address: inputAddress.value.toString(),
          city: inputCity.value.toString(),
          email: inputEmail.value.toString()
        },
        products: arrayWithOnlyIds,
      };
      console.log(order);
    }
  }
  )
    ;

  // -------  Envoi de la requête POST au back-end --------

/*   const options = {
    method: "POST",
    body: JSON.stringify(order),
    headers: { "Content-Type": "application/json" },
  };

  fetch('http://localhost:3000/api/products/order', options)
    .then((response) => response.json())
    .then((orderId) => {
      console.log(orderId);
    })
    .catch((err) => {
      alert("Il y a eu une erreur : " + err);
    }); */
}


