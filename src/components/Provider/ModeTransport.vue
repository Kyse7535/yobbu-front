<template>
  <div v-if="trip">
    <h3>Mode expedition</h3>
    <ul>
      <li class="d-flex justify-space-between align-center">
        <span v-for="h in headers"> {{ h }}</span>
      </li>
      <li
        v-for="mode in mode_envoi"
        :key="mode.id"
        class="d-flex justify-space-between align-center"
      >
        <v-checkbox
          :model-value="
            trip.mode_transport.filter((m) => m.id === mode.id).length > 0
          "
          @click="handleSelectModeExpedition(mode)"
        ></v-checkbox>
        <h4>{{ mode.title }}</h4>
        <p>{{ mode.description }}</p>
        <p>{{ mode.price }}</p>
        <v-btn @click="modifyModeTransport(mode)">modifier</v-btn>
      </li>
    </ul>
    <h3>Mode livraison</h3>
    <ul>
      <li
        v-for="mode in mode_livraison"
        :key="mode.id"
        class="d-flex justify-space-between align-center"
      >
        <v-checkbox
          :model-value="
            trip.mode_transport.filter((m) => m.id === mode.id).length > 0
          "
          @click="handleSelectModeExpedition(mode)"
        ></v-checkbox>
        <h4>{{ mode.title }}</h4>
        <p>{{ mode.description }}</p>
        <p>{{ mode.price }}</p>
        <v-btn @click="modifyModeTransport(mode)">modifier</v-btn>
      </li>
    </ul>
    <v-dialog v-model="modify_dialog">
      <v-card>
        <template #text>
          <v-text-field
            v-model="mode_to_modify.title"
            label="title"
          ></v-text-field>
          <v-textarea
            v-model="mode_to_modify.description"
            label="description"
          ></v-textarea>
          <v-text-field
            v-model.number="mode_to_modify.price"
            label="price"
          ></v-text-field>
        </template>
        <template #actions>
          <div>
            <v-btn @click="modify_dialog = false">cancel</v-btn>
            <v-btn @click="validateModification">validate</v-btn>
          </div>
        </template>
      </v-card></v-dialog
    >
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from "vue";
import useUtils from "@/composables/utils";
import { ref } from "vue";
import { onBeforeMount } from "vue";
import useProviderStoreComposable from "@/composables/providerStoreComposable";
import { provide } from "vue";
const providerStore = useProviderStoreComposable();
const utils = useUtils();
const props = defineProps(["modes", "trip"]);
const emits = defineEmits(["mode-transport"]);

const mode_to_modify = ref(null);
const modify_dialog = ref(false);
const mode_envoi = ref([
  {
    id: "a12f1f76-490c-4d7a-ae3d-8627fc9a2db8",
    title: "Depuis un de nos point contact",
    description: "Lorem ipsum",
    step: "DEPART",
    price: 15.0,
    trip_id: null,
  },
  {
    id: "df7f3b02-0328-4bdc-9a1d-fc58eb5ee7fc",
    title: "Depuis une adresse",
    description: "Lorem ipsum",
    step: "DEPART",
    price: 25.0,
    trip_id: null,
  },
]);

const mode_livraison = ref([
  {
    id: "f21b1b15-8674-4892-9b7d-1b5fd1203f3b",
    title: "Depuis une adresse",
    description: "Lorem ipsum",
    step: "ARRIVEE",
    price: 15.0,
    trip_id: null,
    provider_id: null,
  },
  {
    id: "c789b14a-01da-465f-8966-b54a3d3a6b8e",
    title: "Depuis un de nos point contact",
    description: "Lorem ipsum",
    step: "ARRIVEE",
    price: 15.0,
    trip_id: null,
    provider_id: null,
  },
]);

const trip = ref({});

const headers = ref(["selected", "title", "description", "price", "actions"]);

function handleSelectModeExpedition(mode) {
  const index = trip.value.mode_transport.findIndex((m) => m.id == mode.id);
  if (index > -1) {
    trip.value.mode_transport.splice(index, 1);
    mode.provider_id = null;
  } else {
    trip.value.mode_transport.push(mode);
    mode.provider_id = providerStore.getProviderInfo().id;
  }
  emits("mode-transport", utils.copyObject(trip.value.mode_transport));
}

function modifyModeTransport(mode) {
  modify_dialog.value = true;
  mode_to_modify.value = utils.copyObject(mode);
}

function validateModification() {
  let index = -1;
  if (mode_to_modify.value.step === "DEPART") {
    index = mode_envoi.value.findIndex((m) => m.id === mode_to_modify.value.id);
    mode_envoi.value[index] = utils.copyObject(mode_to_modify.value);
  } else {
    index = mode_livraison.value.findIndex(
      (m) => m.id === mode_to_modify.value.id
    );
    mode_livraison.value[index] = utils.copyObject(mode_to_modify.value);
  }
  index = trip.value.mode_transport.findIndex(
    (m) => m.id === mode_to_modify.value.id
  );
  if (index > -1) {
    let mode_transport = utils.copyObject(trip.value.mode_transport);
    mode_transport[index] = utils.copyObject(mode_to_modify.value);
    emits("mode-transport", mode_transport);
  }
  modify_dialog.value = false;
}

onBeforeMount(async () => {
  if (props.trip) {
    trip.value = props.trip;
  }
  if (providerStore.getProviderInfo().id) {
    try {
      await providerStore.fetchModeTransports();
      if (providerStore.getModeTransports().length > 0) {
        mode_envoi.value = utils.copyObject(
          providerStore.getModeTransports().filter((m) => m.step === "DEPART")
        );
        mode_livraison.value = utils.copyObject(
          providerStore.getModeTransports().filter((m) => m.step === "ARRIVEE")
        );
      }
    } catch (error) {
      handlerMessage.displayError(
        (error &&
          error.response &&
          error.response.data &&
          !!error.response.data.message) ||
          "error when fetching mode transport"
      );
    }
  }
});
</script>
<style scoped></style>
