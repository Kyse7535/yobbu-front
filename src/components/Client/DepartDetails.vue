<template>
  <h1>Depart du colis</h1>
  <v-row>
    <v-col cols="12">
      <h2>Mode envoi du colis</h2>
      <v-radio-group v-model="mode_envoi">
        <v-radio
          label="Depuis un de nos points de vente"
          value="mode-1"
        ></v-radio>
        <v-radio label="Depuis votre adresse" value="mode-2"></v-radio>
      </v-radio-group>
    </v-col>
  </v-row>
  <v-row v-if="mode_envoi && mode_envoi === 'mode-2'">
    <v-col cols="12">
      <h2>Adresse d'expedition</h2>
      <div id="adresse-expedition">
        <v-btn @click="adresse_dialog = true" v-if="!adresse"
          >Nouvelle adresse</v-btn
        >
        <v-card v-if="adresse">
          <template #text>
            <div class="d-flex justify-space-between">
              <div>
                <h3>
                  {{ adresse.civilite }} {{ adresse.prenom }} {{ adresse.nom }}
                </h3>
                <p>{{ adresse.libelle_adresse }}</p>
                <p>{{ adresse.code_postale }} {{ adresse.ville }}</p>
                <p>{{ props.trip && props.trip.country_departure }}</p>
              </div>
              <div>
                <v-btn @click="modifyAdress">modifier</v-btn>
              </div>
            </div>
          </template>
        </v-card>
        <v-dialog v-model="adresse_dialog" width="auto">
          <v-card max-width="700" min-width="350">
            <template #text>
              <h3>Nouvelle adresse</h3>
              <v-radio-group
                v-model="civilite"
                label="Civilite"
                inline
                :rules="[() => !!civilite || 'This field is required']"
              >
                <v-radio label="Monsieur" value="mr"></v-radio>
                <v-radio label="Madame" value="mme"></v-radio>
              </v-radio-group>
              <v-text-field
                v-model="nom"
                label="Nom"
                :rules="[() => !!nom || 'This field is required']"
              ></v-text-field>
              <v-text-field
                v-model="prenom"
                :rules="[() => !!nom || 'This field is required']"
                label="Prenom"
              ></v-text-field>
              <v-text-field
                :value="props.trip && props.trip.country_departure"
                :disabled="true"
              ></v-text-field>
              <v-text-field
                v-model="libelle_adresse"
                label="N et libelle de la voie"
              ></v-text-field>
              <v-text-field
                label="Code postal"
                v-model="code_postale"
              ></v-text-field>
              <v-text-field v-model="ville" label="Ville"></v-text-field>
              <v-text-field
                v-model="info_complementaire"
                label="Information Complementaire"
              ></v-text-field>
            </template>
            <template v-slot:actions>
              <v-col cols="12" class="text-right">
                <v-btn
                  class="ms-auto mr-4"
                  text="close"
                  @click="adresse_dialog = false"
                ></v-btn>
                <v-btn
                  class="ms-auto bg-primary"
                  text="add"
                  :disabled="!isCompleted"
                  @click="addAddress"
                ></v-btn>
              </v-col>
            </template>
          </v-card>
        </v-dialog>
      </div>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <h3>Suivi de votre colis</h3>
      <p>
        Afin de vous proposer un suivi de qualité sur votre colis, nous avons
        besoin de votre contact pour vous joindre. Merci de nous l’indiquer :
      </p>
      <v-text-field label="email" v-model="email"> </v-text-field>
    </v-col>
  </v-row>
</template>
<script setup>
import { computed, ref, defineProps, watch, onBeforeMount } from "vue";
const props = defineProps(["trip", "order"]);
const emit = defineEmits(["completed"]);
const adresse_dialog = ref(false);
const civilite = ref(null);
const nom = ref(null);
const prenom = ref(null);
const libelle_adresse = ref(null);
const code_postale = ref(null);
const ville = ref(null);
const info_complementaire = ref(null);

const email = ref(null);
const isCompleted = computed(() =>
  mode_envoi && mode_envoi.value === "mode-2"
    ? !!civilite.value && !!nom.value && !!prenom.value && !!email.value
    : mode_envoi.value === "mode-1" && !!email.value
);
const mode_envoi = ref(null);
const adresse = ref({});

function addAddress() {
  adresse.value.nom = nom.value;
  adresse.value.prenom = prenom.value;
  adresse.value.libelle_adresse = libelle_adresse.value;
  adresse.value.code_postale = code_postale.value;
  adresse.value.info_complementaire = code_postale.value;
  adresse.value.civilite = civilite.value;
  adresse_dialog.value = false;
}

function modifyAdress() {
  civilite.value = adresse.value.civilite;
  nom.value = adresse.value.nom;
  prenom.value = adresse.value.prenom;
  libelle_adresse.value = adresse.value.libelle_adresse;
  code_postale.value = adresse.value.code_postale;
  ville.value = adresse.value.ville;
  info_complementaire.value = adresse.value.info_complementaire;
  adresse_dialog.value = true;
}

watch(isCompleted, (val) =>
  emit("completed", {
    completed: val,
    mode_envoi: mode_envoi.value,
    adresse_depart: adresse.value,
    email_depart: email.value,
  })
);

watch(mode_envoi, (val) => {
  emit("completed", {
    completed: isCompleted.value,
    mode_envoi: val,
    adresse_depart: adresse.value,
    email_depart: email.value,
  });
});
watch(email, (val) => {
  emit("completed", {
    completed: isCompleted.value,
    mode_envoi: mode_envoi.value,
    adresse_depart: adresse.value,
    email_depart: val,
  });
});
watch(
  adresse,
  () => {
    emit("completed", {
      completed: isCompleted.value,
      mode_envoi: mode_envoi.value,
      adresse_depart: adresse.value,
      email_depart: email.value,
    });
  },
  { deep: true }
);

onBeforeMount(() => {
  if (props.order) {
    mode_envoi.value = props.order.mode_envoi || "";
    adresse.value = props.order.adresse_depart || {};
    email.value = props.order.email_depart || "";
  }
});
</script>
<style></style>
