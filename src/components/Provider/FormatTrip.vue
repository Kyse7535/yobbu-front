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
              :model-value="
                format.trips &&
                format.trips.findIndex((t) => t === props.trip_id) > -1
              "
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
import { inject } from "vue";

const utils = useUtils();
const emit = defineEmits(["format-persisted"]);
const props = defineProps(["trip_id", "validate_format"]);
const handlerMessage = useHandlerMessage();
const providerStore = useProviderStoreComposable();
const route = inject("route");
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
      format.trips = [];
    }
    let index = format.trips.findIndex((t) => t === props.trip_id);
    if (index > -1) {
      format.trips.splice(index, 1);
    } else {
      format.trips.push(props.trip_id);
    }
    formats.value[index_format] = format;
  }
}

async function deleteFormat(format_id) {
  if (format_id) {
    try {
      await providerStore.deleteFormat(format_id);
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

async function saveFormat(format) {
  if (format) {
    let new_format = { ...format };
    try {
      await providerStore.addFormat(new_format);
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
  async (val) => {
    if (val) {
      try {
        let _formats = utils.copyObject(formats.value);
        let index = -1;
        for (let _format of _formats) {
          index = _formats.findIndex((f) => f.id === _format.id);
          if (index > -1) {
            await providerStore.updateFormat(_format);
          } else {
            await providerStore.add(_format);
          }
        }
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

onBeforeMount(async () => {
  if (route.query.trip_id) {
    await providerStore.fetchAllFormats();
  }
});
</script>
<style scoped></style>
