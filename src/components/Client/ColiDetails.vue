<template>
  <v-row class="d-flex flex-column pa-5 whole flex-nowrap">
    <v-row id="destination">
      <v-col cols="12">
        <h2>Destination du colis</h2>
      </v-col>
      <v-col cols="12"
        ><v-text-field
          label="country departure"
          :model-value="props.trip.country_departure"
          :disabled="true"
        ></v-text-field
      ></v-col>
      <v-col cols="12"
        ><v-text-field
          label="country arrival"
          :model-value="props.trip.country_arrival"
          :disabled="true"
        ></v-text-field
      ></v-col>
      <v-col cols="12"
        ><v-text-field
          label="city departure"
          :model-value="props.trip.city_departure"
          :disabled="true"
        ></v-text-field
      ></v-col>
      <v-col cols="12"
        ><v-text-field
          label="city arrival"
          :model-value="props.trip.city_arrival"
          :disabled="true"
        ></v-text-field
      ></v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        id="poids"
        v-if="props.trip && props.trip.weight_activated"
      >
        <h2>Poids</h2>
        <div class="d-flex align-center">
          <v-text-field
            label="weight"
            id="weight"
            v-model="weight"
          ></v-text-field>
          <v-radio-group v-model="poids_unite" inline>
            <v-radio label="grammes" id="poids-unite-1" value="g"></v-radio>
            <v-radio
              label="kilogrammes"
              id="poids-unite-2"
              value="kg"
            ></v-radio>
          </v-radio-group>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" id="formats">
        <v-radio-group v-model="format_selected">
          <template #label>
            <h3>Formats</h3>
          </template>
          <v-radio
            v-for="format in formats_trip"
            :key="format.id"
            :value="format"
            :id="format.id"
            class="d-flex align-center"
          >
            <template #label>
              <div>
                <h4>{{ format.title }}</h4>
                <p>{{ format.description }}</p>
                <p>{{ format.price }}</p>
              </div>
            </template>
          </v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
  </v-row>
</template>
<script setup>
import {
  computed,
  defineProps,
  onBeforeMount,
  onMounted,
  ref,
  watch,
} from "vue";

import useClientStoreComposable from "@/composables/clientStoreComposable";

const clientStoreComposable = useClientStoreComposable();
const props = defineProps(["trip", "order"]);
const emit = defineEmits(["completed"]);
const weight = ref(null);
const format_selected = ref(null);
const poids_unite = ref(null);
const formats_trip = ref(null);
const isCompleted = computed(() => {
  if (props.trip && props.trip.weight_activated) {
    return !!weight.value && !!format_selected.value && !!poids_unite.value;
  } else {
    return !!format_selected.value;
  }
});

watch(isCompleted, (val) => {
  emit("completed", {
    completed: val,
    _format: format_selected.value,
    _poids_unite: poids_unite.value,
    _weight: weight.value,
  });
});

watch(format_selected, (val) => {
  emit("completed", {
    completed: isCompleted.value,
    _format: val,
    _poids_unite: poids_unite.value,
    _weight: weight.value,
  });
});
watch(weight, (val) => {
  emit("completed", {
    completed: isCompleted.value,
    _format: format_selected.value,
    _poids_unite: poids_unite.value,
    _weight: val,
  });
});
watch(poids_unite, (val) => {
  emit("completed", {
    completed: isCompleted.value,
    _format: format_selected.value,
    _poids_unite: poids_unite.value,
    _weight: weight.value,
  });
});

onBeforeMount(async () => {
  if (props.order) {
    weight.value = props.order.weight || "";
    format_selected.value = props.order.format || "";
    poids_unite.value = props.order.poids_unite || "";
  }
  if (props.trip) {
    await clientStoreComposable.fetchTripFormats(props.trip.id);
    formats_trip.value = clientStoreComposable.getFormatTrips();
  }
});
</script>
<style scoped>
.whole {
  height: 70vh;
  overflow-y: scroll;
}
</style>
