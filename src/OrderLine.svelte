<script>
	import { createEventDispatcher, onMount } from "svelte";
	export let availableFlavors;
	export let quantity;
	export let flavor;
  export let isDuplicated;

	const dispatch = createEventDispatcher();
        let flavorInput;
  onMount(() => flavorInput.focus());

  function sum() {
    quantity++;
  }

  function substract() {
    if (quantity == 1) return;

    quantity--;
  }

  function handleBlur(event) {
    if (event.target.value < 0) {
      quantity = 0;
    };
  }
</script>

<style>
  .order-line {
    --gap: .4rem;
    display: grid;
    grid-template-columns: 3rem 3rem 1fr 3rem 3rem;
    grid-template-rows: 3rem;
    gap: var(--gap);
    margin-bottom: var(--gap);
  }

  .input {
    font-size: 1rem;
    width: 100%;
    padding: .6rem .8rem;
    border: 0;
    border-radius: 3px;
  }

  .input::-webkit-calendar-picker-indicator {
    display: none;
  }

  .button {
    border: 0;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
  }

  .icon {
    --size: 12px;
    width: var(--size);
    height: var(--size);
    fill: #fff;
  }

  .remove {
    background-color: #bd9354;
  }

  .sum {
    background-color: #85603f;
  }

  .substract {
    background-color: #bd9354;
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

  .wrong {
    border: .2rem dashed #c31111;
  }


</style>

<div class="order-line">
  <button
    class="button remove"
    on:click={() => dispatch('remove')}
  >
    <svg
      class="icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      ><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/>
    </svg>
  </button>
  
  <input
    class="input quantity"
    type="number"
    min="1"
    bind:value={quantity}
    on:blur={handleBlur}
  >

  <input
    class="input"
    class:wrong={isDuplicated}
    type="text"
    list="availableFlavors"
    placeholder="Escribí el relleno..."
    autocapitalize="off"
    bind:value={flavor}
    bind:this={flavorInput}
  >
  
  <datalist id="availableFlavors">
    {#each availableFlavors as availableFlavor}
      <option value={availableFlavor}/>
    {/each}
  </datalist>

  <button
    class="button sum"
    on:click={sum}
  >
    <svg
      class="icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      ><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/>
    </svg>
  </button>
  <button
    class="button substract"
    on:click={substract}
  >
    <svg
      class="icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      ><path d="M0 10h24v4h-24z"/>
    </svg>
  </button>
</div>
