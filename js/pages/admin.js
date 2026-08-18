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
  browseFiles: document.querySelector("#browseFile"),
  foodImage: document.querySelector("#foodImage"),
  preview: document.querySelector("#preview"),

  cancelAddItem: document.querySelector(".cancelAddItem"),
  submitAddItem: document.querySelector(".submitAddItem"),

  // Input Alerts

  foodInputAlert: document.querySelector(".foodInputAlert"),
  foodCategoryAlert: document.querySelector(".foodCategoryAlert"),
  foodNumberAlert: document.querySelector(".foodNumberAlert"),
  foodDescAlert: document.querySelector(".foodDescAlert"),

  // Menu Table
};

// state

let imageUrl = "";

// Helper function

function showValidationAlert(item) {
  item.classList.add("active");
}

function removeValidationAlert(item) {
  item.classList.remove("active");
}

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
  const category = elements.foodCategory.value.trim();
  const price = elements.foodPrice.value.trim();
  const description = elements.foodDesc.value.trim();
  const status = elements.foodStock.value.trim();

  let foodItem = {
    id,
    name,
    category,
    price,
    rating: 4.5,
    image: imageUrl,
    description,
    status,
  };
  console.log(foodItem);
}

function itemValidation() {
  const foodInput = elements.foodName.value.trim();
  const foodCategory = elements.foodCategory.value.trim();
  const foodPrice = elements.foodPrice.value.trim();
  const foodDesc = elements.foodDesc.value.trim();

  if (
    !foodInput ||
    foodCategory === "Select a category" ||
    foodPrice <= 0 ||
    !foodDesc
  ) {
    if (!foodInput) {
      showValidationAlert(elements.foodInputAlert);
      elements.foodName.focus();
    } else if (foodCategory === "Select a category") {
      showValidationAlert(elements.foodCategoryAlert);
      elements.foodCategory.focus();
    } else if (foodPrice <= 0) {
      showValidationAlert(elements.foodNumberAlert);

      elements.foodPrice.focus();
    } else {
      showValidationAlert(elements.foodDescAlert);
      elements.foodDesc.focus();
    }

    return;
  }

  createFoodItem();
}

createFoodItem();
statisticCardLive();

// Event listening

elements.browseFiles.addEventListener("click", () => {
  elements.foodImage.click();
});

elements.foodImage.addEventListener("change", () => {
  const file = elements.foodImage.files[0];
  const sizeInMB = file.size / (1024 * 1024);
  if (sizeInMB > 10) {
    alert("Image 10MB se zyada nahi honi chahiye");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    console.log("Image read ho gayi!");
    imageUrl = reader.result;
    preview.src = reader.result;
  };

  reader.readAsDataURL(file);
});

elements.submitAddItem.addEventListener("click", (e) => {
  e.preventDefault();
  itemValidation();
});
