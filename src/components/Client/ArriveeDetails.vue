<template>
  <h1>Arrivee du colis</h1>
  <v-row>
    <v-col cols="12">
      <v-radio-group v-model="mode_livraison">
        <v-radio label="En point de retrait" value="mode-1"></v-radio>
        <v-radio label="en main propre" value="mode-2"></v-radio>
      </v-radio-group>
    </v-col>
  </v-row>
  <v-row v-if="mode_livraison && mode_livraison === 'mode-2'">
    <v-col cols="12">
      <h3>Adresse du destinataire</h3>
      <div id="adresse-livraison">
        <v-btn @click="adresse_dialog = true" v-if="!adresse"
          >Saisir une adresse</v-btn
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
      <p>Contact du destinataire :</p>
      <v-text-field label="email" v-model="email"> </v-text-field>
    </v-col>
  </v-row>
</template>
<script setup>
import { ref, computed, defineProps, defineEmits, watch } from "vue";
const mode_livraison = ref(null);
const props = defineProps(["trip", "props"]);
const emit = defineEmits(["completed"]);
const adresse_dialog = ref(false);
const civilite = ref(null);
const nom = ref(null);
const prenom = ref(null);
const libelle_adresse = ref(null);
const code_postale = ref(null);
const ville = ref(null);
const info_complementaire = ref(null);
const adresse = ref(null);
const email = ref(null);
const isCompleted = computed(() =>
  mode_livraison && mode_livraison.value === "mode-2"
    ? !!civilite.value && !!nom.value && !!prenom.value && !!email.value
    : mode_livraison.value === "mode-1"
);

watch(isCompleted, (val) => emit("completed", val));
</script>
<style></style>
