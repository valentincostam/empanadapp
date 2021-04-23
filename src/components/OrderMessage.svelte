<script>
  import Button from "./Button.svelte";

  export let orderMessage;

  let isCopied = false;

  function copyMessage() {
    if (isCopied) return;

    navigator.clipboard.writeText(orderMessage);
    isCopied = true;
    
    setTimeout(() => isCopied = false, 2000);
  }
</script>

<style>
  .order-message {
    border-radius: .2rem;
    padding: 1rem;
    font-size: 1.1rem;
    white-space: pre-wrap;
    margin: var(--gap) 0 var(--small-gap);
    background-color: var(--white);
  }

  .order-message--copied {
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
</style>

<div class="order-message {isCopied ? 'order-message--copied' : ''}">
  {orderMessage}
</div>

<Button
  class="full-width"
  text={isCopied ? '¡Copiado!' : 'Copiar mensaje'}
  svgIconPath="M18 6v-6h-18v18h6v6h18v-18h-6zm-12 10h-4v-14h14v4h-10v10zm16 6h-14v-14h14v14z"
  disabled={isCopied}
  on:click={copyMessage}
/>