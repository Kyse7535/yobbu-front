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
      <v-col cols="12" id="poids">
        <h2>Poids</h2>
        <div class="d-flex align-center">
          <v-text-field
            label="weight"
            id="weight"
            v-model="weight"
          ></v-text-field>
          <v-radio-group v-model="poids_unite" inline>
            <v-radio label="grammes" id="poids-unite-1" value="g"></v-radio>
            <v-radio label="kilogrammes" value="kg"></v-radio>
          </v-radio-group>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" id="formats">
        <h2>Formats</h2>
        <v-radio-group v-model="format">
          <v-radio label="Format 1" id="format-1" value="one"></v-radio>
          <v-radio label="Format 2" value="two"></v-radio>
          <v-radio label="Format 3" value="three"></v-radio>
          <v-radio label="Format 4" value="four"></v-radio>
          <v-radio label="Format 5" value="five"></v-radio>
          <v-radio label="Format 6" value="six"></v-radio>
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

const props = defineProps(["trip", "order"]);
const emit = defineEmits(["completed"]);
const weight = ref(null);
const format = ref(null);
const poids_unite = ref(null);
const isCompleted = computed(
  () => !!weight.value && !!format.value && !!poids_unite.value
);

watch(isCompleted, (val) => {
  emit("completed", {
    completed: val,
    _format: format.value,
    _poids_unite: poids_unite.value,
    _weight: weight.value,
  });
});

watch(format, (val) => {
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
    _format: format.value,
    _poids_unite: poids_unite.value,
    _weight: val,
  });
});
watch(poids_unite, (val) => {
  emit("completed", {
    completed: isCompleted.value,
    _format: format.value,
    _poids_unite: poids_unite.value,
    _weight: weight.value,
  });
});

onBeforeMount(() => {
  if (props.order) {
    weight.value = props.order.weight || "";
    format.value = props.order.format || "";
    poids_unite.value = props.order.poids_unite || "";
  }
});
</script>
<style scoped>
.whole {
  height: 70vh;
  overflow-y: scroll;
}
</style>
