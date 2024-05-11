<script setup>
import { onBeforeMount } from "vue";
import { RouterView } from "vue-router";
import Header from "./components/Header.vue";
import { useRoute, useRouter } from "vue-router";
import { provide } from "vue";
import useHandlerMessage from "./composables/HandlerMessage";
const route = useRoute();
const router = useRouter();
const handlerMessage = useHandlerMessage();
const isProvider = true;
provide("isProvider", isProvider);
provide("route", route);
provide("router", router);
provide("handlerMessage", handlerMessage);

onBeforeMount(() => {
  let name = isProvider ? "homeProvider" : "homeClient";
  router.push({
    name,
  });
});
</script>

<template>
  <v-app class="ma-0">
    <v-container fluid class="pa-0">
      <v-row>
        <v-col><Header /></v-col>
      </v-row>
      <v-row class="pa-0">
        <v-col class="pa-5">
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
