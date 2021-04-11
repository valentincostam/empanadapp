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
    grid-template-columns: 2rem 1fr 4fr 2rem 2rem;
    gap: .2rem;
    margin-bottom: .2rem;
  }

  .input {
    font-size: 1rem;
    width: 100%;
    padding: .5rem 1rem;
    border: 1px solid #ccc;
  }

  .button {
    border: 0;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .icon {
    --size: 12px;
    width: var(--size);
    height: var(--size);
    fill: #fff;
  }

  .remove {
    background-color: red;
  }

  .sum {
    background-color: green;
  }

  .substract {
    background-color: blue;
  }

  .quantity {
    text-align: right;
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