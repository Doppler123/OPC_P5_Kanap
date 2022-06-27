// On récupère l'id du produit dans l'url de la page courrante :

let current_url = document.location.href;
let url = new URL(current_url);
let search_params = new URLSearchParams(url.search);
if (search_params.has('id')) {
  let id_collected = search_params.get('id');
  var id_collected_wo_space = id_collected.replace(/ /g, '');
}

// On requête l'API pour récupérer uniquement le produit dont l'id est dans l'url de la page :

all_products_from_API();

function all_products_from_API() {

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

      // On insère les données selon ce qui est commenét dans le fichier HTML :
      let product_image = document.querySelector('.item__img');
      product_image.innerHTML = '<img src="' + product.imageUrl + '">';

      let product_name = document.querySelector('#title');
      product_name.textContent = '' + product.name + '';

      let product_price = document.querySelector('#price');
      product_price.textContent = '' + product.price + '';

      let product_description = document.querySelector('#description');
      product_description.textContent = '' + product.description + '';

      let product_options = document.querySelector('#colors');
      product_options.innerHTML = '<option value="">--SVP, choisissez une couleur --</option><option value="vert">vert</option><option value="blanc">blanc</option>';
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
  if (confirm('Etes-vous sûr ?')) {
    var lastSelected = select.options[select.selectedIndex].value;
    var quantity = parseInt(document.querySelector("#quantity").value);

    if (localStorage.getItem('product_1') == null) {
      var product_1 = {
        id : id_collected_wo_space,
        color : lastSelected,
        quantity : quantity,
      }
        localStorage.setItem('product_1', JSON.stringify(product_1));
      }
    
      else if ((((JSON.parse(localStorage.getItem('product_1'))).id) == id_collected_wo_space) 
      && (((JSON.parse(localStorage.getItem('product_1'))).color) == lastSelected)) 
      {
      let sum = ((JSON.parse(localStorage.getItem('product_1'))).quantity) + quantity;
      var product_1 = {
        id : id_collected_wo_space,
        color : lastSelected,
        quantity : sum,
      }
      localStorage.setItem('product_1', JSON.stringify(product_1));
      }

      else if (((JSON.parse(localStorage.getItem('product_1'))).color) != lastSelected) {
        var product_1bis = {
          id : id_collected_wo_space,
          color : lastSelected,
          quantity : quantity,
        }
        localStorage.setItem('product_1bis', JSON.stringify(product_1bis));  
      }
    }
  }
);

console.log((JSON.parse(localStorage.getItem('product_1bis'))).id); 
console.log((JSON.parse(localStorage.getItem('product_1bis'))).color); 
console.log((JSON.parse(localStorage.getItem('product_1bis'))).quantity); 
