<template>
  <v-row>
    <v-col cols="12">
      <h1>Provider</h1>
      <ul>
        <li
          v-for="(option, index) in menu"
          :key="index"
          @click="goToPage(option.value)"
          class="cursor-pointer"
        >
          >
          {{ option.text }}
        </li>
      </ul>
    </v-col>
  </v-row>
</template>
<script setup>
import { ref, inject } from "vue";
const menu = ref([
  { text: "consulter les trips", value: "/getTrips" },
  { text: "Creer trips", value: "/addTrip" },
]);
const router = inject("router");

function goToPage(path) {
  router.push({ path });
}
</script>
<style scoped></style>
