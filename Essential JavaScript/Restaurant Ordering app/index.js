import { menuArray, orderArray } from "./data.js";

document.addEventListener("click", function (e) {
  if (e.target.dataset.add) {
    pushToOrderArray(e.target.dataset.add);
  } else if (e.target.id === "remove") {
    removeOrder(e.target.dataset.orderid);
  } else if (e.target.id === "completeOrderBtn") {
    showPayModal();
  } else if (e.target.id === "submit") {
    e.preventDefault();
    validateForm();
  }
});

function validateForm() {
  const data = new FormData(document.getElementById("paymentForm"));
  console.log(data.get("name"), data.get("cardNumber"), data.get("cvvNumber"));

  if (
    data.get("name") &&
    data.get("cardNumber").length == 19 &&
    data.get("cvvNumber").length == 3
  ) {
    submitOrder(data);
  } else {
    alert("Filled out correctly");
  }
}

function submitOrder() {
  const data = new FormData(document.getElementById("paymentForm"));
  document.getElementById("paymentForm").reset();
  document.getElementById("payModal").style.display = "none";
  document.getElementById("modalOverlay").style.display = "none";

  document.getElementById("thanks").classList.toggle("hidden");
  document.getElementById("order-section").classList.toggle("hidden");

  document.getElementById("thanks").innerHTML = `<p>Thanks, ${data.get(
    "name"
  )}! <br/> Your order is on its way!</p>`;
}

function showPayModal() {
  document.getElementById("payModal").style.display = "block";
  document.getElementById("modalOverlay").style.display = "block";
}

function removeOrder(orderID) {
  const index = orderArray.findIndex((food) => food.orderID === orderID);
  console.log(index);
  orderArray.splice(index, 1);
  renderOrderItems();
}

function pushToOrderArray(foodId) {
  if (document.getElementById("order-section").classList.contains("hidden")) {
    document.getElementById("order-section").classList.toggle("hidden");
  }
  let originalObject = menuArray.filter((food) => food.id == foodId)[0];
  let pushingObject = { ...originalObject, orderID: crypto.randomUUID() };
  orderArray.push(pushingObject);
  renderOrderItems();
}

function renderOrderItems() {
  let orderString = "";
  orderArray.forEach((food) => {
    orderString += `
        <div class="order">
          <div class="order-right">
            <p class="order-item">${food.name}</p>
            <p class="order-remove" data-orderid="${food.orderID}" id="remove">remove</p>
          </div>
          <p class="order-price">$${food.price}</p>
        </div>`;
  });

  let totalArray = `<p class="order-item">Total price:</p><p class="order-price">$${orderArray.reduce(
    (total, food) => total + food.price,
    0
  )}</p>`;

  document.getElementById("order-container").innerHTML = orderString;
  document.getElementById("order-total").innerHTML = totalArray;
}

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
