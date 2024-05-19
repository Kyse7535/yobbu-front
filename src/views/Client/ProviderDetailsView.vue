<template>
  <v-row v-if="provider">
    <v-col cols="12">provider details</v-col>
    <v-col cols="12">{{ provider.id }}</v-col>
    <v-col cols="12">{{ provider.email }}</v-col>
    <v-col cols="12">{{ provider.siret }}</v-col>
    <v-col cols="12"
      ><p
        class="cursor-pointer"
        id="fetch-trip-provider"
        color="primary"
        @click="fetchProviderTrips"
      >
        fetch provider trips
      </p></v-col
    >
    <v-col cols="12" v-if="provider && loading_trips">
      <h2>Loading trips ......</h2></v-col
    >
    <v-col cols="12" v-if="provider_trips">
      <TripList :trips="provider_trips" />
    </v-col>
  </v-row>
  <v-row v-else>
    <h1>Unable to load data</h1>
  </v-row>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import useClientStoreComposable from "@/composables/clientStoreComposable";
import TripList from "@/components/Client/TripList.vue";
import { routeLocationKey } from "vue-router";
import { inject } from "vue";
import { onBeforeMount } from "vue";

const store = useClientStoreComposable();

const provider_trips = ref(null);
const provider = ref(null);
const loading_trips = ref(false);
const route = inject("route");

async function fetchProviderTrips() {
  loading_trips.value = true;
  await store.fetchProviderTrips(provider.value.id);
  provider_trips.value = [...store.getProviderTrips()];
  loading_trips.value = false;
}

onBeforeMount(async () => {
  if (store.getProviderDetails() && store.getProviderDetails().id) {
    provider.value = { ...store.getProviderDetails() };
  } else if (route.query.provider_id) {
    await store.fetchProviderDetails(route.query.provider_id);
    provider.value = { ...store.getProviderDetails() };

    alert(provider.value.id);
  }
});
</script>
<style scoped></style>
