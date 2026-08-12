import { cart } from "../data/cartdata.js";
import { saveData, getData } from "../utils/storage.js";
import { promoCodes } from "../data/promocodes.js";
import {
  formatCurrency,
  calculatetotal,
  calculateDiscount,
  calculateOrderSummary,
} from "../utils/helpers.js";

const elements = {
  // custumer Details
  custumerName: document.querySelector("#cust-name"),
  custumerPhone: document.querySelector("#cust-phone"),
  custumerEmail: document.querySelector("#cust-email"),
  custumerType: document.querySelector("#cust-type"),
  custumerPhone: document.querySelector("#cust-phone"),

  // Delivery Address
  addAddressBtn: document.querySelector("#addAddressBtn"),
  addressModal: document.querySelector("#addressOverlay"),
  closeAddressModal: document.querySelector("#closeAddressModal"),
  addressForm: document.querySelector("#addressForm"),

  numberLabel: document.querySelector("#numberLabel"),
  numberInput: document.querySelector("#numberInput"),
  typeHome: document.querySelector("#typeHome"),
  typeOffice: document.querySelector("#typeOffice"),
  addressList: document.querySelector("#addressList"),

  // Summery Items
  summertItem: document.querySelector(".summeryItems"),

  // Order Summery
  subtotalElement: document.querySelector(".subtotal"),
  deliveryElement: document.querySelector(".deliveryFee"),
  taxElement: document.querySelector(".tax"),
  discountElement: document.querySelector(".discount"),
  grandTotalElement: document.querySelector(".grandTotal"),

  // Payment Method
  paymentList: document.querySelector("#paymentList"),
};

const promoState = getData("promoState", {
  code: "",
  discount: 0,
  applied: false,
});

// Helping Function:

function addSelected(item) {
  item.classList.add("is-selected");
}

function removeSelected(item) {
  item.classList.remove("is-selected");
}

function SummeryItem() {
  elements.summertItem.innerHTML = cart
    .map(
      (item) => `<div class="order-summary-item">
    <span><span class="qty-tag numeric">${item.quantity}x</span>${item.name}</span>
    <span class="numeric">${item.price * item.quantity}</span>
    </div>`,
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
renderOrderSummery();
SummeryItem();

// Event Listening

elements.paymentList.addEventListener("click", (e) => {
  const clickedMethod = e.target.closest(".payment-method-option");

  if (!clickedMethod) return;

  elements.paymentList.querySelectorAll(".payment-method-option").forEach((option) => {
    removeSelected(option)
  })

  addSelected(clickedMethod);
});
