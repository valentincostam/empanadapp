<script>
  import { createEventDispatcher } from "svelte";
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
    
    const isSure = confirm(`¿Estás seguro de quitar ${quantity} ${quantity == 1 ? 'empanada' : 'empanadas'} de ${flavor} del pedido?`);

    if (!isSure) return;

    dispatch('remove');
  }
</script>

<style>
  /* CSS variables are defined in public\global.css file. */
  
  .order-line {
    --grid-track-size: calc(var(--gap) * 3);
    display: grid;
    grid-template-columns:
      var(--grid-track-size)
      var(--grid-track-size)
      1fr
      var(--grid-track-size)
      var(--grid-track-size);
    grid-template-rows: var(--grid-track-size);
    gap: var(--small-gap);
    margin-bottom: var(--small-gap);
  }

  input {
    font-size: 1rem;
    width: 100%;
    padding: .6rem .8rem;
    border: 0;
    border-radius: 3px;
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

  button {
    border: 0;
    color: var(--white);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    cursor: pointer;
  }

  button:active {
    transform: translateY(2px);
  }

  button:focus {
    outline: 0;
    box-shadow: 0 0 0 3px var(--white);
  }

  .icon {
    --size: 12px;
    width: var(--size);
    height: var(--size);
    fill: var(--white);
  }

  .remove {
    background-color: var(--terciary-color);
  }

  .sum {
    background-color: var(--primary-color);
  }

  .substract {
    background-color: var(--secondary-color);
  }

  .quantity {
    -moz-appearance: textfield;
    text-align: right;
  }

  .quantity::-webkit-outer-spin-button,
  .quantity::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>

<div class="order-line">
  <button
    class="remove"
    on:click={remove}
  >
    <svg
      class="icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/>
    </svg>
  </button>
  
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

  <button
    class="sum"
    on:click={sum}
  >
    <svg
      class="icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/>
    </svg>
  </button>
  <button
    class="substract"
    on:click={substract}
  >
    <svg
      class="icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M0 10h24v4h-24z"/>
    </svg>
  </button>
</div>