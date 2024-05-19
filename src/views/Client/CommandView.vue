<template>
  <v-row>
    <v-row class="w-75" v-if="trip">
      <v-col cols="12">
        <v-stepper v-model="step" class="pa-0">
          <v-stepper-header>
            <v-stepper-item
              title="caracteristique"
              value="0"
              complete
              editable
            ></v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item
              title="depart"
              value="1"
              complete
              editable
            ></v-stepper-item>

            <v-divider></v-divider>

            <v-stepper-item title="arrivee" value="2" editable></v-stepper-item>
          </v-stepper-header>
          <v-stepper-window>
            <v-stepper-window-item value="0">
              <ColiDetails
                :trip="trip"
                :order="order"
                @completed="(data) => handleColiDetailsCompleted(data)"
              />
            </v-stepper-window-item>
            <v-stepper-window-item value="1">
              <DepartDetails
                :trip="trip"
                :order="order"
                :isDepart="true"
                @completed="(data) => handleDepartDetailsCompleted(data)"
              >
              </DepartDetails>
            </v-stepper-window-item>
            <v-stepper-window-item value="2">
              <DepartDetails
                :trip="trip"
                :order="order"
                :isDepart="false"
                @completed="(data) => handleArriveeDetailsCompleted(data)"
              />
            </v-stepper-window-item>
          </v-stepper-window>
          <v-stepper-actions>
            <template #prev>
              <v-btn @click="step = step > 0 ? step - 1 : step"></v-btn>
            </template>

            <template #next>
              <v-btn
                :disabled="disableNextBtn"
                color="primary"
                id="next-btn"
                @click="handleNext"
                >{{ next_text }}</v-btn
              >
            </template>
          </v-stepper-actions>
        </v-stepper>
      </v-col>
    </v-row>
    <InfoCommand
      :order="order"
      :trip="trip"
      @price="(p) => (order.price = p)"
    />
  </v-row>
</template>
<script setup>
import ColiDetails from "@/components/Client/ColiDetails.vue";
import DepartDetails from "@/components/Client/DepartDetails.vue";
import ArriveeDetails from "@/components/Client/ArriveeDetails.vue";
import useClientStoreComposable from "@/composables/clientStoreComposable";
import { ref, onMounted, computed, inject, watch } from "vue";
import InfoCommand from "@/components/Client/InfoCommand.vue";
import useUtils from "@/composables/utils";
import { onBeforeMount } from "vue";
const step = ref(0);
const trip = ref(null);
const store = useClientStoreComposable();
const route = inject("route");
const router = inject("router");
const utils = useUtils();
const handlerMessage = inject("handlerMessage");
const steps_completed = ref(Array.of(false, false, false));
const transaction = ref(false);
const create_order = ref(true);
const next_text = computed(() =>
  step.value < 2 ? "next" : "ajouter au panier"
);
const disableNextBtn = computed(() =>
  step.value < 2
    ? !steps_completed.value[step.value]
    : transaction.value
    ? !steps_completed.value[step.value]
    : true
);

//order details
const order = ref({
  id: utils.generateUUID(),
});
function handleColiDetailsCompleted({
  completed,
  _weight,
  _poids_unite,
  _format,
}) {
  order.value.format = _format;
  order.value.weight = _weight;
  order.value.poids_unite = _poids_unite;
  steps_completed.value[step.value] = completed;
}

function handleArriveeDetailsCompleted({
  completed,
  mode_livraison,
  adresse_arrivee,
  email_arrivee,
}) {
  order.value.mode_livraison = mode_livraison;
  order.value.adresse_arrivee = adresse_arrivee;
  order.value.email_arrivee = email_arrivee;
  steps_completed.value[step.value] = completed;
}

function handleDepartDetailsCompleted({
  completed,
  mode_envoi,
  mode_livraison,
  adresse_depart,
  email_depart,
}) {
  order.value.mode_envoi = mode_envoi;
  order.value.adresse_depart = adresse_depart;
  order.value.email_depart = email_depart;
  steps_completed.value[step.value] = completed;
}

function handleNext() {
  if (step.value < 2 && steps_completed.value[step.value]) {
    step.value++;
  }
  if (step.value === 2 && steps_completed.value[step.value]) {
    order.value.trip_id = trip.value.id;
    let messageToDisplay = "";
    if (transaction.value) {
      store.addCommandToPanier(order.value);
      localStorage.setItem("panier", JSON.stringify(store.getPanier()));
      transaction.value = false;
    }
    if (create_order.value) {
      messageToDisplay = "Votre commande a ete ajoute au panier";
    } else {
      messageToDisplay = "Votre commande a bien ete modifiee";
    }
    handlerMessage.displayMessage(messageToDisplay);
  }
}

onBeforeMount(async () => {
  if (route.query.trip_id) {
    const trip_id = route.query.trip_id;
    trip.value = store.getTrips().find((t) => t.id === trip_id);
  }
  if (route.query.order_id) {
    const order_id = route.query.order_id;
    create_order.value = false;
    order.value = store.getPanier().find((o) => o.id === order_id);
    if (order.value) {
      trip.value = order.value.trip;
    } else {
      router.push({ name: "NotFound" });
    }
  }
  transaction.value = true;
});
</script>
<style scoped>
.w-20 {
  width: 15%;
}
</style>
