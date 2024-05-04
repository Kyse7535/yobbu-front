<template>
  <h2>TripList</h2>
  <h2 v-if="trips.length === 0">No trips found</h2>
  <v-list lines="three" v-else>
    <v-list-item
      class="trip_item"
      @click="goToDetails(trip.id)"
      v-for="trip in trips"
      :key="trip.id"
      :id="trip.id"
      elevation="3"
    >
      <template v-slot:title>
        <h3>{{ trip.city_departure }} ----- > {{ trip.city_arrival }}</h3>
        <h4>
          {{ trip.date_departure }} ------ > {{ trip.date_arrival }}
        </h4></template
      >
      <template v-slot:subtitle> {{ trip.description }}</template>
    </v-list-item>
  </v-list>
</template>
<script setup>
import { onMounted, ref, watch, defineProps, defineEmits } from "vue";

const props = defineProps(["trips"]);
const emit = defineEmits(["go-to-details"]);
const trips = ref([]);

function goToDetails(trip_id) {
  emit("go-to-details", trip_id);
}

watch(
  () => props.trips,
  (val) => {
    trips.value = val;
  }
);

onMounted(async () => {
  if (props.trips) {
    trips.value = props.trips;
  } else {
    trips.value = [];
  }
});
</script>
<style scoped>
.trip_item {
  cursor: pointer;
}
</style>
