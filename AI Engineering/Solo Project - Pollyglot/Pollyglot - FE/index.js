const translate = document.getElementById("myForm");

translate.addEventListener("submit", submitHandler);

async function submitHandler(e) {
  e.preventDefault();

  const formData = new FormData(translate);
  const originalText = formData.get("orignalText");
  const language = formData.get("language");

  const response = await fetch("/api/translation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ originalText, language }),
  });

  const data = await response.json();
  console.log("data: ", data);

  const reply = data.translated;

  document.getElementById("translated-response").textContent = reply;
}
