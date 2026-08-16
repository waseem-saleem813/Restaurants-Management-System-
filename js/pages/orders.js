import { cart } from "../data/cartdata.js";
import { saveData, getData } from "../utils/storage.js";
import { promoCodes } from "../data/promocodes.js";
import {
  formatCurrency,
  calculateOrderSummary,
} from "../utils/helpers.js";

// ==============================
// DOM Elements
// ==============================

const elements = {
  // Customer Details
  custumerName: document.querySelector("#cust-name"),
  custumerPhone: document.querySelector("#cust-phone"),
  custumerEmail: document.querySelector("#cust-email"),
  custumerType: document.querySelector("#cust-type"),

  nameAlert: document.querySelector(".nameAlert"),
  numberAlert: document.querySelector(".numberAlert"),
  emailAlert: document.querySelector(".emailAlert"),
  deliveryType: document.querySelector(".deliveryType"),

  // Delivery Address
  addAddressBtn: document.querySelector("#addAddressBtn"),
  addressModal: document.querySelector("#addressOverlay"),
  closeAddressModal: document.querySelector("#closeAddressModal"),
  addressForm: document.querySelector("#addressForm"),

  numberLabel: document.querySelector("#numberLabel"),
  numberInput: document.querySelector("#numberInput"),
  areaInput: document.querySelector("#areaInput"),
  cityInput: document.querySelector("#cityInput"),

  typeHome: document.querySelector("#typeHome"),
  typeOffice: document.querySelector("#typeOffice"),

  addressList: document.querySelector("#addressList"),
  addressAlert: document.querySelector(".addressAlert"),
  areaAlert: document.querySelector(".areaAlert"),

  // Order Summary
  summertItem: document.querySelector(".summeryItems"),
  subtotalElement: document.querySelector(".subtotal"),
  deliveryElement: document.querySelector(".deliveryFee"),
  taxElement: document.querySelector(".tax"),
  discountElement: document.querySelector(".discount"),
  grandTotalElement: document.querySelector(".grandTotal"),

  // Payment
  paymentList: document.querySelector("#paymentList"),

  // Order Complete
  toast: document.querySelector(".toast"),
  placeOrder: document.querySelector("#placeOrder"),
};

// ==============================
// State
// ==============================

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
  addressType: "",
  address: "",
  area: "",
  city: "",
});

let customerValid = false;
let addressSelected = false;
let paymentMethod = "";

// ==============================
// Helper Functions
// ==============================

function saveCostumerDetails() {
  saveData("coustumerDetails", coustmerDetails);
}

function saveCart() {
  saveData("cart", cart);
}

function savePromoState() {
  saveData("promoState", promoState);
}

function resetPromo() {
  promoState.code = "";
  promoState.discount = 0;
  promoState.applied = false;

  savePromoState();
}

function clearCart() {
  cart.splice(0, cart.length);
  saveCart();
}

function addSelected(item) {
  if (!item) return;

  item.classList.add("is-selected");
}

function removeSelected(item) {
  item.classList.remove("is-selected");
}

function openAddressModal() {
  elements.addressModal.classList.add("active");
}

function closeAddressModal() {
  elements.addressModal.classList.remove("active");
}

function showValidationAlert(item) {
  item.classList.add("active");
}

function removeValidationAlert(item) {
  item.classList.remove("active");
}

function showNotification(notification) {
  notification.style.display = "flex";
  notification.classList.remove("toast-out");

  setTimeout(() => {
    notification.classList.add("toast-out");
  }, 4000);

  setTimeout(() => {
    notification.style.display = "none";
  }, 4400);
}

// ==============================
// Customer Information
// ==============================

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
    !costumerNumber ||
    costumerType === "Select" ||
    (costumerEmail && !costumerEmail.includes("@"))
  ) {
    if (!costumerName) {
      showValidationAlert(elements.nameAlert);
    } else if (!costumerNumber) {
      showValidationAlert(elements.numberAlert);
    } else if (costumerType === "Select") {
      showValidationAlert(elements.deliveryType);
    } else {
      showValidationAlert(elements.emailAlert);
    }

    return false;
  }

  removeValidationAlert(elements.nameAlert);
  removeValidationAlert(elements.numberAlert);
  removeValidationAlert(elements.emailAlert);
  removeValidationAlert(elements.deliveryType);

  customerValid = true;

  costumerInfo();

  return true;
}

// ==============================
// Address
// ==============================

function updateNumberField() {
  if (elements.typeOffice.checked) {
    elements.numberLabel.textContent = "Office Number";
    elements.numberInput.placeholder =
      "Office No. 4-C, 2nd Floor, Street 3";

    coustmerDetails.addressType = "Office";
  } else {
    elements.numberLabel.textContent = "House Number";
    elements.numberInput.placeholder =
      "House No. 45-B, Street 3";

    coustmerDetails.addressType = "Home";
  }
}

