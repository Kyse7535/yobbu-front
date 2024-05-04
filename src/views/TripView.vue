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
    <v-col cols="12"><v-btn>Commander</v-btn></v-col>

    <v-col cols="12" id="provider_avatar" class="cursor-pointer"
      ><v-avatar
        color="surface-variant"
        text="lorem"
        @click="goToProviderDetails"
      ></v-avatar
    ></v-col>
  </v-row>
</template>
<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "../store/index";
import useHandlerMessage from "../composables/HandlerMessage";

const loadingData = ref(false);
const route = useRoute();
const router = useRouter();
const store = useStore();
const handlerMessage = useHandlerMessage();

const trip = ref(null);

async function searchTripById(id) {
  loadingData.value = true;
  let result = store.getTrips.find((trip) => trip.id === id) || {};
  if (result) {
    trip.value = { ...result };
  } else {
    await store.fetchTripById(id);
    result = store.getTrips.find((trip) => trip.id === id);
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
  let link_to_provider = trip.value.links.find((l) => l.rel === "provider");
  await store.fetchProviderDetails(link_to_provider.href);
  let provider_id = store.getProviderDetails && store.getProviderDetails.id;
  if (provider_id) {
    router.push({
      path: "/provider",
      query: { provider_id },
    });
  }
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
