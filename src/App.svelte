<script>
  import OrderLine from "./OrderLine.svelte";
	import { flavors } from "./flavors.json";
	
  let orderLines = [
		{ id: 1, quantity: 1, flavor: "carne" },
    { id: 2, quantity: 1, flavor: "jamón y queso" }
  ];

	$: usedFlavors = orderLines.map(({ flavor }) => flavor);

	$: availableFlavors = flavors.filter(flavor => !usedFlavors.includes(flavor));

	$: validOrderLines = orderLines.filter(({ quantity, flavor }) => {
    const isEmpty = quantity <= 0 || flavor.trim() == '';
    const isDuplicated = checkDuplicates(flavor);

    return !isEmpty && !isDuplicated;
  });
	
	$: total = validOrderLines.reduce((total, { quantity }) => total + quantity, 0);

	$: order = validOrderLines
    .map(({ quantity, flavor }) => `${quantity} de ${flavor.trim()}\n`)
    .join('');

	$: message = `Hola. Te encargo ${total} empanadas, por favor:\n\n${order}`;

  $: hasDuplicates = new Set(usedFlavors).size !== validOrderLines.length;

  $: hasEmptyLine = orderLines.some(({ flavor }) => flavor.trim() == '');
	
  function addOrderLine() {
    const newOrderLine = {
      id: `${Date.now()}${Math.floor(Math.random() * 9999)}`,
      quantity: 1,
      flavor: ''
    };

    orderLines = [...orderLines, newOrderLine];
  }

	function removeOrderLine(id) {
		orderLines = orderLines.filter(orderLine => orderLine.id != id);
	}

	function copyMessage() {
		navigator.clipboard.writeText(message);
	}

  function checkDuplicates(flavor) {
    return usedFlavors.filter(f => f.trim() === flavor.trim()).length > 1;
  }
</script>

<style>
  .main {
    padding: 1rem;
  }

  .title {
    text-align: center;
  }

  .add-order-line {
    display: block;
    text-align: center;
    padding: .7rem 1.2rem;
    width: 100%;
    border: 0;
    color: #fff;
    background-color: #ffa753;
    font-size: 1rem;
    border-radius: 3px;
  }

  .message {
    border-radius: 3px;
    padding: 1rem;
    font-size: 1.1rem;
    white-space: pre-wrap;
    border: 1px solid #ccc;
  }

  .copy-message {
    display: block;
    text-align: center;
    padding: .7rem 1.2rem;
    width: 100%;
    border: 0;
    font-size: 1rem;
    border-radius: 3px;
    background-color: #fff;
    border: 1px solid blue;
    color: blue;
  }
</style>

<main class="main">
	<h1 class="title">Empanadapp</h1>

  {#each orderLines as {quantity, flavor, id} (id)}
    <OrderLine
			availableFlavors={availableFlavors}
      isDuplicated={checkDuplicates(flavor)}
      bind:quantity={quantity}
      bind:flavor={flavor}
      on:remove={() => removeOrderLine(id)}
    />
  {/each}

  {#if !hasEmptyLine && !hasDuplicates}
    <button
      class="add-order-line"
      on:click={addOrderLine}
    >Agregar otro relleno</button>
  {/if}

	<pre class="message">{message}</pre>

	<button
    class="copy-message"
    on:click={copyMessage}
  >Copiar mensaje</button>
</main>