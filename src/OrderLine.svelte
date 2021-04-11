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
  .quantity {
    width: 3rem;
    text-align: right;
  }

  .has-error {
    border-color: red;
    border-style: dashed;
  }
</style>

<div>
  <button class="remove" on:click={() => dispatch('remove')}>X</button>
  
  <input
    class="quantity"
    type="number"
    min="1"
    bind:value={quantity}
    on:blur={handleBlur}
  >

  <input
    class="flavor"
    class:has-error={isDuplicated}
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

  <button class="" on:click={sum}>+</button>
  <button class="" on:click={substract}>-</button>
</div>