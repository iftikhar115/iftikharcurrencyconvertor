// ✅ BASE URL (FOLDER ONLY — FILE NAHI)
const Base_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

// DOM
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromcurrency = document.querySelector(".from select");
const tocurrency = document.querySelector(".to select");
const msg = document.querySelector(".message");
const amountInput = document.querySelector(".amount input");

// 🔽 Populate dropdowns
for (let select of dropdowns) {
  for (let currcode in countryList) {
    let option = document.createElement("option");
    option.innerText = currcode;
    option.value = currcode;

    if (select.name === "from" && currcode === "USD") {
      option.selected = true;
    } else if (select.name === "to" && currcode === "INR") {
      option.selected = true;
    }

    select.append(option);
  }

  select.addEventListener("change", (e) => {
    updateFlag(e.target);
  });
}

// 🚩 Update flag
function updateFlag(element) {
  let currcode = element.value;
  let countryCode = countryList[currcode];
  let img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

// 🔁 Button click
btn.addEventListener("click", async (e) => {
  e.preventDefault();

  // amount validation
  let amount = Number(amountInput.value);
  if (!amount || amount < 1) {
    amount = 1;
    amountInput.value = "1";
  }

  // internet check
  if (!navigator.onLine) {
    msg.innerText = "❌ Internet off hai";
    return;
  }

  try {
    const from = fromcurrency.value.toLowerCase();
    const to = tocurrency.value.toLowerCase();

    // ✅ CORRECT API URL
    const URL = `${Base_URL}/${from}.json`;

    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error("API error");
    }

    const data = await response.json();

    // data safety
    if (!data[from] || !data[from][to]) {
      throw new Error("Currency not found");
    }

    const rate = data[from][to];
    const result = (amount * rate).toFixed(2);

    msg.innerText = `${amount} ${fromcurrency.value} = ${result} ${tocurrency.value}`;
  } catch (err) {
    console.error(err);
    msg.innerText = "⚠️ Something went wrong";
  }
});



