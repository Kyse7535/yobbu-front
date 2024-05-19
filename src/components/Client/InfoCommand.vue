<template>
  <v-row class="w-20 ml-2 px-4" v-if="trip">
    <v-col cols="12">
      <h2>Info commande</h2>
      <div v-if="props.order && props.trip" id="caracteristique">
        <h3>Caracteristiques</h3>
        <div class="d-flex justify-space-between">
          <p>Depart</p>
          <p>{{ props.trip.country_departure }}</p>
        </div>
        <div class="d-flex justify-space-between">
          <p>Destination</p>
          <p>{{ props.trip.country_arrival }}</p>
        </div>
        <div class="d-flex justify-space-between">
          <p>Poids</p>
          <p>{{ props.order.weight }} {{ props.order.poids_unite }}</p>
        </div>
        <div
          class="d-flex justify-space-between"
          v-if="props.order && props.order.format && props.order.format.title"
        >
          <p>Format</p>
          <p>{{ props.order.format.title }}</p>
        </div>
      </div>
    </v-col>
    <v-col cols="12">
      <div class="d-flex justify-space-between">
        <p>Prix net</p>
        <p class="big">{{ price }}</p>
      </div>
    </v-col>
  </v-row>
</template>
<script setup>
import { watch } from "vue";
import { ref, computed, defineProps, onMounted, defineEmits } from "vue";

const emit = defineEmits(["price"]);
const props = defineProps(["trip", "order"]);

const price = computed(() => {
  let price = 0;
  if (props.trip && props.trip.weight_activated) {
    price +=
      props.order.poids_unite === "g"
        ? (props.order.weight * props.trip.price_per_kg) / 1000
        : props.order.weight * props.trip.price_per_kg;
  }
  if (props.order && props.order.format) {
    price += props.order.format.price;
  }
  if (props.order && props.order.mode_envoi) {
    price += props.order.mode_envoi.price;
  }
  if (props.order && props.order.mode_livraison) {
    price += props.order.mode_livraison.price;
  }
  return price;
});

watch(price, (val) => emit("price", val));
</script>
<style scoped></style>
