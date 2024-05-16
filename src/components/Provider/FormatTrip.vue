<template>
  <div>
    <div v-if="!adding_format">
      <ul>
        <li class="d-flex justify-space-between">
          <span v-for="header in header_format">
            {{ header }}
          </span>
        </li>
        <li v-if="formats && formats.length === 0">No formats found</li>

        <div v-if="formats && formats.length > 0">
          <li v-for="format in formats" class="d-flex justify-space-between">
            <v-checkbox
              :model-value="format.trips && format.trips.has(props.trip_id)"
              @click="handleUseFormat(format.id)"
              color="primary"
            ></v-checkbox>
            <p>{{ format && format.title }}</p>
            <p>{{ format && format.description }}</p>
            <p>{{ format && format.price }}</p>
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
        </div>
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
import { ref, watch, defineProps, onBeforeMount, defineEmits } from "vue";
import AddFormat from "@/components/Provider/AddFormat.vue";
import useProviderStoreComposable from "@/composables/providerStoreComposable.js";
import useHandlerMessage from "@/composables/HandlerMessage.js";
import useUtils from "@/composables/utils.js";

const utils = useUtils();
const emit = defineEmits(["format-persisted"]);
const props = defineProps(["trip_id", "validate_format"]);
const handlerMessage = useHandlerMessage();
const providerStore = useProviderStoreComposable();
const header_format = ref([
  "selected",
  "title",
  "description",
  "price",
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

function handleUseFormat(format_id) {
  if (format_id) {
    let index_format = formats.value.findIndex((f) => f.id === format_id);
    let format = { ...formats.value[index_format] };
    if (!format.trips) {
      format.trips = new Set();
    }
    if (format.trips.has(props.trip_id)) {
      format.trips.delete(props.trip_id);
    } else {
      format.trips.add(props.trip_id);
    }
    formats.value[index_format] = format;
  }
}
function deleteFormat(format_id) {
  if (format_id) {
    try {
      providerStore.deleteFormat(format_id);
      delete_format_dialog.value = false;
    } catch (error) {
      handlerMessage.displayError(
        (error &&
          error.response &&
          error.response.data &&
          !!error.response.data.message) ||
          "error when deleting format"
      );
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
    let new_format = { ...format };
    try {
      let result = providerStore.addFormat(new_format);
      if (result > -1) {
        handlerMessage.displayMessage("Format modified successfully");
      } else {
        handlerMessage.displayMessage("Format saved successfully");
      }
    } catch (error) {
      handlerMessage.displayError(
        (error &&
          error.response &&
          error.response.data &&
          !!error.response.data.message) ||
          "error when saving format"
      );
    }
  }
  adding_format.value = false;
}

function copyFormats(formats) {
  let copy = [];
  for (let format of formats) {
    copy.push(utils.copyObject({ ...format }));
  }
  return copy;
}
watch(
  () => providerStore.getFormats(),
  (val) => {
    formats.value = copyFormats(val);
  },
  { deep: true }
);

watch(
  () => props.validate_format,
  (val) => {
    if (val) {
      try {
        let _formats = [...formats.value];
        providerStore.updateFormats(_formats);
        emit("format-persisted");
      } catch (error) {
        handlerMessage.displayError(
          (error &&
            error.response &&
            error.response.data &&
            !!error.response.data.message) ||
            "error when trying to update formats"
        );
      }
    }
  }
);

// onBeforeMount(() => {
//   formats.value = copyFormats(providerStore.getFormats());
// });

// watch(
//   formats,
//   (newVal, oldVal) => {
//     if (!utils.compareArrays(newVal, oldVal)) {
//       formats.value = formats.value.map((f) => {
//         if (f.trips.has(props.trip_id)) {
//           f.trips.delete(props.trip_id);
//         }
//         return f;
//       });
//     }
//   },
//   { deep: true }
// );
</script>
<style scoped></style>
