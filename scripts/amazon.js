import { cart, addToCart, calculateCartQuantity } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';

let productsHTML = '';
//Für jedes Produkt auf der Webseite wird ein HTML Code generiert
products.forEach((product) => {
  productsHTML += `
    <div class="product-container">
        <div class="product-image-container">
            <img class="product-image" src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
            ${product.name}
        </div>

        <div class="product-rating-container">
            <img class="product-rating-stars" src="images/ratings/rating-${product.rating.stars * 10}.png">
            <div class="product-rating-count link-primary">
                ${product.rating.count}
            </div>
        </div>

        <div class="product-price">
            ${formatCurrency(product.priceCents)}
        </div>

        <div class="product-quantity-container">
            <select>
                ${[...Array(10).keys()].map(i => `<option ${i === 0 ? 'selected' : ''} value="${i + 1}">${i + 1}</option>`).join('')}
            </select>
        </div>

        <div class="product-spacer"></div>

        <div class="added-to-cart">
            <img src="images/icons/checkmark.png">
            Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart"
        data-product-id="${product.id}">
            Add to Cart
        </button>
    </div>    
  `;
});
//HTML Code wird auf die Seite hinzugefügt
document.querySelector('.js-products-grid')
  .innerHTML = productsHTML;
//Funktion updatet Warenkorbanzeige mit Gesamtmenge auf Startseite
function updateCartQuantity() {
  const cartQuantity = calculateCartQuantity();
  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

// Initial anzeigen
updateCartQuantity();
//productId wird gespeichert wenn  Add To Cart geklickt wird. productId wird als Parameter für die Funktionen genutzt
document.querySelectorAll('.js-add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;
    addToCart(productId);
    updateCartQuantity();
  });
});
