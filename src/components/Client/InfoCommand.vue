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
        <div class="d-flex justify-space-between">
          <p>Format</p>
          <p>{{ props.order.format }}</p>
        </div>
      </div>
    </v-col>
    <v-col cols="12">
      <div class="d-flex justify-space-between">
        <p>Prix net</p>
        <p class="big">45 €</p>
      </div>
    </v-col>
  </v-row>
</template>
<script setup>
import { ref, computed, defineProps, onMounted } from "vue";

const props = defineProps(["trip", "order"]);
</script>
<style scoped></style>
