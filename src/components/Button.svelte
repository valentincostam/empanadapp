<script>
  export let disabled = false;
  export let svgIconPath;
  export let text = '';
  let className = '';
  export { className as class}
</script>

<style>
  /* Main CSS variables are defined in public/global.css file. */

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: .5rem;
    padding: .7em 1.2em;
    border: 0;
    color: var(--white);
    font-size: 1rem;
    border-radius: .2rem;
    cursor: pointer;
    background-color: var(--base-color);
  }

  button:active {
    transform: translateY(2px);
  }

  button:focus {
    outline: 0;
    box-shadow: 0 0 0 3px var(--white);
  }

  svg {
    --size: 1em;
    width: var(--size);
    height: var(--size);
    flex: 0 0 var(--size);
    fill: var(--white);
    pointer-events: none;
  }

  .primary {
    background-color: var(--primary-color);
  }

  .secondary {
    background-color: var(--secondary-color);
  }

  .small {
    font-size: .85rem;
  }

  .no-text {
    padding: .2em;
  }

  .no-text > svg {
    --size: .75em;
  }

  .full-width {
    width: 100%;
  }
</style>

<button
  class={`${className}${text ? '' : ' no-text'}`}
  {disabled}
  on:click
>
  {#if svgIconPath}
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d={svgIconPath}/>
    </svg>
  {/if}
  {text}
</button>