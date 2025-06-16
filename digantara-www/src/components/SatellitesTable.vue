<template>
  <div>
    <div v-if="isError"><Error :message="errorMessage" :retryFn="fetchData"></Error></div>
    <div v-if="isLoading">Loading satellite data... </div>
    <v-row no-gutters class="fill-height">
      <v-col v-if="!isError && !isLoading" class="pr-2 mt-2">
        <TypesChips :items="allSatellites" :typeLabels="['ROCKET BODY', 'DEBRIS', 'PAYLOAD', 'UNKNOWN']"/>
        <GenericListTable
          :dropdownFilters="dropdownFilters"
          :searchKeys="['name', 'noradCatId']"
          :items="allSatellites"
          :columns="columns"
          :selectedItemsObject="selectedItems"
          @select-item="handleItemSelected"
        />
      </v-col>
      <v-divider vertical class="mx-1" style="height: 100%; border-color: #ccc;"/>
      
      <div v-if="!isLoading && selectedItems.length" style="width: 280px">
        <SelectedItems primaryKey="noradCatId" labelKey="name" :selected="selectedItems" @clear="clearSelectedItems" @remove="removeSelectedItem" @proceed="handleProceed"/>
      </div>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import type { Satellite } from "../models/satellite";

import GenericListTable from './atoms/GenericList.vue'
import Error from './atoms/Error.vue'
import SelectedItems from './atoms/SelectedItems.vue'
import TypesChips from './atoms/TypesChips.vue'

const store = useStore()
const router = useRouter()

const MAX_SELECTION = 10

const dropdownFilters = [
  {
    label: "Object Type",
    model: "objectType",
    items: ["ROCKET BODY", "DEBRIS", "UNKNOWN", "PAYLOAD"]
  },
  {
    label: "Orbit Code",
    model: "orbitCode",
    items: [
      "LEO", "LEO1", "LEO2", "LEO3", "LEO4", "MEO", "GEO", "HEO", "IGO", "EGO",
      "NSO", "GTO", "GHO", "HAO", "MGO", "LMO", "UFO", "ESO", "UNKNOWN",
    ],
    filterFn: (itemValue: string, selectedValues: string[]): boolean => {
      const values = (itemValue || "")
        .replace(/[{}]/g, "")
        .split(",")
        .map(val => val.trim().toUpperCase())

      return selectedValues.some(val => values.includes(val.toUpperCase()))
    }
  }
]

const selectedItems = ref<Satellite[]>(getStoredItems())
const columns = ref([
  { title: 'NORAD Catalog ID', key: 'noradCatId', class: 'text-start', sortable: true },
  { title: 'Satellite Name', key: 'name', class: 'text-left', sortable: true, align: 'left' },
  { title: 'Orbit Code', key: 'orbitCode', class: 'text-start', sortable: false },
  { title: 'Object Type', key: 'objectType', class: 'text-start', sortable:  false },
  { title: 'Country Code', key: 'countryCode', class: 'text-start', sortable: true },
  { title: 'Launch Date', key: 'launchDate', class: 'text-start', sortable: true },
])

const errorMessage = ref("Unable to fetch satellite data. Please try again.")

const allSatellites = computed<Satellite[]>(() => store.getters['satellites/allSatellites'])
const isLoading = computed<boolean>(() => store.getters['satellites/isLoading'])
const isError = computed<boolean>(() => store.getters['satellites/error'])

onBeforeMount(fetchSatellites)

function getStoredItems(): Satellite[] {
  const stored = localStorage.getItem("selectedAssets")
  try {
    const parsed = JSON.parse(stored || "[]")
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function fetchSatellites(): Promise<void> {
  try {
    store.commit('satellites/setError', false)
    await store.dispatch('satellites/fetchSatellites', {
      objectTypes: ['ROCKET BODY', 'DEBRIS'],
      attributes: [
        'name', 'noradCatId', 'intlDes', 'orbitCode',
        'objectType', 'countryCode', 'launchDate',
        'decayDate', 'launchSiteCode'
      ]
    })
  } catch (error) {
    errorMessage.value = "Unable to fetch satellite data. Please try again."
  }
}

function clearSelectedItems(): void {
  selectedItems.value = []
  localStorage.removeItem("selectedAssets")
}

function removeSelectedItem(index: number): void {
  selectedItems.value.splice(index, 1)
  localStorage.setItem("selectedAssets", JSON.stringify(selectedItems.value))
}

function handleItemSelected(item: Satellite): void {
  const exists = selectedItems.value.some(i => i.noradCatId === item.noradCatId);
  if (!exists && selectedItems.value.length < MAX_SELECTION) {
    selectedItems.value.push(item);
    localStorage.setItem("selectedAssets", JSON.stringify(selectedItems.value));
  }
}

function handleProceed(): void {
  localStorage.setItem("selectedAssets", JSON.stringify(selectedItems.value))
  router.push("/selectedAssets")
}
</script>
