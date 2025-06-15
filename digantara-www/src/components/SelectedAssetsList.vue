<template>
  <div>
    <h2>Selected Assets</h2>

    <v-table v-if="selectedItems.length">
      <thead>
        <tr>
          <th>noradCatId</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in selectedItems" :key="item.noradCatId">
          <td>{{ item.noradCatId }}</td>
          <td>{{ item.name }}</td>
        </tr>
      </tbody>
    </v-table>

    <div v-else>No selected assets found.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Asset {
  noradCatId: number | string
  name: string
}

const selectedItems = ref<Asset[]>([])

onMounted(() => {
  const saved = localStorage.getItem('selectedAssets')
  if (saved) {
    selectedItems.value = JSON.parse(saved) as Asset[]
  }
})
</script>
