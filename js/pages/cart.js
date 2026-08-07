import { cart } from "../data/cartdata.js";
import { saveData, getData } from "../utils/storage.js";
import { promoCodes } from "../data/promocodes.js";

const cartItems = document.querySelector("#cart-items");
let cartCount = document.querySelector("#cart-count");

const modalOverlay = document.querySelector(".modal-overlay");
const closeModal = document.querySelector(".modal-close");
const cancelBtn = document.querySelector(".btn-cancel");
const deleteBtn = document.querySelector(".btn-delete");
const deleteItemName = document.querySelector(".delete-item-name");
const toast = document.querySelector(".toast");
const toastDanger = document.querySelector(".toast-danger");

const subtotalElement = document.querySelector("#subtotal");
const deliveryElement = document.querySelector("#delivery-fee");
const taxElement = document.querySelector("#tax");
const discountElement = document.querySelector("#discount");
const grandTotalElement = document.querySelector("#grand-total");

const promoInput = document.querySelector("#promo-code");
const promoBtn = document.querySelector(".promo-row .btn");



let deleteItemId = null;
let subtotal = 0;

const promoState = getData("promoState", {
  code: "",
  discount: 0,
  applied: false
}
)

toastDanger.style.display = "none";
toast.style.display = "none";

function showProducts() {
  let cartCard = "";
  for (const food of cart) {
    cartCard += `
    <div class="cart-item">
      <div class="cart-item-media">
        <img src="${food.image}" alt="${food.name}" />
      </div>
      <div>
        <div class="cart-item-name">${food.name}</div>
        <div class="cart-item-variant">${food.description}</div>
        <div class="cart-item-unit-price numeric">
          RS:${food.price}
        </div>
      </div>
      <div class="qty-control">
        <button 
        class="decrease" 
        data-id="${food.id}">
        −
        </button>
        <span class="qty-value">
        ${food.quantity}
        </span>
        <button 
        class="increase" 
        data-id="${food.id}">
        +
        </button>
      </div>
      <div class="cart-item-total">
        ${food.quantity * food.price}
      </div>
      <button 
      class="cart-item-remove"
      data-id="${food.id}">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
    `;
  }
  cartItems.innerHTML = cartCard;
}

function orderSummary() {
  subtotal = 0;

  for (const food of cart) {
    subtotal += food.price * food.quantity;
  }

  if (promoState.applied) {
    const promo = promoCodes[promoState.code];
    if (promo.type === "percentage") {
      promoState.discount = subtotal * (promo.value / 100);
    }
    if (promo.type === "fixed") {
      promoState.discount = Math.min(promo.value, subtotal);
    }
  }
  const deliveryFee = subtotal > 0 ? 200 : 0;
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + deliveryFee + tax - promoState.discount;

  subtotalElement.textContent = `RS: ${subtotal}`;
  deliveryElement.textContent = `RS: ${deliveryFee}`;
  taxElement.textContent = `RS: ${tax.toFixed(2)}`;
  discountElement.textContent = `−RS: ${promoState.discount}`;
  grandTotalElement.textContent = `RS: ${grandTotal.toFixed(2)}`;
}

function renderCart() {
  if (cart.length > 0) {
    cartCount.textContent = `${cart.length} Items in Cart`;
    promoInput.value = promoState.code
    showProducts();
    orderSummary();
  } else {
    cartCount.textContent = "0 Items in Cart";
    subtotalElement.textContent = "RS: 0";
    deliveryElement.textContent = "RS: 0";
    taxElement.textContent = "RS: 0";
    discountElement.textContent = "RS: 0";
    grandTotalElement.textContent = "RS: 0";
    cartItems.innerHTML = `
    <div class="empty-state">
    <div class="empty-state-icon">
    <i class="fa-solid fa-cart-shopping"></i>
    </div>
    <h3>Your cart is empty</h3>
    <p>
    Looks like you haven't added anything yet.
    </p>
    <a href="menu.html" class="btn btn-primary">
    Browse Menu
    </a>
    </div>
    `;
  }
}

function notificationModule(notification) {
  setTimeout(() => {
    notification.classList.toggle("toast-out")
  }, 5000)
  setTimeout(() => {
    notification.style.display = "none";
  }, 5400)
}

renderCart();

cartItems.addEventListener("click", (event) => {
  if (event.target.matches(".increase")) {
    const id = Number(event.target.dataset.id);
    const item = cart.find(food => food.id === id);
    if (!item) return;
    item.quantity++;
    saveData("cart", cart);
    renderCart();
  }
  if (event.target.matches(".decrease")) {
    const id = Number(event.target.dataset.id);
    const item = cart.find(food => food.id === id);
    if (!item) return;
    if (item.quantity > 1) {
      item.quantity--;
      saveData("cart", cart);
      renderCart();
    }
  }
  if (event.target.closest(".cart-item-remove")) {
    const button = event.target.closest(".cart-item-remove");
    deleteItemId = Number(button.dataset.id);
    const item = cart.find(food => food.id === deleteItemId);
    if (!item) return;
    deleteItemName.textContent = item.name;
    modalOverlay.style.display = "flex";
  }
});

closeModal.addEventListener("click", () => {
  modalOverlay.style.display = "none";
});

cancelBtn.addEventListener("click", () => {
  modalOverlay.style.display = "none";
  toastDanger.style.display = "flex"
  notificationModule(toastDanger)
});


deleteBtn.addEventListener("click", () => {
  const index = cart.findIndex(food => food.id === deleteItemId);
  if (index !== -1) {
    cart.splice(index, 1);

    saveData("cart", cart);
  }
  toast.style.display = "flex";
  modalOverlay.style.display = "none";
  renderCart();
  notificationModule(toast)
});

promoBtn.addEventListener("click", () => {
  const code = promoInput.value.trim().toUpperCase();
  const promo = promoCodes[code];
  if (!promo) {
    promoState.code = "";
    promoState.discount = 0;
    promoState.applied = false;
    alert("Invalid Promo Code");
    saveData("promoState", promoState);
    orderSummary();
    return;
  }
  promoState.code = code;
  promoState.applied = true;
  alert(`${code} Applied Successfully`);
  saveData("promoState", promoState);
  orderSummary();
});