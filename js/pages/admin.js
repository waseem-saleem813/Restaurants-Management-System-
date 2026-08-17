// Imports
import { menuData } from "../data/menuData.js";

// Dom Elements

const elements = {
  // Statistic Cards
  menuItems: document.querySelector(".menuItems"),
  activeItems: document.querySelector(".activeItems"),
  outOfStock: document.querySelector(".outOfStock"),
  categoryItems: document.querySelector(".categoryItems"),

  // Add New Items
  foodName: document.querySelector("#food-name"),
  foodCategory: document.querySelector("#food-category"),
  foodPrice: document.querySelector("#food-price"),
  foodStock: document.querySelector("#food-stock"),
  foodDesc: document.querySelector("#food-desc"),
  cancelAddItem: document.querySelector(".cancelAddItem"),
  submitAddItem: document.querySelector(".submitAddItem"),

  // Menu Table
};

// statistic Card

function totalMenuItems() {
  elements.menuItems.textContent = menuData.length;
}

function updateActiveItems() {
  let activeItems = menuData.filter((item) => {
    return item.status === "In Stock";
  });

  elements.activeItems.textContent = activeItems.length;
}

function updateOutOfStock() {
  let outOfStock = menuData.filter((item) => {
    return item.status === "Out of Stock";
  });

  elements.outOfStock.textContent = outOfStock.length;
}

function categoryItems() {
  let categoryItems = [...new Set(menuData.map((item) => item.category))];

  elements.categoryItems.textContent = categoryItems.length;
}

function statisticCardLive() {
  totalMenuItems();
  updateActiveItems();
  updateOutOfStock();
  categoryItems();
}

// Add Food Item Form

function createFoodItem() {
  const id = Math.max(...menuData.map((item) => item.id)) + 1;
  const name = elements.foodName.value.trim();
  const category = elements.foodName.value.trim();
  const price = elements.foodPrice.value.trim();
  const description = elements.foodDesc.value.trim();
  const status = elements.foodStock.value.trim();

  let foodItem = {
    id,
    name,
    category,
    price,
    rating: 4.5,
    // image,
    description,
    status,
  };
  console.log(foodItem);
}

function itemValidation() {
  const custumerName = elements.custumerName.value.trim();
  const custumerCategory = elements.foodCategory.value.trim();
  const custumerPrice = elements.custumerPrice.value.trim();
  const custumerDesc = elements.custumerDesc.value.trim();

  if (
    !custumerName ||
    custumerCategory === "Select a category" ||
    custumerPrice <= 0 ||
    !custumerDesc
  ) {
    if (!custumerName) {
      elements.custumerName.focus();
    } else if (custumerCategory === "Select a category") {
      elements.foodCategory.focus();
    } else if (custumerPrice <= 0) {
      elements.custumerPrice.focus();
    } else {
      elements.custumerDesc.focus();
    }

    return
  }

  createFoodItem()
}

createFoodItem();
statisticCardLive();


elements.submitAddItem.addEventListener("click", () => {
  itemValidation()
})