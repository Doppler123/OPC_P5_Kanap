
// On requête l'API pour récupérer tous les produits :
all_products_from_API();

function all_products_from_API() {

  fetch("http://localhost:3000/api/products")

    // On vérifie que la requête s'est bien déroulée :
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })

    // On récupère les résultats de la requête à l'API :
    .then(function (requestResults) {
      var sofas = requestResults;
      console.log(sofas);

      // On créé une fonction qui permet de récupérer le numéro du produit dans l'array venu de l'API à partir du numéro du produit dans le local storage
      function get_product_number(i) {
        for (let x = 0; x < 8; x++) {
          if ((sofas[x]._id) == (JSON.parse(localStorage.getItem('product_' + i + '')).id)) {
            return x;
          }
        }
      }

      // On créé une fonction qui, en utilisant la fonction précédente, va récupérer les données manquantes pour chaque produit du local storage (et retourner un array avec ces données)
      function getData(i) {
        var product_imageUrl = [];
        product_imageUrl[i] = sofas[get_product_number(i)].imageUrl;
        var product_altTxt = [];
        product_altTxt[i] = sofas[get_product_number(i)].altTxt;
        var product_name = [];
        product_name[i] = sofas[get_product_number(i)].name;
        var product_price = [];
        product_price[i] = sofas[get_product_number(i)].price;
        {
          return [product_imageUrl[i], product_altTxt[i], product_name[i], product_price[i]];
        }
      }

      // On récupère la quantité totale de products dans le panier :  
      var total_quantity = 0;
      for (let i = 1; i <= localStorage.length; i++) {
        total_quantity += (JSON.parse(localStorage.getItem('product_' + (i) + '')).quantity);
      }

      // On affiche la quantité totale de products dans le panier au bon endroit :
      let totalQuantityId = document.querySelector('#totalQuantity');
      totalQuantityId.innerHTML = total_quantity;

      // On récupère le montant total du panier :  
      var total_price = 0;
      for (let i = 1; i <= localStorage.length; i++) {
        total_price += ((JSON.parse(localStorage.getItem('product_' + (i) + '')).quantity) * getData(i)[3]);
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
        for (var i = a.length-1; i >= 0; i--) {
          c = (d != 0 && d % 3 == 0) ? a[i] + b + c : a[i] + c;
          d++;
        }
        return c;
      }

      // On affiche le montant total du panier au bon endroit :
      let totalPriceId = document.querySelector('#totalPrice');
      totalPriceId.innerHTML = numStr(total_price);

      // On met en place une boucle qui vient itérer sur chaque produit dans le local storage et on récupère les bonnes données aux bons endroits :
      let cart__items = document.querySelector('#cart__items');

      for (let i = 1; i <= localStorage.length; i++) {
        cart__items.innerHTML += '<article class="cart__item" data-id="'
          + (JSON.parse(localStorage.getItem('product_' + i + '')).id) + '" data-color="'
          + (JSON.parse(localStorage.getItem('product_' + i + '')).color)
          + '"><div class="cart__item__img"><img src="'
          + getData(i)[0] + '" alt="'
          + getData(i)[1] + '"></div><div class="cart__item__content"><div class="cart__item__content__description"><h2>'
          + getData(i)[2] + '</h2><p>'
          + (JSON.parse(localStorage.getItem('product_' + i + '')).color)
          + '</p><p>'
          + getData(i)[3] + ' €</p></div><div class="cart__item__content__settings"><div class="cart__item__content__settings__quantity"><p>Qté : </p><input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="'
          + (JSON.parse(localStorage.getItem('product_' + i + '')).quantity) + '"></div><div class="cart__item__content__settings__delete"><p class="deleteItem">Supprimer</p></div></div></div></article>';
      } 

      let itemQuantity = document.querySelector(".itemQuantity");
      
      itemQuantity.addEventListener('change', function () {
      itemQuantity.setAttribute('value', this.value);  
      }); 
       
    }
    )

    .catch(function (err) {
      // Une erreur est survenue
    })
    ;
}




