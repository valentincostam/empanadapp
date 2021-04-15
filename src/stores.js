import { writable } from "svelte/store";

const defaultOrderLines = [
  { id: 1, quantity: 1, flavor: "carne" },
  { id: 2, quantity: 1, flavor: "jamón y queso" },
];

const storedOrderLines = localStorage.orderLines
  ? JSON.parse(localStorage.orderLines)
  : null;

export const orderLines = writable(storedOrderLines || defaultOrderLines);

orderLines.subscribe(
  (value) => (localStorage.orderLines = JSON.stringify(value))
);
