displayOrderId();

function displayOrderId(){

// On récupère l'orderId dans l'url de la page courrante :
let current_url = document.location.href;
let url = new URL(current_url);
let search_params = new URLSearchParams(url.search);
let orderIdcollected = '' 
orderIdcollected = search_params.get('orderId');

// On se place au bon endroit de la page et on y affiche l'orderId :
let orderIdSpan = document.querySelector('#orderId');
console.log(orderIdcollected);
orderIdSpan.textContent = orderIdcollected;
}