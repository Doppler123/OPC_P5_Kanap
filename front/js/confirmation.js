displayOrderId();

function displayOrderId(){

// On récupère l'orderId dans l'url de la page courrante :
let currentUrl = document.location.href;
let url = new URL(currentUrl);
let searchParams = new URLSearchParams(url.search);
let orderIdcollected = '' 
orderIdcollected = searchParams.get('orderId');

// On se place au bon endroit de la page et on y affiche l'orderId :
let orderIdSpan = document.querySelector('#orderId');
orderIdSpan.textContent = orderIdcollected;
}