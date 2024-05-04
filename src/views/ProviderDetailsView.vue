<template>
  <v-row v-if="provider">
    <v-col cols="12">provider details</v-col>
    <v-col cols="12">{{ provider.id }}</v-col>
    <v-col cols="12">{{ provider.email }}</v-col>
    <v-col cols="12">{{ provider.siret }}</v-col>
    <v-col cols="12"
      ><p class="cursor-pointer" color="primary" @click="fetchProviderTrips">
        fetch provider trips
      </p></v-col
    >
    <v-col cols="12" v-if="loading_trips"> <h2>Loading trips ......</h2></v-col>
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
import { useStore } from "../store";
import TripList from "../components/TripList.vue";

const store = useStore();

const provider_trips = ref(null);
const provider = ref(null);
const loading_trips = ref(false);

async function fetchProviderTrips() {
  loading_trips.value = true;
  let link_to_provider_trips = provider.value.links.find(
    (l) => l.rel === "trips"
  );
  await store.fetchProviderTrips(link_to_provider_trips.href);
  provider_trips.value = [...store.getProviderTrips];
  loading_trips.value = false;
}

onMounted(() => {
  if (store.getProviderDetails && store.getProviderDetails.id) {
    provider.value = { ...store.getProviderDetails };
  }
});
</script>
<style scoped></style>
