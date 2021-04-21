<script>
  import OrderLine from "./OrderLine.svelte";
  import { flavors } from "./flavors.json";
  import { orderLines } from "./stores";

  let copyButton;
  let messageWasCopied = false;
  
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

  $: message = `${getGreeting()}. Te encargo ${total} empanadas, por favor:\n\n${order}`;

  $: hasDuplicates = new Set(usedFlavors).size !== validOrderLines.length;

  $: hasEmptyLine = $orderLines.some(({ flavor }) => flavor.trim() == '');

  function getGreeting() {
    const currentHour = new Date().getHours();

    if (currentHour < 12) return 'Buenos días';

    if (currentHour < 20) return 'Buenas tardes';

    return 'Buenas noches';
  }
  
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

  function removeAllOrderLines() {
    const isSure = confirm(`¿Querés eliminar todo pedido?`);

    if (!isSure) return;

    $orderLines = [];
  }

  function sortOrderLines() {
    $orderLines = $orderLines.sort((a, b) => b.quantity - a.quantity);
  }

  function copyMessage() {
    navigator.clipboard.writeText(message);
    copyButton.querySelector('span').textContent = '¡Copiado!';
    copyButton.disabled = true;
    messageWasCopied = true;
    
    setTimeout(() => {
      copyButton.querySelector('span').textContent = 'Copiar mensaje';
      copyButton.disabled = false;
      messageWasCopied = false;
    }, 2000);
  }

  function checkDuplicates(flavor) {
    return usedFlavors.filter(f => f.trim() === flavor.trim()).length > 1;
  }
</script>

<style>
  /* CSS variables are defined in public\global.css file. */

  .container {
    padding: 1rem;
    max-width: 600px;
    margin: 0 auto;
  }

  h1 {
    text-align: center;
    font-weight: 900;
    font-size: 2.6rem;
    color: var(--primary-color);
    letter-spacing: -.12rem;
    margin: 0;
  }

  p {
    color: var(--primary-color);
    font-size: 1.1rem;
    text-align: center;
    margin: 0;
    margin-bottom: calc(var(--gap) * 1.5);
  }

  .action-buttons {
    --grid-track-size: calc(var(--gap) * 3);
    display: grid;
    grid-template-columns:
      var(--grid-track-size)
      1fr
      var(--grid-track-size);
    grid-template-rows: var(--grid-track-size);
    gap: var(--small-gap);
  }

  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: .5rem;
    /* padding: .7rem 1.2rem; */
    width: 100%;
    border: 0;
    color: var(--white);
    font-size: 1rem;
    border-radius: 3px;
    cursor: pointer;
    height: calc(var(--gap) * 3);
  }

  .button:active {
    transform: translateY(2px);
  }

  .button:disabled {
    cursor: not-allowed;
  }

  a:focus,
  .button:focus {
    outline: 0;
    box-shadow: 0 0 0 3px var(--white);
  }

  .remove {
    background-color: var(--terciary-color);
  }

  .sort {
    background-color: var(--secondary-color);
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

  .message--copied {
    box-shadow: 0 0 0 rgba(255, 255, 255, 1);
    animation: pulse 1s 1;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 255, 255, .8);
    }
    70% {
      box-shadow: 0 0 0 1rem rgba(255, 255, 255, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    }
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
    <p>Armá tu pedido de empanadas</p>
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

    <div class="action-buttons">
      <button
        class="button remove"
        on:click={removeAllOrderLines}
      >
        <svg
          class="button__icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M21 6l-3 18h-12l-3-18h2.028l2.666 16h8.611l2.666-16h2.029zm-4.711-4c-.9 0-1.631-1.099-1.631-2h-5.316c0 .901-.73 2-1.631 2h-5.711v2h20v-2h-5.711z"/>
        </svg>
      </button>
      
      <button
        class="button add-order-line"
        disabled={hasEmptyLine || hasDuplicates}
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
          {$orderLines.length == 0 ? 'Empezar pedido' : 'Agregar otra variedad'}
      </button>

      <button
        class="button sort"
        on:click={sortOrderLines}
      >
        <svg
          class="button__icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M6 21l6-8h-4v-10h-4v10h-4l6 8zm16-12h-8v-2h8v2zm2-6h-10v2h10v-2zm-4 8h-6v2h6v-2zm-2 4h-4v2h4v-2zm-2 4h-2v2h2v-2z"/>
        </svg>
      </button>
    </div>

    {#if validOrderLines.length}
      <div class="message {messageWasCopied ? 'message--copied' : ''}">
        {message}
      </div>

      <button
        class="button copy-message"
        bind:this={copyButton}
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