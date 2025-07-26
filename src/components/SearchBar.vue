<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import NWSZones from 'virtual:nws-zones'

interface NWSZone {
  ids: string[]
  name: string
  state: string
  path: string
  category: string
}

const searchQuery = ref('')
const maxResults = ref(100)
const allZones = ref<NWSZone[]>([])

onMounted(() => {
  // Convert the zones object to an array for easier searching
  allZones.value = Object.values(NWSZones.names)
})

const filteredZones = computed(() => {
  if (!searchQuery.value.trim()) return []

  const query = searchQuery.value.toLowerCase().trim()

  return allZones.value.filter((zone) => {
    // Search in zone IDs
    if (zone.ids.some((id) => id.toLowerCase().includes(query))) return true

    // Search in zone name
    if (zone.name.toLowerCase().includes(query)) return true

    // Search in category
    if (zone.category.includes(query)) return true

    return false
  })
})

const handleSearch = () => {
  return
}

const clearSearch = () => {
  searchQuery.value = ''
}
</script>

<template>
  <div class="search-container">
    <div class="search-input-wrapper">
      <svg
        class="search-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search zones by ID, name, or category..."
        class="search-input"
        @input="handleSearch"
      />
      <button v-if="searchQuery" @click="clearSearch" class="clear-button" type="button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    <div v-if="searchQuery && filteredZones.length > 0" class="search-results">
      <div class="results-header">
        <span class="results-count"
          >{{ filteredZones.length }} result{{ filteredZones.length !== 1 ? 's' : '' }}</span
        >
      </div>
      <div class="results-list">
        <div
          v-for="zone in filteredZones.slice(0, maxResults)"
          :key="zone.name + zone.state"
          class="result-item"
          @click="$router.push(`/${zone.category}/${zone.path}`)"
        >
          <div class="zone-info">
            <div class="zone-name">{{ zone.name }}, {{ zone.state }}</div>
            <div class="zone-details">
              <span class="zone-ids">{{ zone.ids.join(', ') }}</span>
              <span class="zone-category">{{ zone.category.toUpperCase() }}</span>
            </div>
          </div>
        </div>
        <div v-if="filteredZones.length > maxResults" class="more-results">
          + {{ filteredZones.length - maxResults }} more results
        </div>
      </div>
    </div>

    <div v-else-if="searchQuery && filteredZones.length === 0" class="no-results">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="no-results-icon"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
        <line x1="13" y1="13" x2="13" y2="13" />
      </svg>
      <p>No zones found for "{{ searchQuery }}"</p>
      <small>Try searching by zone ID, name, or state abbreviation</small>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--color-background-soft);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.search-input-wrapper:focus-within {
  border-color: hsla(160, 100%, 37%, 0.8);
  box-shadow: 0 0 0 3px hsla(160, 100%, 37%, 0.1);
}

.search-icon {
  position: absolute;
  left: 16px;
  color: var(--color-text);
  opacity: 0.6;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 16px 20px 16px 50px;
  border: none;
  background: transparent;
  font-size: 16px;
  color: var(--color-text);
  outline: none;
  border-radius: 12px;
}

.search-input::placeholder {
  color: var(--color-text);
  opacity: 0.6;
}

.clear-button {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: var(--color-text);
  opacity: 0.6;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.clear-button:hover {
  opacity: 1;
  background: var(--color-background-mute);
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-background-soft);
  border: 2px solid var(--color-border);
  border-top: none;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 400px;
  overflow: hidden;
}

.results-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background-mute);
}

.results-count {
  font-size: 14px;
  color: var(--color-text);
  opacity: 0.8;
  font-weight: 500;
}

.results-list {
  max-height: 340px;
  overflow-y: auto;
}

.result-item {
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.2s ease;
}

.result-item:hover {
  background: var(--color-background-mute);
}

.result-item:last-child {
  border-bottom: none;
}

.zone-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.zone-name {
  font-weight: 600;
  color: var(--color-heading);
  font-size: 15px;
}

.zone-details {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.zone-ids {
  font-size: 13px;
  color: var(--color-text);
  opacity: 0.8;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.zone-category {
  font-size: 11px;
  padding: 2px 6px;
  background: hsla(160, 100%, 37%, 0.1);
  color: hsla(160, 100%, 37%, 1);
  border-radius: 4px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.more-results {
  padding: 12px 16px;
  text-align: center;
  font-size: 14px;
  color: var(--color-text);
  opacity: 0.7;
  font-style: italic;
  background: var(--color-background-mute);
}

.no-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-background-soft);
  border: 2px solid var(--color-border);
  border-top: none;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 32px 16px;
  text-align: center;
}

.no-results-icon {
  margin-bottom: 12px;
  opacity: 0.5;
}

.no-results p {
  margin-bottom: 8px;
  color: var(--color-heading);
  font-weight: 500;
}

.no-results small {
  color: var(--color-text);
  opacity: 0.7;
}

/* Responsive design */
@media (max-width: 768px) {
  .search-container {
    max-width: 100%;
  }

  .search-input {
    padding: 14px 18px 14px 46px;
    font-size: 16px; /* Prevent zoom on iOS */
  }

  .zone-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>
