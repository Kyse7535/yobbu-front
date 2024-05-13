<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col>
          <v-form>
            <v-text-field
              v-model="date_departure"
              id="date_departure"
              label="date depart"
              :rules="[utils.rules.counter, utils.rules.short_text]"
            ></v-text-field>
            <v-text-field
              v-model="date_arrival"
              label="date arrivee"
              id="date_arrival"
              :rules="[utils.rules.counter, utils.rules.short_text]"
            ></v-text-field>

            <v-text-field
              v-model="city_departure"
              label="ville depart"
              id="city_departure"
              :rules="[utils.rules.counter, utils.rules.short_text]"
            ></v-text-field>
            <v-text-field
              v-model="city_arrival"
              label="ville arrivee"
              id="city_arrival"
              :rules="[utils.rules.counter, utils.rules.short_text]"
            ></v-text-field>
            <v-text-field
              v-model="country_departure"
              label="pays depart"
              id="country_departure"
              :rules="[utils.rules.counter, utils.rules.short_text]"
            ></v-text-field>
            <v-text-field
              v-model="country_arrival"
              label="pays arrivee"
              id="country_arrival"
              :rules="[utils.rules.counter, utils.rules.short_text]"
            ></v-text-field>
            <v-btn id="submit-btn" @click="searchTrips">rechercher</v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script setup>
import { onMounted, ref, defineEmits } from "vue";
import useClientStoreComposable from "@/composables/clientStoreComposable";
import useUtils from "@/composables/utils.js";

const utils = useUtils();
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
