// On récupère l'id du produit dans l'url de la page courrante :

let currentUrl = document.location.href;
let url = new URL(currentUrl);
let searchParams = new URLSearchParams(url.search);
if (searchParams.has('id')) {
  let idCollected = searchParams.get('id');
  var idCollectedWoSpace = idCollected.replace(/ /g, '');
}

// On requête l'API pour récupérer uniquement le produit dont l'id est dans l'url de la page :

oneProductFromAPI();

function oneProductFromAPI() {

  fetch("http://localhost:3000/api/products/" + idCollectedWoSpace)

    // On vérifie que la requête s'est bien déroulée :
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })

    // On récupère les résultats de la requête à l'API :
    .then(function (requestResults) {
      const product = requestResults;
      console.log(product);

      // On créé une fonction permettant de séparer les milliers pour plus de lisibilité :
      function numStr(a, b) {
        a = '' + a;
        b = b || ' ';
        let c = '',
          d = 0;
        while (a.match(/^0[0-9]/)) {
          a = a.substr(1);
        }
        for (let i = a.length - 1; i >= 0; i--) {
          c = (d != 0 && d % 3 == 0) ? a[i] + b + c : a[i] + c;
          d++;
        }
        return c;
      }

      // On insère les données selon ce qui est commenté dans le fichier HTML :
      let productImage = document.querySelector('.item__img');
      productImage.innerHTML = '<img src="' + product.imageUrl + '">';

      let productName = document.querySelector('#title');
      productName.textContent = '' + product.name + '';

      let productPrice = document.querySelector('#price');
      productPrice.textContent = '' + numStr(parseInt(product.price)) + '';

      let productDescription = document.querySelector('#description');
      productDescription.textContent = '' + product.description + '';

      let productOptions = document.querySelector('#colors');

      product.colors.forEach(i => {
        productOptions.innerHTML += '<option value="' + i + '">' + i + '</option>';
      });
    }
    )
    .catch((err) => {
      alert("Il y a eu une erreur : " + err);
    })
    ;
}

// On stocke ce qui est ajouté au panier à chaque clic sur le bouton avec localStorage :

let button = document.querySelector('button');

let select = document.querySelector("#colors");

button.addEventListener('click', () => {

  let lastSelected = select.options[select.selectedIndex].value;
  let quantity = parseInt(document.querySelector("#quantity").value);

  if (quantity !== 0 && lastSelected !== '') {

    if (confirm('Etes-vous sûr ?')) {

      if (JSON.parse(localStorage.getItem('productsInCart'))) {
        var oldItems = JSON.parse(localStorage.getItem('productsInCart'));
      }
      else {
        var oldItems = [];
      }

      const afterFilter = oldItems.filter(item => item.id === idCollectedWoSpace && item.color === lastSelected);

      if (afterFilter.length == 0) {
        let newItem = {
          id: idCollectedWoSpace,
          color: lastSelected,
          quantity: quantity,
        }
        oldItems.push(newItem);
        localStorage.setItem('productsInCart', JSON.stringify(oldItems));
      }
      else {
        let indexWanted = oldItems.indexOf(afterFilter[0]);
        oldItems[indexWanted].quantity = parseInt(oldItems[indexWanted].quantity) + parseInt(quantity);
        localStorage.setItem('productsInCart', JSON.stringify(oldItems));
      }
    }
  }

  else if (quantity == 0 && lastSelected !== '') {
    alert('Merci de préciser une quantité');
  }
  else if (quantity !== 0 && lastSelected == '') {
    alert('Merci de sélectionner une couleur');
  }
  else if (quantity == 0 && lastSelected == '') {
    alert('Merci de sélectionner une couleur et de préciser une quantité');
  }

}
)
;

