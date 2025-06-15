<template>
  <v-alert type="error" border="start" variant="tonal" color="error" class="ma-4">
    <v-icon class="mr-2">mdi-alert-circle-outline</v-icon>
    <span>{{ message }}</span>
    <v-btn v-if="retryFn" size="small" class="ml-4" @click="retryFn" color="red-darken-1" variant="tonal">
      Retry
    </v-btn>
  </v-alert>
</template>

<script setup lang="ts">
interface Props {
  message: string;
  retryFn?: () => void;
}

defineProps<Props>();
</script>
