import { cart } from "../data/cartdata.js";
import { saveData, getData } from "../utils/storage.js";
import { promoCodes } from "../data/promocodes.js";
import { formatCurrency, calculateOrderSummary } from "../utils/helpers.js";

const elements = {
  // custumer Details
  custumerName: document.querySelector("#cust-name"),
  custumerPhone: document.querySelector("#cust-phone"),
  custumerEmail: document.querySelector("#cust-email"),
  custumerType: document.querySelector("#cust-type"),

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

  // Order Complet
  placeOrder: document.querySelector("#placeOrder"),
};

const promoState = getData("promoState", {
  code: "",
  discount: 0,
  applied: false,
});

const coustmerDetails = getData("coustumerDetails", {
  fullName: "",
  phone: "",
  email: "",
  type: "",
  // address: "",
  // city: ""
});
// Helping Function:

function saveCostumerDetails() {
  saveData("coustumerDetails", coustmerDetails);
}

function addSelected(item) {
  item.classList.add("is-selected");
}

function removeSelected(item) {
  item.classList.remove("is-selected");
}

function moduleOpen(){
  elements.addressModal.classList.add("active")
}

function moduleClose(){
  elements.addressModal.classList.remove("active")
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

function costumerInfo() {
  const costumerName = elements.custumerName.value.trim();
  const costumerNumber = elements.custumerPhone.value.trim();
  const costumerEmail = elements.custumerEmail.value.trim();
  const costumerType = elements.custumerType.value;

  coustmerDetails.fullName = costumerName;
  coustmerDetails.phone = costumerNumber;
  coustmerDetails.email = costumerEmail;
  coustmerDetails.type = costumerType;

  saveCostumerDetails();
}

function validationInfo() {
  const costumerName = elements.custumerName.value.trim();
  const costumerNumber = elements.custumerPhone.value.trim();
  const costumerEmail = elements.custumerEmail.value.trim();
  const costumerType = elements.custumerType.value;

  if (
    !costumerName ||
    costumerNumber <= 0 ||
    costumerType === "Select" ||
    (costumerEmail && !costumerEmail.includes("@"))
  ) {
    alert(
      !costumerName
        ? "Please enter a valid name"
        : costumerNumber <= 0
        ? "Please enter a valid number"
        : costumerType === "Select"
        ? "Please enter a delivery type"
        : "Please enter a valid email",
    )

    return;
  }
  costumerInfo();
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

  elements.paymentList
    .querySelectorAll(".payment-method-option")
    .forEach((option) => {
      removeSelected(option);
    });

  addSelected(clickedMethod);
});

elements.placeOrder.addEventListener("click", (e) => {
  e.preventDefault();
  validationInfo();
});

elements.addAddressBtn.addEventListener("click", moduleOpen)

elements.closeAddressModal.addEventListener("click", moduleClose)

// Initialization
