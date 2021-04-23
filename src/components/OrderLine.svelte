<script>
  import { createEventDispatcher } from "svelte";
  import Button from "./Button.svelte";
  export let availableFlavors;
  export let quantity;
  export let flavor;
  export let isDuplicated;

  const dispatch = createEventDispatcher();

  function sum() {
    quantity++;
  }

  function substract() {
    if (quantity == 1) return;

    quantity--;
  }

  function handleBlur(event) {
    if (event.target.value < 1) {
      quantity = 1;
    };
  }

  function remove() {
    const isEmpty = quantity <= 0 || flavor.trim() == '';

    if (isEmpty) return dispatch('remove');
    
    const isSure = confirm(`¿Querés quitar ${quantity} ${quantity == 1 ? 'empanada' : 'empanadas'} de ${flavor} del pedido?`);

    if (!isSure) return;

    dispatch('remove');
  }
</script>

<style>
  /* Main CSS variables are defined in public/global.css file. */
  
  .order-line {
    --grid-track: calc(var(--gap) * 3);
    display: grid;
    grid-template-columns:
      repeat(2, var(--grid-track))
      1fr
      repeat(2, var(--grid-track));
    grid-template-rows: var(--grid-track);
    gap: var(--small-gap);
    margin-bottom: var(--small-gap);
  }

  input {
    font-size: 1rem;
    width: 100%;
    padding: .6rem .8rem;
    border: 0;
    border-radius: .2rem;
    color: var(--font-color)
  }

  input::-webkit-calendar-picker-indicator {
    display: none;
  }

  input:focus {
    outline: 0;
    box-shadow: 0 0 0 3px var(--primary-color);
  }

  input.wrong {
    box-shadow: 0 0 0 .2rem var(--error-color);
  }

  .quantity {
    -moz-appearance: textfield;
    text-align: center;
  }

  .quantity::-webkit-outer-spin-button,
  .quantity::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>

<div class="order-line">
  <Button
    svgIconPath="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"
    on:click={remove}
  />
  
  <input
    class="quantity"
    type="number"
    min="1"
    bind:value={quantity}
    on:blur={handleBlur}
  >

  <input
    class:wrong={isDuplicated}
    type="text"
    list="availableFlavors"
    placeholder="Escribí el relleno..."
    autocapitalize="off"
    bind:value={flavor}
  >
  
  <datalist id="availableFlavors">
    {#each availableFlavors as availableFlavor}
      <option value={availableFlavor}/>
    {/each}
  </datalist>

  <Button
    class="primary"
    svgIconPath="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"
    on:click={sum}
  />
  
  <Button
    svgIconPath="M0 10h24v4h-24z"
    on:click={substract}
  />
</div>