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

  h1 {
    text-align: center;
    font-weight: 900;
    font-size: 2.4rem;
    color: var(--primary-color);
    letter-spacing: -.12rem;
    margin: 0;
    margin-bottom: 1rem;
  }

  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: .5rem;
    padding: .7rem 1.2rem;
    width: 100%;
    border: 0;
    color: var(--white);
    font-size: 1rem;
    border-radius: 3px;
    cursor: pointer;
  }

  button:active {
    transform: translateY(2px);
  }

  a:focus,
  button:focus {
    outline: 0;
    box-shadow: 0 0 0 3px var(--white);
  }

  .button__icon {
    --size: 18px;
    width: var(--size);
    height: var(--size);
    fill: var(--white);
  }

  .add-order-line {
    background-color: var(--primary-color);
  }

  .message {
    border-radius: 3px;
    padding: 1rem;
    font-size: 1.1rem;
    white-space: pre-wrap;
    margin: var(--gap) 0 var(--small-gap);
    background-color: var(--white);
  }

  .copy-message {
    background-color: var(--secondary-color);
  }

  footer {
    margin-top: var(--gap);
    text-align: center;
    color: var(--primary-color);
    font-size: .9rem;
  }

  .footer__icon {
    --size: 14px;
    vertical-align: middle;
    width: var(--size);
    height: var(--size);
    fill: var(--terciary-color);
  }

  a {
    text-decoration: none;
    color: var(--primary-color);
  }

  a:hover {
    border-bottom: 3px dashed var(--terciary-color);
  }
</style>

<div class="container">
  <header>
    <h1>empanad.app</h1>
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
        Agregar {$orderLines.length == 0 ? 'una' : 'otra'} variedad
      </button>
    {/if}

    {#if validOrderLines.length}
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
    {/if}
  </main>

  <footer>
    Hecho con
    <svg
      class="footer__icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill-rule="evenodd"
      clip-rule="evenodd"
    >
      <path d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z"/>
    </svg>
    por <a href="https://valentincosta.com"><strong>Valentín Costa</strong></a>
  </footer>
</div>