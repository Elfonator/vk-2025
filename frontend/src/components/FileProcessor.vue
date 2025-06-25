<script setup>
import { ref } from 'vue';
import axios from 'axios';

const api = import.meta.env.VITE_API_BASE_URL;
const file = ref(null);
const resultMsg = ref('');

const uploadFile = async () => {
  if (!file.value) return alert('Please select a file');

  const form = new FormData();
  form.append('file', file.value);

  try {
    await axios.post(`${api}/upload`, form);
    resultMsg.value = 'Upload successful';
  } catch (err) {
    console.error(err);
    resultMsg.value = 'Upload failed';
  }
};

const triggerProcessing = async () => {
  try {
    const res = await axios.post(`${api}/process`);
    resultMsg.value = res.data;
  } catch (err) {
    console.error(err);
    resultMsg.value = 'Processing failed';
  }
};
</script>

<template>
  <v-card elevation="4" class="pa-4">
    <v-file-input
        label="Choose a .txt, .csv, or .json file"
        v-model="file"
        accept=".txt,.csv,.json"
        show-size
        prepend-icon="mdi-file-upload"
    />

    <v-btn class="mt-3" color="teal" @click="uploadFile">Upload</v-btn>
    <v-btn class="mt-3 ml-3" color="deep-purple" @click="triggerProcessing">Process</v-btn>

    <v-alert type="info" class="mt-4" v-if="resultMsg">{{ resultMsg }}</v-alert>
  </v-card>
</template>
