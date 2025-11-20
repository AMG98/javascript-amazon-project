import { cart, removeFromCart, calculateCartQuantity, updateQuantity, updateDeliveryOption} from '../../data/cart.js';
import { products, getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import {hello} from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js'

hello();

const today = dayjs();
const deliveryDate = today.add(7, 'days');
console.log(deliveryDate.format('dddd, MMMM D'));

export function renderOrderSummary() {
  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);
    //HTML Code wird für jedes Matchingproduct generiert

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

      const today = dayjs();
      const deliveryDate = today.add(
        deliveryOption.deliveryDays,
        'days'
      );
      const dateString = deliveryDate.format(
        'dddd, MMMM D'
      );

    cartSummaryHTML += `
      <div class="cart-item-container 
        js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              ${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                Update
              </span>
              <input class="quantity-input js-quantity-input-${matchingProduct.id}">
              <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}" >Save</span>
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
            Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  function deliveryOptionsHTML (matchingProduct, cartItem) {
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(
        deliveryOption.deliveryDays,
        'days'
      );
      const dateString = deliveryDate.format(
        'dddd, MMMM D'
      );

      const priceString = deliveryOption.priceCents === 0
      ? 'FREE'
      : `${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
      <div class="delivery-option js-delivery-option"
      data-product-id="${matchingProduct.id}"
      data-delivery-option-id="${deliveryOption.id}">
        <input type="radio"
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} - Shipping
          </div>
        </div>
      </div>
      `
    });

    return html;
  }

  //HTML Code wird auf die Seite gepackt
  document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;
  //Funktion aktualisiert die Anzeige der Warenkorb-Anzahl.
  function updateCartQuantity() {
    const cartQuantity = calculateCartQuantity();
    document.querySelector('.js-return-to-home-link').innerHTML = `${cartQuantity} items`;
  }

  function handleQuantitySave(productId, newQuantity) {
    // 1. Validierung der Menge
    if (newQuantity < 0 || newQuantity >= 1000) {
      alert('Quantity muss mindestens 0 und kleiner als 1000 sein');
      return;
    }

    // 2. Warenkorb-Daten aktualisieren
    updateQuantity(productId, newQuantity);

    // 3. Input-Feld ausblenden / normalen Zustand wiederherstellen
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.classList.remove('is-editing-quantity');

    // 4. Sichtbare Menge (Quantity-Label) aktualisieren
    const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
    quantityLabel.innerHTML = newQuantity;

    // 5. Gesamtmenge im Warenkorb oben in der Navigation aktualisieren
    updateCartQuantity();
  }


  updateCartQuantity();
  //Alle "Delete"-Links löschen beim Klick das jeweilige Produkt.
  document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);

        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.remove();

        updateCartQuantity();
      });
    });

  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const {productId, deliveryOptionId} = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
      });

    });


  document.querySelectorAll('.js-update-link')
    .forEach((link) => {
      link.addEventListener('click', () => {

        const productId = link.dataset.productId;

        // Container des angeklickten Produkts holen
        const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );

        // Klasse hinzufügen → zeigt das Input-Feld an
        container.classList.add('is-editing-quantity');

        // Das Input-Feld innerhalb dieses Containers finden
        const quantityInput = container.querySelector('.quantity-input');

        // Verhindern, dass mehrere Enter-Listener angehängt werden
        if (!quantityInput._hasEnterListener) {

          // Listener für die Enter-Taste
          quantityInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
              const newQuantity = Number(quantityInput.value);
              handleQuantitySave(productId, newQuantity);
            }
          });

          // Markieren: Dieser Input hat bereits einen Enter-Listener
          quantityInput._hasEnterListener = true;
        }
      });
    });


  document.querySelectorAll('.js-save-link')
    .forEach((link) => {
      link.addEventListener('click', () => {

        const productId = link.dataset.productId;

        // Das passende Input-Feld für dieses Produkt finden
        const quantityInput = document.querySelector(
          `.js-quantity-input-${productId}`
        );

        // Zahl aus dem Input-Feld lesen
        const newQuantity = Number(quantityInput.value);

        // Die zentrale Funktion aufrufen
        handleQuantitySave(productId, newQuantity);
      });
    });
}

