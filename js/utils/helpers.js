const delivery_Fee = 200;
const tax_Rate = 0.08;


// Format formatCurrency

export function formatCurrency(amount) {
  return `Rs: ${amount.toFixed(2)}`;
}

// calculatetotal
export function calculatetotal(cart) {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// calculateDiscount
export function calculateDiscount(subtotal, promoState, promoCodes) {
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

export  function calculateOrderSummary(cart, promoState, promoCodes) {
  const subtotal = calculatetotal(cart);
  const discount = calculateDiscount(subtotal, promoState, promoCodes);
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

