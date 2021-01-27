<template>

  <div class="loader" :class="{ 'top' : isTop }">
    <!-- <div class="circ">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div> -->
  </div>

</template>


<script>
  export default {
    props: ['isTop'],
  }
</script>

<style scoped>

  .loader {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--color-primary);
    animation: colors 2s infinite, show .3s ease;
    opacity: 1;
    z-index: 5;
  }

  .loader.top {
    top: 0;
  }

  .circ {
    display: inline-block;
    position: relative;
    width: 58px;
    height: 30px;
  }

  .circ div {
    position: absolute;
    top: 10px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--color-primary);
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }

  .circ div:nth-child(1) {
    left: 0px;
    animation: circ1 0.6s infinite;
  }

  .circ div:nth-child(2) {
    left: 0px;
    animation: circ2 0.6s infinite;
  }

  .circ div:nth-child(3) {
    left: 24px;
    animation: circ2 0.6s infinite;
  }

  .circ div:nth-child(4) {
    left: 48px;
    animation: circ3 0.6s infinite;
  }

  @keyframes circ1 {
    0% {
      transform: scale(0);
    }

    100% {
      transform: scale(1);
    }
  }

  @keyframes circ2 {
    0% {
      transform: translate(0, 0);
    }

    100% {
      transform: translate(24px, 0);
    }
  }

  @keyframes circ3 {
    0% {
      transform: scale(1);
    }

    100% {
      transform: scale(0);
    }
  }

  @keyframes colors {
    0% {
      background: var(--color-primary);
    }

    50% {
      background: var(--color-1);
    }

    100% {
      background: var(--color-primary);
    }
  }

  @keyframes show {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 1;
    }
  }

</style>