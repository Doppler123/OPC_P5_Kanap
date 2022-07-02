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

      function getElementById(idtest) {
        for (let sofa in sofas) {
          if (sofa._id == idtest){
            let imageUrlFromId = 0;
            imageUrlFromId = sofa.imageUrl;
            let altTxtFromId = 0;
            altTxtFromId = sofa.altTxt;
            let nameFromId = 0;
            nameFromId = sofa.name;
            let priceFromId = 0;
            priceFromId= sofa.price;
        }
      }
        return imageUrlFromId, altTxtFromId, nameFromId, priceFromId;
      }

      console.log(getElementById(a557292fe5814ea2b15c6ef4bd73ed83));
    }
    )
    .catch(function (err) {
      // Une erreur est survenue
    })
    ;
}
