<template>
  <v-row class="mb-4" align="center" dense>
    <v-chip
      v-for="type in typeChips"
      :key="type.label"
      class="pa-4"
      text-color="white"
      pill
      size="small"
    >
      {{ type.label }} ({{ type.count }})
    </v-chip>
  </v-row>
</template>

<script setup lang="ts">
import { computed, defineProps} from 'vue'

const props = defineProps<{
  items: any[]
  typeLabels: string[]
}>()

const typeChips = computed(() => {
  const all = props.items || []
  const groupByType = (type: string) => all.filter((i) => i.objectType?.toUpperCase() === type.toUpperCase()).length

  return [
    { label: 'All Objects', count: all.length },
    ...props.typeLabels.map(type => ({
      label: type,
      count: groupByType(type)
    }))
  ]
})
</script>
