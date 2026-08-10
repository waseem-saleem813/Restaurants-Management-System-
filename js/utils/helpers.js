import { cart } from "../data/cartdata.js";
import { saveData, getData } from "../utils/storage.js";
import { promoCodes } from "../data/promocodes.js";


const promoState = getData("promoState", {
  code: "",
  discount: 0,
  applied: false,
});


const delivery_Fee = 200;
const tax_Rate = 0.08;


// Format formatCurrency

export function formatCurrency(amount) {
  return `Rs: ${amount.toFixed(2)}`;
}

// calculatetotal
export function calculatetotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// calculateDiscount
export function calculateDiscount(subtotal) {
  if (!promoState.applied) {
    return 0;
  }

  const promo = promoCodes[promoState.code];

  if (!promo) {
    return 0;
  }

  if (promo.type === "percentage") {
    return subtotal * (promo.value / 100);
  }

  if (promo.type === "fixed") {
    return Math.min(promo.value, subtotal);
  }

  return 0;
}

// calculateOrderSummary

export  function calculateOrderSummary() {
  const subtotal = calculatetotal();
  const discount = calculateDiscount(subtotal);
  const deliveryFee = subtotal > 0 ? delivery_Fee : 0;
  const tax = subtotal * tax_Rate;
  const grandTotal = subtotal + deliveryFee + tax - discount;

  return {
    subtotal,
    discount,
    deliveryFee,
    tax,
    grandTotal,
  };
}

