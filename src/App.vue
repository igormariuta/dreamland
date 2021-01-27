<template>
  <div id="app">
    <component :is="layout">
      <router-view/>
    </component>
  </div>
</template>

<script>

import MainLayout from './layouts/main.vue';
import AuthLayout from './layouts/auth.vue';

export default {
  computed: {
    layout() {
      return (this.$route.meta.layout || "main") + '-layout';
    }
  },
  components: {
    MainLayout, AuthLayout
  }
}
</script>
