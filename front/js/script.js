// On requête l'API pour récupérer tous les produits :
allProductsFromAPI();

function allProductsFromAPI() {

  fetch("http://localhost:3000/api/products")

    // On vérifie que la requête s'est bien déroulée :
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })

    // On récupère les résultats de la requête à l'API :
    .then(function (requestResults) {
      const sofas = requestResults;
      console.log(sofas);

      // On se place au niveau de la section "#items" du HTML :
      let items = document.querySelector('#items');

      // On met en place une boucle qui vient itérer sur chaque objet pour ajouter au DOM 1 lien pour chaque sofa  
      for (let sofa in sofas) {
        items.innerHTML += '<a href="./product.html?id= ' + sofas[sofa]._id +
          ' "><article><img src=' + sofas[sofa].imageUrl + ' alt=" ' + sofas[sofa].altTxt +
          '"><h3 class="productName">' + sofas[sofa].name +
          '</h3><p class="productDescription"> ' + sofas[sofa].description +
          '</p></article></a>';
      }
    }
    )
    .catch((err) => {
      alert("Il y a eu une erreur : " + err);
    })
    ;
}



