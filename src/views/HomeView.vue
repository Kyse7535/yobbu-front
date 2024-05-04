<template>
  <v-row>
    <v-col cols="12" v-if="loadingData"><h1>Loading data</h1></v-col>
  </v-row>
  <v-row v-if="!loadingData && trips">
    <v-col cols="12">
      <h1>HomeView</h1>
      <SearchTrip @result-search="trips = store.getTrips" />
      <TripList
        :trips="trips"
        @go-to-details="(trip_id) => goToDetails(trip_id)"
      />
    </v-col>
  </v-row>
</template>
<script setup>
import { onBeforeMount, onMounted, ref } from "vue";
import SearchTrip from "../components/SearchTrip.vue";
import TripList from "../components/TripList.vue";
import { useStore } from "../store";
import { useRouter } from "vue-router";

const router = useRouter();
const trips = ref(null);
const loadingData = ref(false);
const store = useStore();
function goToDetails(trip_id) {
  loadingData.value = true;
  router.push({
    path: "/trip",
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
  trips.value = store.getTrips;
});
</script>
<style></style>
