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
</style>

<main class="main">
	<h1>Empanadapp</h1>

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
    <button on:click={addOrderLine}>Agregar otro relleno</button>
  {/if}

	<pre>{message}</pre>

	<button on:click={copyMessage}>Copiar mensaje</button>
</main>