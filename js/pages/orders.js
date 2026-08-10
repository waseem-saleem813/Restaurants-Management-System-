import { cart } from "../data/cartdata.js";
import { saveData, getData } from "../utils/storage.js";
import { promoCodes } from "../data/promocodes.js";
import { formatCurrency, calculatetotal, calculateDiscount, calculateOrderSummary } from "../utils/helpers.js"


const elements = {
    // custumer Details 
    custumerName: document.querySelector("#cust-name"),
    custumerPhone: document.querySelector("#cust-phone"),
    custumerEmail: document.querySelector("#cust-email"),
    custumerType: document.querySelector("#cust-type"),
    custumerPhone: document.querySelector("#cust-phone"),

    // Delivery Address 

    

}