<template>
  <v-row v-if="panier.length === 0"
    ><v-col cols="12"
      ><h1 class="text-center">Votre panier est vide</h1></v-col
    ></v-row
  >
  <v-row v-if="panier.length > 0 && !panier[0].trip">
    <h2>Loading data ...</h2></v-row
  >
  <v-row v-if="panier.length > 0 && panier[0].trip">
    <v-col cols="12">
      <h2>Mon panier: | {{ panier.length }} article</h2>
      <v-list>
        <v-list-item v-for="(order, order_index) in panier">
          <div class="d-flex">
            <div>
              <h5>Order N° {{ order_index + 1 }}</h5>
              <p>Depart: {{ order.trip.city_departure }}</p>
              <p>Arrivee: {{ order.trip.city_arrival }}</p>
              <p>Poids: {{ order.weight }} {{ order.poids_unite }}</p>
              <p>Format: {{ order.format.title }}</p>
              <p>Mode envoi: {{ order.mode_envoi.title }}</p>
              <p>Mode livraison: {{ order.mode_livraison.title }}</p>
            </div>
          </div>
          <div>
            <h5>Prix: {{ order.price }}</h5>
            <v-btn
              icon
              @click="delete_dialog = true"
              :id="`btn-delete-order-${order_index}`"
            >
              <v-icon icon="mdi-trash-can-outline"></v-icon>
            </v-btn>
            <v-btn
              @click="modifyOrder(order.id)"
              :id="`btn-modifier-order-${order_index}`"
              >modifier</v-btn
            >
            <v-dialog v-model="delete_dialog" width="auto">
              <v-card max-width="400">
                <template #text> Are you sure ? </template>
                <v-card-actions>
                  <v-btn @click="delete_dialog = false"> close </v-btn>
                  <v-btn
                    @click="deleteOrder(order.id)"
                    id="btn-confirm-delete-order"
                    class="bg-red"
                    >delete</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</template>
<script setup>
import { inject, onBeforeMount, onMounted, ref, watch } from "vue";
import useClientStoreComposable from "@/composables/clientStoreComposable";
import useUtils from "@/composables/utils";

const store = useClientStoreComposable();
const panier = ref([]);
const utils = useUtils();
const handlerMessage = inject("handlerMessage");
const delete_dialog = ref(false);
const router = inject("router");
function deleteOrder(order_id) {
  if (panier.value.length > 0) {
    const index = panier.value.findIndex((o) => o.id === order_id);
    if (index >= 0) {
      panier.value.splice(index, 1);
    }
    store.removeCommandToPanier(order_id);
    handlerMessage.displayMessage("order remove successfully");
    delete_dialog.value = false;
  }
}

function modifyOrder(order_id) {
  router.push({
    name: "order",
    query: { order_id },
  });
}

watch(
  panier,
  (newVal, oldVal) => {
    if (!utils.compareObjects(newVal, oldVal)) {
      panier.value = panier.value.map((order) => {
        order.trip = store.getTrips().find((t) => t.id === order.trip_id);
        return order;
      });
    }
  },
  { deep: true }
);
onBeforeMount(() => {
  panier.value = [...store.getPanier()];
});
</script>
<style scoped></style>
