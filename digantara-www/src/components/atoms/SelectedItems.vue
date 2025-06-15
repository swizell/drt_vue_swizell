<template>
  <div class="selected-assets-panel">
    <div class="px-4 py-2">
      <v-row align="center" justify="space-between" class="ma-0">
        <v-col class="pa-0">
          <span class="text-info font-weight-bold">
            {{ selected.length }} objects selected
          </span>
        </v-col>
        <v-col class="pa-0" cols="auto">
          <v-btn variant="text" class="text-white" size="small" @click="emit('clear')">
            Clear All
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <v-divider class="border-opacity-25" />

    <v-list density="compact" class="px-2 py-1 asset-list">
      <v-list-item v-for="(item, index) in selected" :key="item[primaryKey]" class="px-2 py-1">
        <template #prepend>
          <span class="font-weight-bold">{{ item[primaryKey] }}</span>
        </template>

        <v-list-item-title class="ml-2">
          {{ item[labelKey] }}
        </v-list-item-title>

        <template #append>
          <v-btn icon variant="text" size="x-small" @click="emit('remove', index)">
            <v-icon size="small">mdi-close</v-icon>
          </v-btn>
        </template>
      </v-list-item>
    </v-list>

    <v-divider class="border-opacity-25" />

    <v-btn block color="primary" @click="emit('proceed')">
      Proceed
    </v-btn>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  selected: Record<string, any>[]
  primaryKey: string
  labelKey: string
}>()

const emit = defineEmits<{
  (event: 'clear'): void
  (event: 'remove', index: number): void
  (event: 'proceed'): void
}>()
</script>

<style scoped>
.selected-assets-panel {
  border: 1px solid #2a2a2a;
  background-color: #10141c;
  font-size: 14px;
}
.text-info {
  color: #0cf;
}
</style>
