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
    if (event.target.value < 0) {
      quantity = 0;
    };
  }
</script>

<style>
  .order-line {
    display: grid;
    grid-template-columns: 2rem 2rem 1fr 2rem 2rem;
    gap: .2rem;
    margin-bottom: .2rem;
  }

  .input {
    font-size: 1rem;
    width: 100%;
  }

  .quantity {
  }

  .flavor {
  }

  .wrong {
    border-color: red;
    border-style: dashed;
  }


</style>

<div class="order-line">
  <button
    class="button remove"
    on:click={() => dispatch('remove')}
  >×</button>
  
  <input
    class="input quantity"
    type="number"
    min="1"
    bind:value={quantity}
    on:blur={handleBlur}
  >

  <input
    class="input flavor"
    class:wrong={isDuplicated}
    type="text"
    list="availableFlavors"
    placeholder="relleno"
    bind:value={flavor}
  >
  
  <datalist id="availableFlavors">
    {#each availableFlavors as availableFlavor}
      <option value={availableFlavor}/>
    {/each}
  </datalist>

  <button
    class="button sum"
    on:click={sum}
  >+</button>
  <button
    class="button substract"
    on:click={substract}
  >-</button>
</div>