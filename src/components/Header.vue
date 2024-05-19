<template>
  <v-row>
    <v-col cols="12">
      <v-toolbar density="compact">
        <v-app-bar-nav-icon></v-app-bar-nav-icon>

        <v-toolbar-title @click="goHome" class="cursor-pointer"
          >Title</v-toolbar-title
        >

        <v-spacer></v-spacer>

        <span v-if="!isConnected">
          <v-btn id="signin-btn" class="bg-primary mr-2">sign-in</v-btn>
          <v-btn id="signup-btn" class="bg-primary ml-2">sign-up</v-btn>
        </span>
        <span v-else>
          <v-avatar color="info" class="text-white cursor-pointer">
            <v-icon icon="mdi-account-circle"></v-icon>
          </v-avatar>
          <v-btn id="panier" icon @click="goToPanier" v-if="!isProvider">
            <v-icon icon="mdi-cart-outline"></v-icon>
            ({{ store.getPanier().length }})
          </v-btn>
        </span>
      </v-toolbar>
    </v-col>
  </v-row>
</template>
<script setup>
import { inject, ref } from "vue";
import useClientStoreComposable from "@/composables/clientStoreComposable";
const isConnected = ref(true);
const isProvider = inject("isProvider");
const store = useClientStoreComposable();
const router = inject("router");
function goToPanier() {
  router.push({
    name: "panier",
  });
}

function goHome() {
  let name = isProvider ? "homeProvider" : "homeClient";
  router.push({
    name,
  });
}
</script>
<style scoped>
a {
  text-decoration: none;
}
</style>
