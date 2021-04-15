<script>
  import OrderLine from "./OrderLine.svelte";
	import { flavors } from "./flavors.json";
  import { orderLines } from "./stores";

  let copyButton;
	
	$: usedFlavors = $orderLines.map(({ flavor }) => flavor);

	$: availableFlavors = flavors.filter(flavor => !usedFlavors.includes(flavor));

	$: validOrderLines = $orderLines.filter(({ quantity, flavor }) => {
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

  $: hasEmptyLine = $orderLines.some(({ flavor }) => flavor.trim() == '');
	
  function addOrderLine() {
    const newOrderLine = {
      id: `${Date.now()}${Math.floor(Math.random() * 9999)}`,
      quantity: 1,
      flavor: ''
    };

    $orderLines = [...$orderLines, newOrderLine];
  }

	function removeOrderLine(id) {
		$orderLines = $orderLines.filter(orderLine => orderLine.id != id);
	}

	function copyMessage() {
		navigator.clipboard.writeText(message);
    copyButton.querySelector('span').textContent = '¡Copiado!';
    copyButton.disabled = true;
    
    setTimeout(() => {
      copyButton.querySelector('span').textContent = 'Copiar mensaje';
      copyButton.disabled = false;
    }, 2000);
	}

  function checkDuplicates(flavor) {
    return usedFlavors.filter(f => f.trim() === flavor.trim()).length > 1;
  }
</script>

<style>
  .container {
    padding: 1rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .title {
    text-align: center;
    font-weight: 900;
    font-size: 2.4rem;
    color: #85603f;
    letter-spacing: -.12rem;
    margin: 0;
    margin-bottom: 1rem;
  }

  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: .5rem;
  }

  .button__icon {
    --size: 18px;
    width: var(--size);
    height: var(--size);
    fill: #fff;
  }

  .add-order-line {
    padding: .7rem 1.2rem;
    width: 100%;
    border: 0;
    background-color: #85603f;
    color: #fff;
    font-size: 1rem;
    border-radius: 3px;
    font-weight: bold;
  }

  .message {
    border-radius: 3px;
    padding: 1rem;
    font-size: 1.1rem;
    white-space: pre-wrap;
    margin: 1rem 0 .5rem;
    background-color: #fff;
  }

  .copy-message {
    padding: .7rem 1.2rem;
    width: 100%;
    border: 0;
    font-size: 1rem;
    border-radius: 3px;
    background-color: #9e7540;
    color: #fff;
  }

  .footer {
    margin-top: 1rem;
    text-align: center;
  }

  .link {
    text-decoration: none;
    color: #85603f;
  }

  .link:hover {
    text-decoration: underline;
  }
</style>

<div class="container">
  <header>
    <h1 class="title">empanad.app</h1>
  </header>

  <main>
    {#each $orderLines as {quantity, flavor, id} (id)}
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
        class="button add-order-line"
        on:click={addOrderLine}
      >
        <svg
          class="button__icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M20 15h4.071v2h-4.071v4.071h-2v-4.071h-4.071v-2h4.071v-4.071h2v4.071zm-8 6h-12v-2h12v2zm0-4.024h-12v-2h12v2zm0-3.976h-12v-2h12v2zm12-4h-24v-2h24v2zm0-4h-24v-2h24v2z"/>
        </svg>
        Agregar otro relleno
      </button>
    {/if}

    <div class="message">
      {message}
    </div>
    <button
      bind:this={copyButton}
      class="button copy-message"
      on:click={copyMessage}
    >
      <svg
        class="button__icon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M18 6v-6h-18v18h6v6h18v-18h-6zm-12 10h-4v-14h14v4h-10v10zm16 6h-14v-14h14v14z"/>
      </svg>
      <span>Copiar mensaje</span>
    </button>
  </main>

  <footer class="footer">
    Hecho por <a class="link" href="https://valentincosta.com"><strong>Valentín Costa</strong></a>
  </footer>
</div>