import { menuData } from "../data/menuData.js";
import { cart } from "../data/cartdata.js";
import { saveData } from "../utils/storage.js";

const foodGrid = document.querySelector("#food-grid");
const cartUpdate = document.querySelector("#cartUpdate");

function showLoading() {
  let skeletonCard = "";
  for (const _ of menuData) {
    skeletonCard += `
            <div class="skeleton-card">
              <div class="skeleton skeleton-thumb"></div>
              <div class="skeleton skeleton-line w-60"></div>
              <div class="skeleton skeleton-line w-80"></div>
              <div class="skeleton skeleton-line w-40"></div>
            </div>
  `;
  }
  foodGrid.innerHTML = skeletonCard;
}

function showProducts() {
  let card = "";
  for (const food of menuData) {
    card += `
    <article class="food-card">
      <div class="food-card-media">
        <img 
          src="${food.image}" 
          alt="${food.name}" 
        />

        <button class="food-fav-btn" aria-label="Add to favorites">
          <i class="fa-solid fa-heart"></i>
        </button>

        <span class="food-card-category">
          ${food.category}
        </span>
      </div>

      <div class="food-card-body">
        <div class="food-card-title-row">
          <h3 class="food-card-title">
            ${food.name}
          </h3>

          <span class="rating">
            <i class="fa-solid fa-star"></i> ${food.rating}
          </span>
        </div>

        <p class="food-card-desc">
          ${food.description}
        </p>

        <div class="food-card-footer">
          <div class="food-price">
            RS:${food.price}
          </div>

          <button class="btn btn-primary btn-sm addBtn" data-id="${food.id}">
            <i class="fa-solid fa-cart-plus"></i> Add
          </button>
        </div>
      </div>
    </article>
  `;
  }

  foodGrid.innerHTML = card;
}

showLoading();

setTimeout(() => {
  showProducts();
}, 2000);

foodGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".addBtn");
  if (!button) return;
  const btnID = Number(button.dataset.id);
  const product = menuData.find((item) => item.id === btnID);
  const existingProduct = cart.find((item) => item.id === btnID);
  if (existingProduct) {
    // Agar pehle se hai
    existingProduct.quantity++;
  } else {
    // Agar pehli baar add ho raha hai
    cart.push({
      ...product,
      quantity: 1,
    });
    cartUpdate.textContent = `View Cart (${cart.length})`;
  }
  saveData("cart", cart);
});

cartUpdate.textContent = `View Cart (${cart.length})`;
