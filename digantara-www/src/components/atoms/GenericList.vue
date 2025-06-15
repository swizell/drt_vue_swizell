<template>
  <v-container fluid class="pa-4" style="background: #0d1b2a; color: white">
    <v-row dense align="center" class="mb-2">
      <v-col cols="12" md="3">
        <v-text-field
          v-model="search"
          :placeholder="`Search by ${props.searchKeys.join(' / ')}`"
          @keydown.enter="triggerSearch"
          variant="outlined"
          dense
          clearable
          hide-details
          prepend-inner-icon="mdi-magnify"
          class="rounded-pill"
        />
      </v-col>
      
      <v-col cols="12" md="4" v-for="filter in dropdownFilters" :key="filter.label">
        <v-select 
          v-model="selectedFilters[filter.model]" 
          :items="filter.items"
          :label="filter.label"
          dense
          hide-details
          clearable
          variant="outlined"
          class="rounded-pill white-text"
          multiple
        />
      </v-col>
      <v-col cols="12" md="1">
        <v-btn @click="applyFilters" class="mt-4"><v-icon color="black" icon="mdi-filter-check"></v-icon></v-btn>
      </v-col>
    </v-row>

    <v-row dense align="center" class="mb-2">
      <v-col cols="12" class="text-right text-caption mt-4">
        {{ filteredItemsLength }} objects
      </v-col>
    </v-row>
    
    <v-data-table-virtual
      :headers="props.columns"
      :items="sortedItems"
      height="400"
      show-select
      v-model="selectedItems"
      :item-selectable="isRowSelectable"
      item-value="noradCatId"
      fixed-header
      class="elevation-2 rounded mt-2"
    >
      <template #headers="{ columns }">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            @click="col.sortable && toggleSort(col.key) && emit('sort', col.key)"
            @mouseenter="onHover(col.key, true)"
            @mouseleave="onHover(col.key, false)"
            class="cursor-pointer text-left group"
          >
            <span class="d-inline-flex align-center">
              {{ col.title }}
              <v-icon 
                v-if="col.sortable && (isHovered[col.key] || sortBy === col.key)" 
                :icon="sortBy === col.key ? sortDesc ? 'mdi-arrow-up' : 'mdi-arrow-down' : 'mdi-arrow-up'" 
                size="large"
              ></v-icon>
            </span>
          </th>
        </tr>
      </template>
      <template v-for="col in columns" #[`item.${col.key}`]="{ item }" :key="col.key">
        <div class="text-left">
          {{ item[col.key] }}
        </div>
      </template>
    </v-data-table-virtual>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from "vue";

interface DropdownFilter {
  label: string
  model: string
  filterFn?: (itemValue: any, selectedValues: any[]) => boolean
  items: string[]
}

const props = defineProps<{
  items: any[];
  columns: any[];
  selectedItemsObject: any[];
  searchKeys: string[];
  dropdownFilters: DropdownFilter[];
}>();

const emit = defineEmits<{
  (e: 'select-item', item: Pick<any, 'noradCatId' | 'name'>): void;
}>();

const isHovered = reactive<Record<string, boolean>>({});
const selectedItems = ref<(number | string)[]>([]);
const selectedFilters = reactive<Record<string, string[]>>({});
const selectedFiltersToApply = reactive<Record<string, string[]>>({});
const search = ref("");
const searchQuery = ref("");
const sortBy = ref<string | null>(null);
const sortDesc = ref(false);

for (const filter of props.dropdownFilters) {
  selectedFilters[filter.model] = [];
}

watch(selectedItems, (newVal) => {
  if (newVal.length <= 10) {
    const lastId = newVal.at(-1);
    const matchedItem = props.items.find(item => item.noradCatId === lastId);
    if (matchedItem) {
      emit('select-item', {
        noradCatId: matchedItem.noradCatId,
        name: matchedItem.name
      });
    }
  }
}, { deep: true });

watch(() => props.selectedItemsObject, (newVal) => {
  selectedItems.value = newVal.map(item => item.noradCatId);
}, { immediate: true, deep: true });

const isRowSelectable = (item: any): boolean => {
  return props.selectedItemsObject.length < 10 || 
         props.selectedItemsObject.some(i => i.noradCatId === item.noradCatId);
};

const onHover = (key: string, value: boolean) => {
  isHovered[key] = value;
};

const applyFilters = () => {
  for (const key in selectedFilters) {
    selectedFiltersToApply[key] = [...selectedFilters[key]];
  }
};

const toggleSort = (key: string) => {
  if (sortBy.value === key) {
    sortDesc.value = !sortDesc.value;
  } else {
    sortBy.value = key;
    sortDesc.value = false;
  }
};

const triggerSearch = () => {
  searchQuery.value = search.value?.trim().toLowerCase();
};

const normalizeItemValue = (value: any): string[] => {
  if (typeof value === "string" && value.includes(",")) {
    return value.replace(/[{}]/g, "").split(",").map(v => v.trim().toUpperCase());
  }
  return [value?.toString().toUpperCase()];
};

const filters = (items: any[]): any[] => {
  return items.filter(item =>
    props.dropdownFilters.every(({ model }) => {
      const selected = selectedFiltersToApply[model];
      if (!selected?.length) return true;

      const itemVal = item[model];
      const normalized = normalizeItemValue(itemVal);

      return selected.some(val => normalized.includes(val.toUpperCase()));
    })
  );
};

const applySearch = (items: any[]): any[] => {
  if (!searchQuery.value || !props.searchKeys.length) return items;

  return items.filter(item =>
    props.searchKeys.some(key => {
      const val = item[key];
      return val?.toString().toLowerCase().includes(searchQuery.value);
    })
  );
};

const sort = (items: any[]): any[] => {
  if (!sortBy.value) return items;

  return [...items].sort((a, b) => {
    let valA = a[sortBy.value!];
    let valB = b[sortBy.value!];

    const isDate = (val: any) =>
      Object.prototype.toString.call(val) === "[object Date]" ||
      !isNaN(Date.parse(val));

    if (isDate(valA) && isDate(valB)) {
      valA = new Date(valA);
      valB = new Date(valB);
    } else if (!isNaN(valA) && !isNaN(valB)) {
      valA = Number(valA);
      valB = Number(valB);
    }

    if (valA == null) return 1;
    if (valB == null) return -1;
    return valA < valB ? (sortDesc.value ? 1 : -1)
         : valA > valB ? (sortDesc.value ? -1 : 1)
         : 0;
  });
};

const sortedItems = computed<any[]>(() => {
  let result = props.items;
  result = filters(result);
  result = applySearch(result);
  result = sort(result);
  return result;
});

const filteredItemsLength = computed(() => {
  let data = props.items;

  data = data.filter(item => {
    return props.dropdownFilters.every(filter => {
      const selectedValues = selectedFiltersToApply[filter.model] || [];
      const itemValue = item[filter.model];

      if (!selectedValues.length) return true;

      if (filter.filterFn) {
        return filter.filterFn(itemValue, selectedValues);
      }

      return selectedValues.includes(itemValue);
    });
  });

  return data.length;
});
</script>


