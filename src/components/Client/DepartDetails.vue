<template>
  <h1>{{ props.isDepart ? "Depart du colis" : "Arrivee du colis" }}</h1>
  <v-row>
    <v-col cols="12" v-if="props.trip && props.trip.mode_transport">
      <h2>
        {{ props.isDepart ? "Mode envoi du colis" : "Mode livraison du colis" }}
      </h2>
      <div v-if="props.isDepart">
        <v-radio-group v-model="mode_transport">
          <v-radio
            v-for="mode in props.trip.mode_transport.filter(
              (m) => m.step === 'DEPART'
            )"
            :key="mode.id"
            :value="mode"
            :id="mode.id"
          >
            <template #label>
              <div>
                <h4>{{ mode.title }}</h4>
                <p>{{ mode.description }}</p>
                <p>{{ mode.price }}</p>
              </div>
            </template>
          </v-radio>
        </v-radio-group>
      </div>
      <div v-else>
        <v-radio-group v-model="mode_transport">
          <v-radio
            v-for="mode in props.trip.mode_transport.filter(
              (m) => m.step === 'ARRIVEE'
            )"
            :key="mode.id"
            :value="mode"
            :id="mode.id"
          >
            <template #label>
              <div>
                <h4>{{ mode.title }}</h4>
                <p>{{ mode.description }}</p>
                <p>{{ mode.price }}</p>
              </div>
            </template>
          </v-radio>
        </v-radio-group>
      </div>
    </v-col>
  </v-row>
  <v-row
    v-if="
      mode_transport &&
      (mode_transport.id === 'df7f3b02-0328-4bdc-9a1d-fc58eb5ee7fc' ||
        mode_transport.id === 'f21b1b15-8674-4892-9b7d-1b5fd1203f3b')
    "
  >
    <v-col cols="12">
      <h2>
        {{ props.isDepart ? "Adresse d'expedition" : "Adresse Livraison" }}
      </h2>
      <div :id="props.isDepart ? 'adresse-expedition' : 'adresse_livraison'">
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
                <v-btn @click="modifyAdress" id="btn-add-adresse"
                  >modifier</v-btn
                >
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
                <v-radio label="Monsieur" id="civilite-1" value="mr"></v-radio>
                <v-radio label="Madame" id="civilite-2" value="mme"></v-radio>
              </v-radio-group>
              <v-text-field
                v-model="nom"
                label="Nom"
                id="nom-adresse"
                :rules="[() => !!nom || 'This field is required']"
              ></v-text-field>
              <v-text-field
                v-model="prenom"
                id="prenom-adresse"
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
                  :disabled="!nom || !civilite || !prenom"
                  @click="addAddress"
                  id="btn-validate-adresse"
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
      <v-text-field
        label="email"
        :id="props.isDepart ? 'email-envoi' : 'email_arrivee'"
        v-model="email"
      >
      </v-text-field>
    </v-col>
  </v-row>
</template>
<script setup>
import { computed, ref, defineProps, watch, onBeforeMount } from "vue";
const props = defineProps(["trip", "order", "isDepart"]);
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

const mode_transport = ref({});
const adresse = ref({});

const isCompleted = computed(() =>
  !!mode_transport.value &&
  (mode_transport.value.id === "f21b1b15-8674-4892-9b7d-1b5fd1203f3b" ||
    mode_transport.value.id === "df7f3b02-0328-4bdc-9a1d-fc58eb5ee7fc")
    ? !!civilite.value && !!nom.value && !!prenom.value && !!email.value
    : !!mode_transport.value &&
      (mode_transport.value.id === "a12f1f76-490c-4d7a-ae3d-8627fc9a2db8" ||
        mode_transport.value.id === "c789b14a-01da-465f-8966-b54a3d3a6b8e") &&
      !!email.value
);

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

watch(isCompleted, (val) => {
  if (props.isDepart) {
    emit("completed", {
      completed: val,
      mode_envoi: mode_transport.value,
      adresse_depart: adresse.value,
      email_depart: email.value,
    });
  } else {
    emit("completed", {
      completed: val,
      mode_livraison: mode_transport.value,
      adresse_arrivee: adresse.value,
      email_arrivee: email.value,
    });
  }
});

watch(mode_transport, (val) => {
  if (props.isDepart) {
    emit("completed", {
      completed: isCompleted.value,
      mode_envoi: val,
      adresse_depart: adresse.value,
      email_depart: email.value,
    });
  } else {
    emit("completed", {
      completed: isCompleted.value,
      mode_livraison: val,
      adresse_arrivee: adresse.value,
      email_arrivee: email.value,
    });
  }
});
watch(email, (val) => {
  if (props.isDepart) {
    emit("completed", {
      completed: isCompleted.value,
      mode_envoi: mode_transport.value,
      adresse_depart: adresse.value,
      email_depart: val,
    });
  } else {
    emit("completed", {
      completed: isCompleted.value,
      mode_livraison: mode_transport.value,
      adresse_arrivee: adresse.value,
      email_arrivee: val,
    });
  }
});
watch(
  adresse,
  () => {
    if (props.isDepart) {
      emit("completed", {
        completed: isCompleted.value,
        mode_envoi: mode_transport.value,
        adresse_depart: adresse.value,
        email_depart: email.value,
      });
    } else {
      emit("completed", {
        completed: isCompleted.value,
        mode_livraison: mode_transport.value,
        adresse_arrivee: adresse.value,
        email_arrivee: email.value,
      });
    }
  },
  { deep: true }
);

onBeforeMount(() => {
  if (props.order) {
    if (props.isDepart) {
      mode_transport.value = props.order.mode_envoi || "";
      adresse.value = props.order.adresse_depart || {};
      email.value = props.order.email_depart || "";
    } else {
      mode_transport.value = props.order.mode_livraison || "";
      adresse.value = props.order.adresse_arrivee || {};
      email.value = props.order.email_arrivee || "";
    }
  }
});
</script>
<style scoped></style>
