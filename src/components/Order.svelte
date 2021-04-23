<script>
  import Button from "./Button.svelte";
  import OrderLine from "./OrderLine.svelte";
  import OrderMessage from "./OrderMessage.svelte";
  import flavors from "../flavors";
  import { orderLines } from "../stores";

  let errorMessage;

  function addOrderLine() {
    if (hasEmptyLine) {
      errorMessage = 'Hay lugar para otro relleno';
      return;
    }

    if (hasDuplicates) {
      errorMessage = 'Está dos veces el mismo relleno';
      return;
    }

    const newOrderLine = {
      id: `${Date.now()}${Math.floor(Math.random() * 999999)}`,
      quantity: 1,
      flavor: ''
    };

    $orderLines = [...$orderLines, newOrderLine];
  }

  function removeOrderLine(id) {
    $orderLines = $orderLines.filter(orderLine => orderLine.id != id);
  }

  function removeAllOrderLines() {
    if (validOrderLines.length == 0) {
      $orderLines = [];
      return;
    }

    const isSure = confirm(`¿Querés eliminar todo el pedido?`);

    if (!isSure) return;

    $orderLines = [];
  }

  let isSortAscending = true;

  function sortOrderLines() {
    if (validOrderLines.length == 0) return;

    const compareFunction = isSortAscending
      ? (a, b) => b.quantity - a.quantity
      : (a, b) => a.quantity - b.quantity;

    $orderLines = $orderLines.sort(compareFunction);

    isSortAscending = !isSortAscending;
  }

  function checkDuplicates(flavor) {
    return usedFlavors.filter(f => f.trim() === flavor.trim()).length > 1;
  }

  function getGreeting() {
    const currentHour = new Date().getHours();

    if (currentHour < 12) return 'Buenos días';

    if (currentHour < 20) return 'Buenas tardes';

    return 'Buenas noches';
  }

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

  $: orderMessage = `${getGreeting()}. Te encargo ${total} empanadas, por favor:\n\n${order}`;

  $: hasDuplicates = new Set(usedFlavors).size !== validOrderLines.length;

  $: hasEmptyLine = $orderLines.some(({ flavor }) => flavor.trim() == '');

  // Remove error message if there is no error.
  $: if (errorMessage) {
    errorMessage = hasEmptyLine || hasDuplicates ? errorMessage : '';
  }
</script>

<style>
  /* Main CSS variables are defined in public/global.css file. */

  .actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--small-gap);
  }

  :global(.span2) {
    grid-column: span 2;
  }

  p {
    border-radius: .2rem;
    text-align: center;
    background-color: var(--error-color);
    color: var(--white);
    padding: .5rem .9rem;
    font-size: .8rem;
  }
</style>

{#each $orderLines as {quantity, flavor, id} (id)}
  <OrderLine
    availableFlavors={availableFlavors}
    isDuplicated={checkDuplicates(flavor)}
    bind:quantity={quantity}
    bind:flavor={flavor}
    on:remove={() => removeOrderLine(id)}
  />
{/each}

{#if errorMessage}
  <p>{errorMessage}</p>
{/if}

<div class="actions">
  <Button
    class="primary span2"
    text={$orderLines.length == 0 ? 'Empezar pedido' : 'Agregar otra variedad'}
    svgIconPath="M20 15h4.071v2h-4.071v4.071h-2v-4.071h-4.071v-2h4.071v-4.071h2v4.071zm-8 6h-12v-2h12v2zm0-4.024h-12v-2h12v2zm0-3.976h-12v-2h12v2zm12-4h-24v-2h24v2zm0-4h-24v-2h24v2z"
    on:click={addOrderLine}
  />
  
  <Button
    class="secondary small"
    text="Eliminar pedido"
    svgIconPath="M21 6l-3 18h-12l-3-18h2.028l2.666 16h8.611l2.666-16h2.029zm-4.711-4c-.9 0-1.631-1.099-1.631-2h-5.316c0 .901-.73 2-1.631 2h-5.711v2h20v-2h-5.711z"
    on:click={removeAllOrderLines}
  />
  
  <Button
    class="secondary small"
    text="Ordenar pedido"
    svgIconPath={
      isSortAscending
        ? 'M6 21l6-8h-4v-10h-4v10h-4l6 8zm16-12h-8v-2h8v2zm2-6h-10v2h10v-2zm-4 8h-6v2h6v-2zm-2 4h-4v2h4v-2zm-2 4h-2v2h2v-2z'
        : 'M6 3l-6 8h4v10h4v-10h4l-6-8zm16 6h-8v-2h8v2zm2-6h-10v2h10v-2zm-4 8h-6v2h6v-2zm-2 4h-4v2h4v-2zm-2 4h-2v2h2v-2z'
    }
    on:click={sortOrderLines}
  />
</div>

{#if validOrderLines.length > 0}
  <OrderMessage {orderMessage} />
{/if}