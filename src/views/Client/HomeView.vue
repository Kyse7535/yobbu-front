<template>
  <v-row>
    <v-col cols="12" v-if="loadingData"><h1>Loading data</h1></v-col>
  </v-row>
  <v-row v-if="!loadingData && trips">
    <v-col cols="12">
      <h1>HomeView</h1>
      <SearchTrip @result-search="trips = store.getTrips()" />
      <TripList
        :trips="trips"
        @go-to-details="(trip_id) => goToDetails(trip_id)"
      />
    </v-col>
  </v-row>
</template>
<script setup>
import { inject, onBeforeMount, onMounted, ref } from "vue";
import SearchTrip from "@/components/Client/SearchTrip.vue";
import TripList from "@/components/Client/TripList.vue";
import useClientStoreComposable from "@/composables/clientStoreComposable";

const router = inject("router");
const trips = ref(null);
const loadingData = ref(false);
const store = useClientStoreComposable();
function goToDetails(trip_id) {
  loadingData.value = true;
  router.push({
    name: "trip",
    query: { trip_id },
  });
}
onBeforeMount(async () => {
  await store.fetchTrips({
    date_departure: "",
    date_arrival: "",
    city_departure: "",
    city_arrival: "",
    country_departure: "",
    country_arrival: "",
  });
  trips.value = store.getTrips();
  if (localStorage.getItem("panier")) {
    store.setPanier(JSON.parse(localStorage.getItem("panier")));
  }
});
</script>
<style></style>
