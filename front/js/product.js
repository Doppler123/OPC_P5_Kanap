// On récupère l'id du produit dans l'url de la page courrante :

let current_url = document.location.href;
let url = new URL(current_url);
let search_params = new URLSearchParams(url.search);
if (search_params.has('id')) {
  let id_collected = search_params.get('id');
  var id_collected_wo_space = id_collected.replace(/ /g, '');
}

// On requête l'API pour récupérer uniquement le produit dont l'id est dans l'url de la page :

one_product_from_API();

function one_product_from_API() {

  fetch("http://localhost:3000/api/products/" + id_collected_wo_space + "")

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

      // On insère les données selon ce qui est commenté dans le fichier HTML :
      var product_image = document.querySelector('.item__img');
      product_image.innerHTML = '<img src="' + product.imageUrl + '">';

      var product_name = document.querySelector('#title');
      product_name.textContent = '' + product.name + '';

      var product_price = document.querySelector('#price');
      product_price.textContent = '' + product.price + '';

      var product_description = document.querySelector('#description');
      product_description.textContent = '' + product.description + '';

      var product_options = document.querySelector('#colors');

      product.colors.forEach(i => {
        product_options.innerHTML += '<option value="' + i + '">' + i + '</option>';
      });
    }
    )
    .catch(function (err) {
      // Une erreur est survenue
    })
    ;
}

// On stocke ce qui est ajouté au panier à chaque clic sur le bouton avec localStorage :

let button = document.querySelector('button');

let select = document.querySelector("#colors");

button.addEventListener('click', () => {

  var lastSelected = select.options[select.selectedIndex].value;
  var quantity = parseInt(document.querySelector("#quantity").value);

  if (quantity !== 0 && lastSelected !== '') {

    if (confirm('Etes-vous sûr ?')) {

      var oldItems = JSON.parse(localStorage.getItem('productsInCart')) || [];

      const afterIdFilter = oldItems.filter(item => item.id === id_collected_wo_space);
      const afterColorFilter = afterIdFilter.filter(items => items.color === lastSelected);

      if (afterColorFilter.length == 0) {
      var newItem = {
          id: id_collected_wo_space,
          color: lastSelected,
          quantity: quantity,
        }
      oldItems.push(newItem);
      localStorage.setItem('productsInCart', JSON.stringify(oldItems));
      }
      else { 
        var indexWanted = oldItems.indexOf(afterColorFilter[0]);
        oldItems[indexWanted].quantity = oldItems[indexWanted].quantity + quantity;
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

