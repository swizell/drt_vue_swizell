<template>
  <v-app>
    <v-main class="bg-gray-50">
      <HeaderBar />
      <v-container class="pa-0" fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import HeaderBar from "./components/HeaderBar.vue";
</script>

<style scoped>
.v-main {
  min-height: 100vh;
}
</style>
