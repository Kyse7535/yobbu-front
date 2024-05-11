<template>
  <div>
    <div v-if="!adding_format">
      <ul v-if="formats && formats.length > 0">
        <li class="d-flex justify-space-between">
          <span v-for="header in header_format">
            {{ header }}
          </span>
        </li>
        <li v-for="format in formats" class="d-flex justify-space-between">
          <v-checkbox v-model="format.used" color="primary"></v-checkbox>
          <p>{{ format && format.title }}</p>
          <p>{{ format && format.description }}</p>
          <v-btn icon @click="delete_format_dialog = true"
            ><v-icon icon="mdi-trash-can-outline"></v-icon
          ></v-btn>
          <v-btn @click="modifyFormat(format.id)">modifier </v-btn>
          <v-dialog v-model="delete_format_dialog" width="auto">
            <v-card min-width="100" max-width="250">
              <template #text> Voulez-vous le supprimer ? </template>
              <v-card-actions>
                <v-btn @click="delete_format_dialog = false">cancel</v-btn>
                <v-btn @click="deleteFormat(format.id)" class="bg-red"
                  >delete</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </li>
      </ul>
      <v-btn @click="addNewFormat">Add a format</v-btn>
    </div>
    <div v-else>
      <AddFormat
        :format="format_to_modify"
        @cancel-add-format="adding_format = false"
        @add-format="(format) => saveFormat(format)"
      />
    </div>
  </div>
</template>
<script setup>
import { ref, watch, defineProps } from "vue";
import AddFormat from "@/components/Provider/AddFormat.vue";
import useProviderStoreComposable from "@/composables/providerStoreComposable.js";
import useHandlerMessage from "@/composables/HandlerMessage.js";
import useUtils from "@/composables/utils.js";

const utils = useUtils();
const props = defineProps(["trip_id"]);
const handlerMessage = useHandlerMessage();
const providerStore = useProviderStoreComposable();
const header_format = ref([
  "selected",
  "title",
  "description",
  "delete",
  "modify",
]);

const delete_format_dialog = ref(false);
const format_to_modify = ref(null);
const formats = ref([]);
const adding_format = ref(false);

function addNewFormat() {
  format_to_modify.value = {};
  adding_format.value = true;
}
function deleteFormat(format_id) {
  if (format_id) {
    const index = formats.value.findIndex((f) => f.id == format_id);
    if (index > -1) {
      formats.value.splice(index, 1);
    }
  }
}

function modifyFormat(format_id) {
  if (format_id) {
    format_to_modify.value = formats.value.find((f) => f.id == format_id);
    if (format_to_modify.value) {
      adding_format.value = true;
    }
  }
}

function saveFormat(format) {
  if (format) {
    if (!format.trips) {
      format.trips = new Set();
      format.trips.add(props.trip_id);
    }
    const index = formats.value.findIndex((f) => f.id == format.id);
    if (index > -1) {
      formats.value[index] = { ...format };
      handlerMessage.displayMessage("Format modified successfully");
    } else {
      formats.value.push(format);
      handlerMessage.displayMessage("Format saved successfully");
    }
  }
  adding_format.value = false;
}

watch(
  formats,
  (newVal, oldVal) => {
    if (utils.compareArrays(newVal, oldVal)) {
      formats.value = formats.value.map((f) => {
        if (!f.used && f.trips.has(props.trip_id)) {
          f.trips.delete(props.trip_id);
        }
        return f;
      });
    }
  },
  { deep: true }
);
</script>
<style scoped></style>
