// On ajoute à la page "cart" la prise en compte du fichier utils.js :
let path = "../js/utils.js";
let script = document.createElement("script");
script.src = path;
document.body.appendChild(script);

// Si le panier est vide au chargement de la page, on affiche "0 article" et "0 €" et on envoie un message d'alerte à l'utilisateur, sinon, on appelle les fonctions gérant les requêtes :
if (localStorage.getItem('productsInCart') === null || localStorage.getItem('productsInCart') == '[]') {
  let totalQuantityPosition = document.querySelector('#totalQuantity');
  let totalPricePosition = document.querySelector('#totalPrice');
  totalQuantityPosition.textContent = '0';
  totalPricePosition.textContent = '0';
  alert('Votre panier est vide pour le moment!');
}
else {
  getRequestAndDisplayData();
  postRequestIfFormOk();
}

function getRequestAndDisplayData() {

  let myApi = "http://localhost:3000/api/products";
  fetch(myApi)
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })

    .then(async function (requestResults) {

      const products = await requestResults;

      // On créé une fonction qui prend en paramètre l'id du produit et qui renvoie les données correspondantes dont nous aurons besoin (hors ce qui est déja stocké dans le localStorage) :
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
      // On place les données aux bons endroits :
      let cartItems = document.querySelector('#cart__items');
      let parsedLocalStorage = (JSON.parse(localStorage.productsInCart));
      for (let i = 0; i < parsedLocalStorage.length; i++) {
        cartItems.innerHTML += '<article class="cart__item" data-id="'
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

      // On créé une variable qui contient le nombre total d'article :
      let totalQuantity = 0;
      for (let i = 0; i < parsedLocalStorage.length; i++) {
        totalQuantity += parseInt(parsedLocalStorage[i].quantity);
      }

      // On affiche la quantité totale de products dans le panier au bon endroit : 
      let totalQuantityId = document.querySelector('#totalQuantity');
      totalQuantityId.innerHTML = totalQuantity;

      // On créé une variable qui contiendra le résultat du calcul du montant total du panier : 
      let totalPrice = 0;
      for (let i = 0; i < parsedLocalStorage.length; i++) {
        totalPrice += ((parsedLocalStorage[i].quantity * getDatasFromId(parsedLocalStorage[i].id).priceFromSofaNumber));
      }

      // On affiche le montant total du panier au bon endroit :   
      let totalPriceId = document.querySelector('#totalPrice');
      totalPriceId.innerHTML = numStr(parseInt(totalPrice));

      // On intervient à la modification du sélecteur de quantités :
      let allItemQuantity = document.querySelectorAll(".itemQuantity");
      allItemQuantity.forEach(element =>
        element.addEventListener('change', function () {
          let quantityBeforeChange = parseInt(element.getAttribute('value'));
          // On met à jour le DOM instantanément à chaque modification sur le sélecteur de quantité :
          element.setAttribute('value', this.value);
          // On vérifie si l'utilisateur a ajouté ou retiré un produit et combien :
          let quantityAfterChange = parseInt(element.getAttribute('value'));
          let oldItems = JSON.parse(localStorage.getItem('productsInCart'));
          let oldTotalQuantity = 0;
          for (let z in oldItems) {
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
            priceAfterUpdate = oldTotalPrice + parseInt(getDatasFromId(newItems[indexWanted].id).priceFromSofaNumber);
          }
          else {
            priceAfterUpdate = oldTotalPrice - parseInt(getDatasFromId(newItems[indexWanted].id).priceFromSofaNumber);
          }
          let totalPriceId = document.querySelector('#totalPrice');
          totalPriceId.innerHTML = numStr(parseInt(priceAfterUpdate));
        }
        )
      );

      // On intervient au clic du bouton "Supprimer"
      let deleteItem = document.querySelectorAll(".deleteItem");
      deleteItem.forEach(element =>
        element.addEventListener('click', () => {
          // On met à jour le DOM instantanément à chaque clic du bouton "Supprimer":
          let cartItem = element.parentElement.parentElement.parentElement.parentElement;
          cartItem.remove();
          // On met à jour le localStorage pour chaque suppression : 
          let oldItems = JSON.parse(localStorage.getItem('productsInCart'));
          let elementId = element.parentElement.parentElement.parentElement.parentElement.getAttribute('data-id');
          let elementColor = element.parentElement.parentElement.parentElement.parentElement.getAttribute('data-color');
          const afterFilter = oldItems.filter(item => item.id === elementId && item.color === elementColor);
          let indexWanted = oldItems.indexOf(afterFilter[0]);
          oldItems.splice(indexWanted, 1);
          localStorage.setItem('productsInCart', JSON.stringify(oldItems));
          // On met à jour la quantité d'article du panier :
          let totalQuantityAfterDelete = 0;
          for (let y in oldItems) {
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

// On créé la fonction qui va vérifier la validité du formulaire et envoyer la requête POST à l'API si valide (au clic du bouton "Commander !") :
async function postRequestIfFormOk() {

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

    let localStorageConfirmed = JSON.parse(localStorage.getItem('productsInCart'));

    let arrayWithOnlyIds = [];
    for (let i = 0; i < localStorageConfirmed.length; i++) {
      let allIds = '';
      allIds += localStorageConfirmed[i].id;
      arrayWithOnlyIds.push(allIds);
    }

    // Si le formulaire est valide, on créé un objet qui contiendra (conformément à la doc de l'API):
    // 1. 1 objet qui contiendra les données client du formulaire (sous forme de strings)
    // 2. 1 tableau qui contiendra uniquement les Ids des produits confirmés (sous forme de strings)

    let regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    let regexEmailTested = regexEmail.test(inputEmail.value);

    if (
      !inputFirstName.value ||
      !inputLastName.value ||
      !inputAddress.value ||
      !inputCity.value ||
      !inputEmail.value
    ) {
      if (!inputFirstName.value) {
        firstNameErrorMsg.innerHTML = "Il faut compléter le formulaire en entier pour passer commande";
      }
      if (!inputLastName.value) {
        lastNameErrorMsg.innerHTML = "Il faut compléter le formulaire en entier pour passer commande";
      }
      if (!inputAddress.value) {
        addressErrorMsg.innerHTML = "Il faut compléter le formulaire en entier pour passer commande";
      }
      if (!inputCity.value) {
        cityErrorMsg.innerHTML = "Il faut compléter le formulaire en entier pour passer commande";
      }
      if (!inputEmail.value) {
        emailErrorMsg.innerHTML = "Il faut compléter le formulaire en entier pour passer commande";
      }
      e.preventDefault();
    }

    else if (regexEmailTested === false) {
      emailErrorMsg.innerHTML = "Adresse email invalide...";
    }

    else {
      const orderDatas = {
        contact: {
          firstName: inputFirstName.value.toString(),
          lastName: inputLastName.value.toString(),
          address: inputAddress.value.toString(),
          city: inputCity.value.toString(),
          email: inputEmail.value.toString()
        },
        products: arrayWithOnlyIds,
      };

      // Si le panier n'est pas vide, on envoie l'objet "orderDatas" via une reqûete POST pour récupérer l'orderId de l'API puis rediriger l'utilisateur vers la page de confirmation :
      if (localStorageConfirmed !== 'undefined' && (localStorageConfirmed.length) > 0) {

        fetch("http://localhost:3000/api/products/order", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderDatas),
        })
          .then(function (res) {
            if (res.ok) {
              return res.json();
            }
          })
          .then(function (orderInfos) {
            localStorage.clear();
            document.location.href = 'confirmation.html?orderId=' + orderInfos.orderId + '';
          })
          .catch((err) => {
            alert("Il y a eu une erreur : " + err);
          });
      }
      else {
        alert('Votre panier est vide pour le moment!');
      }
    }
  }
  )
    ;

}




