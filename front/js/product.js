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
      if (product.colors[2] == null) {
        product_options.innerHTML = '<option value="">--SVP, choisissez une couleur --</option><option value="' + product.colors[0] + '">' + product.colors[0] + '</option><option value="' + product.colors[1] + '">' + product.colors[1] + '</option>';
      }
      else if (product.colors[3] == null) {
        product_options.innerHTML = '<option value="">--SVP, choisissez une couleur --</option><option value="' + product.colors[0] + '">' + product.colors[0] + '</option><option value="' + product.colors[1] + '">' + product.colors[1] + '</option><option value="' + product.colors[2] + '">' + product.colors[2] + '</option>';
      }
      else {
        product_options.innerHTML = '<option value="">--SVP, choisissez une couleur --</option><option value="' + product.colors[0] + '">' + product.colors[0] + '</option><option value="' + product.colors[1] + '">' + product.colors[1] + '</option><option value="' + product.colors[2] + '">' + product.colors[2] + '</option><option value="' + product.colors[3] + '">' + product.colors[3] + '</option>';
      }
      // voir si on ne peut pas faire mieux sur la ligne ci-dessous pour ne pas reprendre du HTML non commenté
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

      for (let i = 1; i <= 21; i++) {

        if (localStorage.getItem('product_' + i + '') == null) {
          var product_i = {
            id: id_collected_wo_space,
            color: lastSelected,
            quantity: quantity,
          }
          localStorage.setItem('product_' + i + '', JSON.stringify(product_i));
          { break; }
        }

        else if ((((JSON.parse(localStorage.getItem('product_' + i + ''))).id) == id_collected_wo_space)
          && (((JSON.parse(localStorage.getItem('product_' + i + ''))).color) == lastSelected)) {
          let sum = ((JSON.parse(localStorage.getItem('product_' + i + ''))).quantity) + quantity;
          var product_i = {
            id: id_collected_wo_space,
            color: lastSelected,
            quantity: sum,
          }
          localStorage.setItem('product_' + i + '', JSON.stringify(product_i));
          { break; }
        }

        else if (((((JSON.parse(localStorage.getItem('product_' + i + ''))).color) != lastSelected))
          && ((localStorage.getItem('product_' + i + '') == null))) {
          var product_i = {
            id: id_collected_wo_space,
            color: lastSelected,
            quantity: quantity,
          }
          localStorage.setItem('product_' + i + '', JSON.stringify(product_i));
          { break; }

        }
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
);
