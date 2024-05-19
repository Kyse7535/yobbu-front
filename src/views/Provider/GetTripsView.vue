<template>
  <h1>GetTrips Page</h1>
  <v-row v-if="!trips">
    <h2>Loading data ....</h2>
  </v-row>
  <v-row v-if="trips && trips.length === 0">
    <h2>No trip found</h2>
  </v-row>
  <v-row v-if="trips && trips.length > 0">
    <v-col cols="12">
      <ul>
        <li
          v-for="trip in trips"
          class="d-flex align-center justify-space-between w-50 cursor-pointer"
        >
          <p @click="getTripDetails(trip.id)">
            {{ trip.country_departure }} ---- > {{ trip.country_arrival }}
          </p>
          <v-btn icon @click="delete_trip_dialog = true"
            ><v-icon icon="mdi-trash-can-outline"></v-icon
          ></v-btn>
          <v-btn @click="modifyTrip(trip.id)">modifier</v-btn>
          <v-dialog v-model="delete_trip_dialog" width="auto">
            <v-card>
              <template #text>
                <p>Voulez-vous supprimer ?</p>
              </template>
              <template #actions>
                <div class="text-center">
                  <v-btn @click="delete_trip_dialog = false">cancel</v-btn>
                  <v-btn @click="deleteTrip(trip.id)" class="bg-red"
                    >delete</v-btn
                  >
                </div>
              </template>
            </v-card>
          </v-dialog>
        </li>
      </ul>
    </v-col>
  </v-row>
</template>
<script setup>
import { onBeforeMount, ref, inject, watch } from "vue";
import useProviderStoreComposable from "@/composables/providerStoreComposable";
import useHandlerMessage from "@/composables/HandlerMessage";

const handlerMessage = useHandlerMessage();
const providerStoreComposable = useProviderStoreComposable();
const trips = ref(null);
const router = inject("router");
const delete_trip_dialog = ref(false);
function getTripDetails(trip_id) {
  if (trip_id) {
    router.push({ name: "providerGetTripDetails", query: { trip_id } });
  }
}

async function deleteTrip(trip_id) {
  let result = await providerStoreComposable.deleteTrip(trip_id);
  if (result > -1) {
    let _formats = providerStoreComposable.getFormats().map((f) => {
      let index = f.trips.findIndex((t_id) => t_id === trip_id);
      if (index > -1) {
        f.trips.splice(index, 1);
      }
      return f;
    });
    for (let f of _formats) {
      await providerStoreComposable.updateFormat(f);
    }
  }
  delete_trip_dialog.value = false;
  handlerMessage.displayMessage("votre trip a bien ete supprime");
}

function modifyTrip(trip_id) {
  router.push({ name: "providerAddTrips", query: { trip_id } });
}

watch(
  () => providerStoreComposable.getTrips(),
  (newVal, oldVal) => {
    if (newVal.length !== oldVal.length) {
      trips.value = newVal;
    }
  },
  { deep: true }
);

onBeforeMount(async () => {
  await providerStoreComposable.fetchTrips();
  trips.value = providerStoreComposable.getTrips() || [];
});
</script>
<style scoped></style>
