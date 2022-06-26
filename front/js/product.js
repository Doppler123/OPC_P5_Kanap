// On récupère l'id du produit dans l'url de la page courrante :

let current_url = document.location.href;
console.log(current_url)
let url = new URL(current_url);
let search_params = new URLSearchParams(url.search);
if (search_params.has('id')) {
  let id_collected = search_params.get('id');
  var id_collected_wo_space = id_collected.replace(/ /g, '');
  console.log(id_collected_wo_space);
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

/* let button = document.querySelector('button');
let number_of_items = 0;

button.addEventListener('click', () => {  
    if(confirm('Etes-vous sûr ?')) {   
      localStorage.setItem('id', ''+id_collected_wo_space+'');
      localStorage.setItem('number_of_items', ''+ number_of_items +'');
      localStorage.setItem('color', ''+  +'');
    }
  }); */




