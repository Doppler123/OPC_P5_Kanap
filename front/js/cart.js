getProductsData();

function getProductsData() {

  let myApi = "http://localhost:3000/api/products";
  fetch(myApi)
    .then((response) => response.json())
    .then(async function (requestResults) {

      const products = await requestResults;

      // On créé une fonction qui prend en paramètre l'id du produit et qui renvoie les données correspondantes dont nous aurons besoin (hors ce qui est déja stocké dans le localStorage)
      function getDatasFromId(id) {
        for (let i = 0; i <= products.length; i++) {
          if (id == products[i]._id) {
            let imageUrlFromSofaNumber = products[i].imageUrl;
            let altTxtFromSofaNumber = products[i].altTxt;
            let nameFromSofaNumber = products[i].name;
            let priceFromSofaNumber = products[i].price;
            return [imageUrlFromSofaNumber, altTxtFromSofaNumber, nameFromSofaNumber, priceFromSofaNumber];
          }
        }
      }

      // On met en place une boucle qui itère et récupère une partie des données dans le localStorage et l'autre partie grâce à la fonction getDatasFromId.
      // On place les données aux bons endroits
      let cart__items = document.querySelector('#cart__items');
      let parsedLocalStorage = (JSON.parse(localStorage.productsInCart));
      for (let i = 0; i < parsedLocalStorage.length; i++) {
        if (parsedLocalStorage[i].quantity != 0) {
          cart__items.innerHTML += '<article class="cart__item" data-id="'
            + parsedLocalStorage[i].id + '" data-color="'
            + parsedLocalStorage[i].color
            + '"><div class="cart__item__img"><img src="'
            + getDatasFromId(parsedLocalStorage[i].id)[0] + '" alt="'
            + getDatasFromId(parsedLocalStorage[i].id)[1] + '"></div><div class="cart__item__content"><div class="cart__item__content__description"><h2>'
            + getDatasFromId(parsedLocalStorage[i].id)[2] + '</h2><p>'
            + parsedLocalStorage[i].color
            + '</p><p>'
            + getDatasFromId(parsedLocalStorage[i].id)[3] + ' €</p></div><div class="cart__item__content__settings"><div class="cart__item__content__settings__quantity"><p>Qté : </p><input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="'
            + parsedLocalStorage[i].quantity + '"></div><div class="cart__item__content__settings__delete"><p class="deleteItem">Supprimer</p></div></div></div></article>';
        }
      }

      // On récupère la quantité totale de products dans le panier :  
      var total_quantity = 0;
      for (let i = 0; i < parsedLocalStorage.length; i++) {
        total_quantity += parseInt(parsedLocalStorage[i].quantity);
      }

      // On affiche la quantité totale de products dans le panier au bon endroit :
      let totalQuantityId = document.querySelector('#totalQuantity');
      totalQuantityId.innerHTML = total_quantity;

      // On récupère le montant total du panier :  
      var total_price = 0;
      for (let i = 0; i < parsedLocalStorage.length; i++) {
        total_price += ((parsedLocalStorage[i].quantity * getDatasFromId(parsedLocalStorage[i].id)[3]));
      }

      // On ajoute une fonction permettant de séparer les milliers pour plus de lisibilité :
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

      // On affiche le montant total du panier au bon endroit :
      let totalPriceId = document.querySelector('#totalPrice');
      totalPriceId.innerHTML = numStr(total_price);


      // On intervient à la modification du sélecteur de quantités :
      let allItemQuantity = document.querySelectorAll(".itemQuantity");
      allItemQuantity.forEach(element =>
        element.addEventListener('change', function () {
          // On met à jour le DOM instantanément à chaque modification sur le sélecteur de quantité :
          element.setAttribute('value', this.value);
          // On met à jour le localStorage avec la même valeur :
          let elementId = element.parentElement.parentElement.parentElement.parentElement.getAttribute('data-id');
          let elementColor = element.parentElement.parentElement.parentElement.parentElement.getAttribute('data-color');
          var oldItems = JSON.parse(localStorage.getItem('productsInCart'));
          const afterIdFilter = oldItems.filter(item => item.id === elementId);
          const afterColorFilter = afterIdFilter.filter(items => items.color === elementColor);
          var indexWanted = oldItems.indexOf(afterColorFilter[0]);
          oldItems[indexWanted].quantity = element.getAttribute('value');
          localStorage.setItem('productsInCart', JSON.stringify(oldItems));
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
          let elementId = element.parentElement.parentElement.parentElement.parentElement.getAttribute('data-id');
          let elementColor = element.parentElement.parentElement.parentElement.parentElement.getAttribute('data-color');
          var oldItems = JSON.parse(localStorage.getItem('productsInCart'));
          const afterIdFilter = oldItems.filter(item => item.id === elementId);
          const afterColorFilter = afterIdFilter.filter(items => items.color === elementColor);
          var indexWanted = oldItems.indexOf(afterColorFilter[0]);
          oldItems[indexWanted].quantity = 0;
          localStorage.setItem('productsInCart', JSON.stringify(oldItems));
        }
        )
      )
    }
    )
}


