
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  showDialog: Boolean,
});
const emit = defineEmits(['update:showDialog']);

const api = import.meta.env.VITE_API_BASE_URL;
defineExpose({ api });
const images = ref([]);
const formData = ref({
  file: null,
});

async function loadImages() {
  try {
    const res = await axios.get(`${api}/images`);
    images.value = res.data.map((filename, idx) => ({
      file_path: `${api}/uploads/${filename}`,
      description: `Image ${idx + 1}`,
    }));
  } catch (err) {
    console.error('Failed to fetch gallery:', err);
  }
}

function closeDialog() {
  emit('update:showDialog', false);
}

async function submitForm() {
  if (!formData.value.file) return;

  const form = new FormData();
  form.append('image', formData.value.file);

  try {
    await axios.post(`${api}/upload`, form);
    formData.value.file = null;
    closeDialog();
    await loadImages();
  } catch (err) {
    alert('Upload failed');
    console.error(err);
  }
}

onMounted(loadImages);
</script>

<template>
  <v-row dense class="mt-4">
    <v-col
        v-for="img in images"
        :key="img.file_path"
        cols="12" sm="6" md="4" lg="3"
    >
      <v-card elevation="2">
        <a :href="img.file_path" target="_blank">
          <v-img :src="img.file_path" height="300px" cover class="hover:opacity-80 transition-opacity" />
        </a>
        <v-card-text>
          <div class="text-caption">{{ img.description }}</div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-dialog v-model="props.showDialog" persistent max-width="500px">
    <v-card>
      <v-card-title style="align-self: center">Add New Image</v-card-title>
      <v-card-text>
          <v-file-input
              label="Select Image"
              v-model="formData.file"
              accept="image/*"
              required

              ></v-file-input>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="closeDialog">Cancel</v-btn>
        <v-btn color="teal-darken-3" @click="submitForm">Upload</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
