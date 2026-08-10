import { cart } from "../data/cartdata.js";
import { saveData, getData } from "../utils/storage.js";
import { promoCodes } from "../data/promocodes.js";
import { formatCurrency, calculatetotal, calculateDiscount, calculateOrderSummary } from "../utils/helpers.js"

// const delivery_Fee = 200;
// const tax_Rate = 0.08;
const toast_Duration = 5000;
const toast_Out_Duration = 5400;

const elements = {
  cartItems: document.querySelector("#cart-items"),
  cartCount: document.querySelector("#cart-count"),
  modalOverlay: document.querySelector(".modal-overlay"),
  closeModal: document.querySelector(".modal-close"),
  cancelBtn: document.querySelector(".btn-cancel"),
  deleteBtn: document.querySelector(".btn-delete"),
  deleteItemName: document.querySelector(".delete-item-name"),

  toast: document.querySelector(".toast"),
  toastDanger: document.querySelector(".toast-danger"),

  subtotalElement: document.querySelector("#subtotal"),
  deliveryElement: document.querySelector("#delivery-fee"),
  taxElement: document.querySelector("#tax"),
  discountElement: document.querySelector("#discount"),
  grandTotalElement: document.querySelector("#grand-total"),

  promoInput: document.querySelector("#promo-code"),
  promoBtn: document.querySelector(".promo-row .btn"),

  checkoutLink: document.querySelector(".checkoutProcess"),
};

let deleteItemId = null;

const promoState = getData("promoState", {
  code: "",
  discount: 0,
  applied: false,
});

// Helper Function

function saveCart() {
  saveData("cart", cart);
}

function savePromoState() {
  saveData("promoState", promoState);
}

function findCartItem(id) {
  return cart.find((item) => item.id === id);
}

function resetPromo() {
  promoState.code = "";
  promoState.discount = 0;
  promoState.applied = false;

  savePromoState();
}

// // Rendering

function renderCartItems() {
  if (cart.length === 0) {
    elements.cartItems.innerHTML = ` <div class="empty-state"> 
    <div class="empty-state-icon"> 
    <i class="fa-solid fa-cart-shopping"></i> 
    </div> 
    <h3>Your cart is empty</h3> 
    <p> Looks like you haven't added anything yet. </p> 
    <a href="menu.html" class="btn btn-primary"> Browse Menu </a> 
    </div> `;
    return;
  }

  elements.cartItems.innerHTML = cart
    .map(
      (item) => ` <div class="cart-item"> 
    <div class="cart-item-media"> <img src="${item.image}" alt="${item.name}" /> 
    </div> 
    <div> 
    <div class="cart-item-name"> 
    ${item.name} 
    </div> 
    <div class="cart-item-variant"> 
    ${item.description} 
    </div> 
    <div class="cart-item-unit-price numeric"> R
    S: ${item.price} 
    </div> 
    </div> 
    <div class="qty-control"> 
    <button class="decrease" data-id="${item.id}" type="button" > 
    − 
    </button> 
    <span class="qty-value"> 
    ${item.quantity} 
    </span> 
    <button class="increase" data-id="${item.id}" type="button" > 
    + 
    </button> 
    </div> 
    <div class="cart-item-total"> 
    ${item.quantity * item.price} 
    </div>
   <button class="cart-item-remove" data-id="${item.id}" type="button" > 
   <i class="fa-solid fa-trash"></i> 
   </button> 
   </div> `,
    )
    .join("");
}

function renderOrderSummery() {
  const { subtotal, discount, deliveryFee, tax, grandTotal } =
    calculateOrderSummary(cart, promoState, promoCodes);

  elements.subtotalElement.textContent = formatCurrency(subtotal);
  elements.deliveryElement.textContent = formatCurrency(deliveryFee);
  elements.taxElement.textContent = formatCurrency(tax);
  elements.discountElement.textContent = `-${formatCurrency(discount)}`;
  elements.grandTotalElement.textContent = formatCurrency(grandTotal);
}

function renderCartCount() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  elements.cartCount.textContent = `${totalItems} ${totalItems === 1 ? "Item" : "Items"} in Cart`;
}

function render() {
  renderCartItems();
  renderCartCount();
  renderOrderSummery();

  elements.promoInput.value = promoState.code;
}

// Notification

function showNotification(notification) {
  notification.style.display = "flex";
  notification.classList.remove("toast-out");

  setTimeout(() => {
    notification.classList.add("toast-out");
  }, toast_Duration);

  setTimeout(() => {
    notification.style.display = "none";
  }, toast_Out_Duration);
}

// modals

function openDeleteModal(item) {
  deleteItemId = item.id;
  elements.deleteItemName.textContent = item.name;
  elements.modalOverlay.style.display = "flex";
}

function closeDeleteModal() {
  deleteItemId = null;
  elements.modalOverlay.style.display = "none";
}

// Cart Action

function increaseQuantity(id) {
  const item = findCartItem(id);

  if (!item) return;

  item.quantity += 1;

  saveCart();
  render();
}

function decreaseQuantity(id) {
  const item = findCartItem(id);

  if (!item || item.quantity <= 1) return;

  item.quantity -= 1;

  saveCart();
  render();
}

function removeItem() {
  if (deleteItemId === null) return;

  const index = cart.findIndex((item) => item.id === deleteItemId);

  if (index === -1) return;

  cart.splice(index, 1);

  saveCart();

  if (cart.length === 0) {
    resetPromo();
  }

  closeDeleteModal();
  render();

  showNotification(elements.toast);
}

function checkoutProcess() {
  if (cart.length === 0) {
    alert("cart is empty");
  } else {
    window.location.href = "orders.html";
  }
}

// Promo Codes

function applyPromoCode() {
  const code = elements.promoInput.value.trim().toUpperCase();
  const promo = promoCodes[code];

  if (!promo) {
    resetPromo();

    alert("Invalied Promo Code");

    renderOrderSummery();

    return;
  }

  promoState.code = code;
  promoState.applied = true;
  promoState.discount = calculateDiscount(calculatetotal(cart), promoState, promoCodes);

  savePromoState();

  alert(`${code} Applied Successfully`);

  renderOrderSummery();
}

// Event Listener

elements.cartItems.addEventListener("click", (event) => {
  const increaseButton = event.target.closest(".increase");
  const decreaseButton = event.target.closest(".decrease");
  const removeButton = event.target.closest(".cart-item-remove");
  if (increaseButton) {
    increaseQuantity(Number(increaseButton.dataset.id));
    return;
  }

  if (decreaseButton) {
    decreaseQuantity(Number(decreaseButton.dataset.id));
    return;
  }

  if (removeButton) {
    const item = findCartItem(Number(removeButton.dataset.id));
    if (item) {
      openDeleteModal(item);
    }
  }
});

elements.closeModal.addEventListener("click", closeDeleteModal);

elements.cancelBtn.addEventListener("click", () => {
  closeDeleteModal();

  showNotification(elements.toastDanger);
});

elements.deleteBtn.addEventListener("click", removeItem);

elements.promoBtn.addEventListener("click", applyPromoCode);

elements.checkoutLink.addEventListener("click", checkoutProcess);

// Initialization

elements.toast.style.display = "none";
elements.toastDanger.style.display = "none";

render();
