import {cart, addToCart} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';


let productsHTML = ''; // HTML für alle Produkte vorbereiten

// Für jedes Produkt HTML generieren und anhängen
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

// Generiertes HTML in die Seite einfügen
document.querySelector('.js-products-grid')
  .innerHTML = productsHTML;

function updateCartQuantity() {
// Gesamtanzahl aller Produkte im Warenkorb berechnen
    let cartQuantity = 0;
    cart.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });

    // Aktualisierte Warenkorb-Anzahl im Header anzeigen
    document.querySelector('.js-cart-quantity')
      .innerHTML = cartQuantity;
      
}
  updateCartQuantity();

// Event Listener für alle "Add to Cart"-Buttons hinzufügen
document.querySelectorAll('.js-add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId; // Produkt-ID ermitteln
    addToCart(productId);
    updateCartQuantity();
    
  });
});
