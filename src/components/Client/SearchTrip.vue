<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="date_departure"
            id="date_departure"
            label="date depart"
            hide-details
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="date_arrival"
            label="date arrivee"
            id="date_arrival"
            hide-details
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="city_departure"
            label="ville depart"
            id="city_departure"
            hide-details
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="city_arrival"
            label="ville arrivee"
            id="city_arrival"
            hide-details
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="country_departure"
            label="pays depart"
            id="country_departure"
            hide-details
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="country_arrival"
            label="pays arrivee"
            id="country_arrival"
            hide-details
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-btn id="submit-btn" @click="searchTrips">rechercher</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script setup>
import { onMounted, ref, defineEmits } from "vue";
import useClientStoreComposable from "@/composables/clientStoreComposable";
const emit = defineEmits(["result-search"]);
const date_departure = ref(""),
  date_arrival = ref(""),
  city_departure = ref(""),
  city_arrival = ref(""),
  country_departure = ref(""),
  country_arrival = ref(""),
  store = useClientStoreComposable();

async function searchTrips() {
  await store.fetchTrips({
    date_departure: date_departure.value,
    date_arrival: date_arrival.value,
    city_departure: city_departure.value,
    city_arrival: city_arrival.value,
    country_departure: country_arrival.value,
    country_arrival: country_arrival.value,
  });
  emit("result-search");
}
</script>
<style></style>
