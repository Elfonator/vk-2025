<script setup>
import FileProcessor from './components/FileProcessor.vue'
</script>

<template>
  <v-app>
    <v-app-bar color="teal-darken-4" dark>
      <v-toolbar-title>File Processor App</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container class="mt-6">
        <FileProcessor />
      </v-container>
    </v-main>
  </v-app>
</template>