function addressVerification() {
  const customerAddress = elements.numberInput.value.trim();
  const customerArea = elements.areaInput.value.trim();
  const customerCity = elements.cityInput.value.trim();

  if (!customerAddress || !customerArea) {
    if (!customerAddress) {
      showValidationAlert(elements.addressAlert);
    }

    if (!customerArea) {
      showValidationAlert(elements.areaAlert);
    }

    return false;
  }

  removeValidationAlert(elements.addressAlert);
  removeValidationAlert(elements.areaAlert);

  updateNumberField();

  coustmerDetails.address = customerAddress;
  coustmerDetails.area = customerArea;
  coustmerDetails.city = customerCity;

  saveCostumerDetails();

  addressSelected = true;

  renderAddress();

  closeAddressModal();

  return true;
}

function renderAddress() {
  if (!coustmerDetails.address) {
    elements.addressList.innerHTML = "";
    addressSelected = false;
    return;
  }

  elements.addressList.innerHTML = `
    <label class="address-option is-selected">
      <input type="radio" name="address" checked />
      <div>
        <div class="address-option-title">
          ${coustmerDetails.addressType}
        </div>

        <div class="address-option-text">
          ${coustmerDetails.address}
          ${coustmerDetails.area}
          ${coustmerDetails.city}
        </div>
      </div>
    </label>
  `;

  addressSelected = true;
}

// ==============================
// Order Summary
// ==============================

function renderSummaryItems() {
  elements.summertItem.innerHTML = cart
    .map(
      (item) => `
        <div class="order-summary-item">
          <span>
            <span class="qty-tag numeric">
              ${item.quantity}x
            </span>
            ${item.name}
          </span>

          <span class="numeric">
            ${item.price * item.quantity}
          </span>
        </div>
      `
    )
    .join("");
}

function renderOrderSummary() {
  const {
    subtotal,
    discount,
    deliveryFee,
    tax,
    grandTotal,
  } = calculateOrderSummary(
    cart,
    promoState,
    promoCodes
  );

  elements.subtotalElement.textContent =
    formatCurrency(subtotal);

  elements.deliveryElement.textContent =
    formatCurrency(deliveryFee);

  elements.taxElement.textContent =
    formatCurrency(tax);

  elements.discountElement.textContent =
    `-${formatCurrency(discount)}`;

  elements.grandTotalElement.textContent =
    formatCurrency(grandTotal);
}

// ==============================
// Place Order
// ==============================

function placeOrderProcess() {
  if (!customerValid) {
    const isValidCustomer = validationInfo();

    if (!isValidCustomer) {
      return;
    }
  }

  if (!addressSelected) {
    alert("Please select an address.");
    return;
  }

  if (!paymentMethod) {
    alert("Please select a payment method.");
    return;
  }

  const {
    subtotal,
    discount,
    deliveryFee,
    tax,
    grandTotal,
  } = calculateOrderSummary(
    cart,
    promoState,
    promoCodes
  );

  const placingOrder = {
    orderId: crypto.randomUUID(),

    customer: {
      fullName: coustmerDetails.fullName,
      phone: coustmerDetails.phone,
      email: coustmerDetails.email,
    },

    orderType: coustmerDetails.type,

    address: {
      type: coustmerDetails.addressType,
      address: coustmerDetails.address,
      area: coustmerDetails.area,
      city: coustmerDetails.city,
    },

    paymentMethod,

    items: cart.map((item) => ({
      ...item,
    })),

    subtotal,
    deliveryFee,
    tax,
    discount,
    grandTotal,

    status: "Placed",
  };

  const orders = getData("orders", []);

  orders.push(placingOrder);

  saveData("orders", orders);

  clearCart();
  resetPromo();

  showNotification(elements.toast);

  renderSummaryItems();
  renderOrderSummary();
}

// ==============================
// Initialization
// ==============================

elements.toast.style.display = "none";

renderSummaryItems();
renderOrderSummary();
renderAddress();

// ==============================
// Event Listeners
// ==============================

// Payment

elements.paymentList.addEventListener("change", (event) => {
  if (event.target.type !== "radio") return;

  const clickedMethod = event.target.closest(
    ".payment-method-option"
  );

  if (!clickedMethod) return;

  elements.paymentList
    .querySelectorAll(".payment-method-option")
    .forEach(removeSelected);

  addSelected(clickedMethod);

  paymentMethod = event.target.value;
});

// Address Modal

elements.addAddressBtn.addEventListener(
  "click",
  openAddressModal
);

elements.closeAddressModal.addEventListener(
  "click",
  closeAddressModal
);

// Address Type

elements.typeHome.addEventListener(
  "change",
  updateNumberField
);

elements.typeOffice.addEventListener(
  "change",
  updateNumberField
);

// Saved Address Selection

elements.addressList.addEventListener(
  "change",
  (event) => {
    if (event.target.type !== "radio") return;

    const clickedAddress =
      event.target.closest(".address-option");

    if (!clickedAddress) return;

    elements.addressList
      .querySelectorAll(".address-option")
      .forEach(removeSelected);

    addSelected(clickedAddress);

    addressSelected = true;
  }
);

// Address Form

elements.addressForm.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();

    addressVerification();
  }
);

// Place Order

elements.placeOrder.addEventListener(
  "click",
  (event) => {
    event.preventDefault();

    placeOrderProcess();
  }
);