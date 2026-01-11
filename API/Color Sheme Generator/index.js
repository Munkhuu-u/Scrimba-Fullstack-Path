const root = document.getElementById("root");
const form = document.getElementById("form-id");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  getColorScheme();
});

function getColorScheme() {
  const color = document.getElementById("colorPicker").value.slice(-6);
  const type = document.getElementById("schemeType").value;
  console.log(`https://www.thecolorapi.com/scheme?hex=${color}&mode=${type}`);
  fetch(`https://www.thecolorapi.com/scheme?hex=${color}&mode=${type}`)
    .then((res) => res.json())
    .then((data) => renderColorScheme(data));
}

function renderColorScheme(data) {
  let html = "";
  data.colors.forEach((color) => {
    html += `<div class="complete" id="${color.hex.clean}-combined">
          <div class="color" id="${color.hex.clean}-color" style="background-color: ${color.hex.value}"></div>
          <p class="name">${color.hex.value}</p>
        </div>`;
  });

  document.getElementById("colors-container").innerHTML = html;

  data.colors.forEach((color) => {
    document
      .getElementById(`${color.hex.clean}-color`)
      .addEventListener("click", () => {
        navigator.clipboard.writeText(color.hex.clean);
      });
  });
}

getColorScheme();
