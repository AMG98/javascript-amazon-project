//Der Warenkorb
export let cart = JSON.parse(localStorage.getItem('cart'));
//Wenn cart leer oder null ist (z. B. beim ersten Laden), wird ein Standard-Warenkorb gesetzt.
if (!cart) {
  cart = [{
  productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
  quantity: 2,
  }, {
  productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
  quantity: 1
  }];
}
//Funktion speichert aktuellen Stand des Warenkorbs
function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}
//Funktion fügt einen Artikel in den Warenkorb hinzu
export function addToCart(productId) {
  let matchingItem;

  cart.forEach((cartItem) => {// Prüfen, ob Produkt bereits im Warenkorb vorhanden ist
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += 1; // Wenn Produkt im Warenkorb => Produktmenge im Warenkorb erhöhen
  } else {
    
    cart.push({ // Wenn Produkt nicht im Warenkorb=> Neues Produkt in den Warenkorb hinzufügen
      productId: productId,
      quantity: 1
    });
  }

  saveToStorage();
}
//Funktion entfernt Artikel aus dem Warenkorb
export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) =>  {
    if(cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;

  saveToStorage();
}
//Funktion berechnet die Gesamtmenge im Warenkorb
export function calculateCartQuantity() {
  let cartQuantity = 0;
  
    cart.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });

    return cartQuantity;
  }

export function updateQuantity (productId, newQuantity) {
  let matchingItem;

  cart.forEach((cartItem) => {
     if (productId === cartItem.productId )  { 
      matchingItem = cartItem;
    } 
  });
  
  matchingItem.quantity = newQuantity;


  saveToStorage();
}