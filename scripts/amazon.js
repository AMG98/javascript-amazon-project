let productsHTML = '';

// Für jedes Produkt HTML erzeugen und zu productsHTML hinzufügen
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
        <img class="product-rating-stars"
             src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        ${(product.priceCents / 100).toFixed(2)}
      </div>

      <div class="product-quantity-container">
        <!-- Produktmenge auswählen -->
        <select class="js-quantity-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <!-- Button zum Hinzufügen in den Warenkorb -->
      <button class="add-to-cart-button button-primary js-add-to-cart"
              data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>    
  `;
});

// Produkte in die Seite einfügen
document.querySelector('.js-products-grid')
  .innerHTML = productsHTML;

// Für jeden "Add to Cart"-Button einen Event-Listener hinzufügen
document.querySelectorAll('.js-add-to-cart')
  .forEach((button) => {
    button.addEventListener('click', () => {
      // Produkt-ID aus dem Button holen
      const productId = button.dataset.productId;

      // Ausgewählte Menge aus dem Dropdown lesen
      const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
      const quantity = Number(quantitySelector.value);

      // Schauen, ob das Produkt schon im Warenkorb ist
      let matchingItem;
      cart.forEach((item) => {
        if (productId === item.productId) {
          matchingItem = item;
        }
      });

      // Wenn vorhanden → Menge erhöhen, sonst neu hinzufügen
      if (matchingItem) {
        matchingItem.quantity += quantity;
      } else {
        cart.push({
          productId: productId,
          quantity: quantity
        });
      }

      // Gesamtmenge im Warenkorb berechnen
      let cartQuantity = 0;
      cart.forEach((item) => {
        cartQuantity += item.quantity;
      });

      // Gesamtmenge im Warenkorb anzeigen
      document.querySelector('.js-cart-quantity')
        .innerHTML = cartQuantity;
    });
});
