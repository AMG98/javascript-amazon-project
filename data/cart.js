export const cart = [];

export function addToCart(productId) {
  let matchingItem;

  // Prüfen, ob Produkt bereits im Warenkorb vorhanden ist
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += 1; // Produktmenge im Warenkorb erhöhen
  } else {
    // Neues Produkt in den Warenkorb einfügen
    cart.push({
      productId: productId,
      quantity: 1
    });
  }
}