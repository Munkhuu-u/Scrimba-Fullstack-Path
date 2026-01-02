import { menuArray, orderArray } from "./data.js";

document.addEventListener("click", function (e) {
  if (e.target.dataset.add) {
    const foodId = e.target.dataset.add;
    pushToOrderArray(foodId);
    document.getElementById("order-section").style.display = "block";
  }
});

function pushToOrderArray(foodId) {
  orderArray.push(
    menuArray.filter((food) => {
      return food.id == foodId;
    })[0]
  );
  renderOrderItems();
}

function renderOrderItems() {}

function stringMaker() {
  let string = "";
  menuArray.forEach((food) => {
    string += `<div data-food="${food.id}" class="food-container">
        <div class="meal-right">
            <p class="meal-emoji">${food.emoji}</p>
            <div class="description">
                <p class="meal-name">${food.name}</p>
                <p class="meal-ingredient">${food.ingredients.join(", ")}</p>
                <p class="meal-price">$${food.price}</p>
            </div>
        </div>
        <button id="add-button" data-add="${food.id}">+</button>
      </div> `;
  });

  render(string);
}

function render(string) {
  document.getElementById("container").innerHTML = `${string}`;
}

stringMaker();
