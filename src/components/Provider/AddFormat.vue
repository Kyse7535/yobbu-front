<template>
  <v-form>
    <h2>Add a format</h2>
    <v-text-field label="title" v-model="current_format.title"></v-text-field>
    <v-textarea
      label="description"
      v-model="current_format.description"
    ></v-textarea>
    <v-btn @click="cancel">cancel</v-btn>
    <v-btn @click="saveFormat">save</v-btn>
    <v-btn @click="saveAndReuse">save and reuse them</v-btn>
  </v-form>
</template>
<script setup>
import { defineEmits, defineProps, onBeforeMount, ref } from "vue";
import useUtils from "@/composables/utils";

const utils = useUtils();
const props = defineProps(["format"]);
const emit = defineEmits(["cancel-add-format"]);
const current_format = ref({
  title: "",
  description: "",
  image: "",
});
function saveFormat() {
  if (current_format.value && !current_format.value.id) {
    current_format.value.id = utils.generateUUID();
  }
  emit("add-format", current_format.value);
}

function saveAndReuse() {}

function cancel() {
  emit("cancel-add-format");
}

onBeforeMount(() => {
  if (props.format) {
    current_format.value = { ...props.format };
  }
});
</script>
<style scoped></style>
