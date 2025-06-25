<!-- src/App.vue -->
<script setup>
import { ref } from 'vue';
import Gallery from './components/Gallery.vue';

const showDialog = ref(false);

function openUpload() {
  showDialog.value = true;
}
</script>

<template>
  <v-app>
    <v-app-bar color="teal-darken-4" dark>
      <v-toolbar-title>K8S Upload Gallery</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container class="mt-4">
        <v-row justify="center">
          <v-btn color="teal-lighten-3" @click="openUpload" elevation="4">
            Add Image
          </v-btn>
        </v-row>

        <Gallery v-model:showDialog="showDialog" />
      </v-container>
    </v-main>
  </v-app>
</template>
