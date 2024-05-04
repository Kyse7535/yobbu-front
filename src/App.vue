<script setup>
import { RouterView } from "vue-router";
import Header from "./components/Header.vue";
</script>

<template>
  <v-app class="w-100">
    <v-container fluid>
      <v-row>
        <v-col><Header /></v-col>
      </v-row>
      <v-row>
        <v-col>
          <RouterView></RouterView>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
