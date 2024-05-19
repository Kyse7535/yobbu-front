<template>
  <v-row v-if="trip">
    <v-col cols="12">
      <h1>Adding trip page</h1>
      <v-form @submit.prevent="submit" validate-on="submit lazy">
        <v-text-field
          label="city departure"
          v-model="trip.city_departure"
        ></v-text-field>
        <v-text-field
          label="city arrival"
          v-model="trip.city_arrival"
        ></v-text-field>
        <v-text-field
          label="country departure"
          v-model="trip.country_departure"
        ></v-text-field>
        <v-text-field
          label="country arrival"
          v-model="trip.country_arrival"
        ></v-text-field>
        <v-text-field
          label="available volume"
          v-model="trip.available_volume"
        ></v-text-field>
        <v-textarea label="description" v-model="trip.decription"></v-textarea>
        <v-text-field
          type="date"
          label="date departure"
          v-model="trip.date_departure"
        ></v-text-field>
        <v-text-field
          type="date"
          label="date arrival"
          v-model="trip.date_arrival"
        ></v-text-field>
        <v-text-field
          label="addresse departure"
          v-model="trip.address_departure"
        ></v-text-field>
        <v-text-field
          label="adresse arrival"
          v-model="trip.address_arrival"
        ></v-text-field>
        <v-switch
          label="enable weight"
          color="primary"
          v-model="trip.weight_activated"
        ></v-switch>
        <v-text-field
          label="price per kg"
          v-model="trip.price_per_kg"
          :disabled="!trip.weight_activated"
        ></v-text-field>
        <ModeTransport
          :trip="utils.copyObject(trip)"
          @mode-transport="(modes) => (trip.mode_transport = modes)"
        />
        <FormatTrip
          :trip_id="trip.id"
          :validate_format="validate_format"
          @format-persisted="validate_format = false"
        />
        <v-btn type="submit" color="primary">create trip</v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>
<script setup>
import { ref, watch, defineProps, onBeforeMount, inject } from "vue";
import useUtils from "@/composables/utils";
import FormatTrip from "@/components/Provider/FormatTrip.vue";
import useProviderStoreComposable from "@/composables/providerStoreComposable";
import useHandlerMessage from "@/composables/HandlerMessage";
import ModeTransport from "@/components/Provider/ModeTransport.vue";

const handlerMessage = useHandlerMessage();
const validate_format = ref(false);
const providerStore = useProviderStoreComposable();
const utils = useUtils();
const valid = ref(false);
const route = inject("route");
const trip = ref({
  id: "",
  city_departure: "",
  city_arrival: "",
  country_departure: "",
  country_arrival: "",
  available_volume: 0,
  description: "",
  date_departure: "",
  date_arrival: "",
  activated_instance: true,
  status: "OPEN",
  address_departure: "",
  address_arrival: "",
  price_per_kg: 0,
  weight_activated: false,
  provider_id: "",
  mode_transport: [],
});

const weight_activated = ref(false);

async function submit() {
  try {
    let index = providerStore
      .getTrips()
      .findIndex((t) => t.id === trip.value.id);
    if (index > -1) {
      await providerStore.updateTrip(utils.copyObject(trip.value));
      handlerMessage.displayMessage("Trip modified successfully.");
    } else {
      await providerStore.addTrip(utils.copyObject(trip.value));
      handlerMessage.displayMessage("Trip added successfully.");
    }
    validate_format.value = true;
  } catch (error) {
    handlerMessage.displayError(
      (error &&
        error.response &&
        error.response.data &&
        !!error.response.data.message) ||
        "impossible to find the resource"
    );
  }
}

onBeforeMount(async () => {
  if (route.query.trip_id) {
    trip.value = providerStore
      .getTrips()
      .find((t) => t.id === route.query.trip_id);
  } else {
    trip.value.id = utils.generateUUID();
    trip.value.provider_id = providerStore.getProviderInfo().id;
  }
  await providerStore.fetchAllFormats();
});
</script>
<style scoped></style>
