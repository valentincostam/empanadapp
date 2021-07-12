import { writable } from "svelte/store";

let initialOrderLines = [
  { id: 1, quantity: 4, flavor: "carne" },
  { id: 2, quantity: 1, flavor: "verdura y queso" },
  { id: 3, quantity: 1, flavor: "choclo" },
];

const hashParams = new URLSearchParams(location.hash.substr(1));

const urlOrderLines = [...hashParams.entries()].map(([flavor, quantity]) => {
  const amount = parseInt(quantity);

  return {
    id: `${Date.now()}${Math.floor(Math.random() * 999999)}`,
    quantity: Number.isInteger(amount) ? amount : 1,
    flavor,
  };
});

if (urlOrderLines.length) {
  initialOrderLines = urlOrderLines;
} else if (localStorage.orderLines) {
  initialOrderLines = JSON.parse(localStorage.orderLines);
}

export const orderLines = writable(initialOrderLines);

orderLines.subscribe((value) => {
  const validOrderLines = value.filter(
    ({ quantity, flavor }) => quantity > 0 && flavor.trim() != ""
  );

  localStorage.orderLines = JSON.stringify(validOrderLines);

  const searchParams = new URLSearchParams();

  validOrderLines.forEach(({ flavor, quantity }) =>
    searchParams.set(flavor, quantity)
  );

  location.hash = searchParams.toString();
});
