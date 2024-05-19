<template>
  <v-row v-if="loadingData">
    <v-col cols="12"><h2>Loading data</h2></v-col>
  </v-row>
  <v-row v-if="!loadingData && trip">
    <v-col cols="12">
      <h1>Trip Details</h1>
      <h3>{{ trip.id }}</h3>
    </v-col>
    <v-col cols="12">
      <p>{{ trip.city_departure }} ----- > {{ trip.city_arrival }}</p>
    </v-col>
    <v-col cols="12">{{ trip.description }}</v-col>
    <v-col cols="12"
      ><v-btn @click="goToCommand(trip.id)" id="btn-commander"
        >Commander</v-btn
      ></v-col
    >

    <v-col cols="12" class="cursor-pointer"
      ><v-avatar
        id="provider_avatar"
        color="surface-variant"
        text="lorem"
        @click="goToProviderDetails"
      ></v-avatar
    ></v-col>
  </v-row>
</template>
<script setup>
import { computed, inject, onMounted, ref, watch } from "vue";
import useClientStoreComposable from "@/composables/clientStoreComposable";

const loadingData = ref(false);
const route = inject("route");
const router = inject("router");
const store = useClientStoreComposable();
const handlerMessage = inject("handlerMessage");

const trip = ref(null);

async function searchTripById(id) {
  loadingData.value = true;
  let result = store.getTrips().find((trip) => trip.id === id) || {};
  if (result) {
    trip.value = { ...result };
  } else {
    await store.fetchTripById(id);
    result = store.getTrips().find((trip) => trip.id === id);
    if (result) {
      loadingData.value = false;
      trip.value = { ...result };
    } else {
      router.push({
        name: "NotFound",
        // preserve current path and remove the first char to avoid the target URL starting with `//`
        params: { pathMatch: route.path.substring(1).split("/") },
        // preserve existing query and hash if any
        query: route.query,
        hash: route.hash,
      });
    }
  }
  loadingData.value = false;
}

async function goToProviderDetails() {
  loadingData.value = true;
  let provider_id = trip.value.provider_id;
  if (provider_id) {
    router.push({
      name: "provider",
      query: { provider_id },
    });
  }
}

function goToCommand(trip_id) {
  router.push({
    name: "order",
    query: { trip_id },
  });
}

watch(
  () => route.query.trip_id,
  (newVal, oldVal) => {
    searchTripById(newVal);
  },
  { immediate: true }
);

onMounted(() => {});
</script>
<style scoped></style>
