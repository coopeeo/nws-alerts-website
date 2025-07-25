<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { path as nwsZonePath } from 'virtual:nws-zones'

const route = useRoute()

const currentCategory = computed(() => route.params.category as string)
const categoryZones = computed(() => nwsZonePath[currentCategory.value] || {})
const zonesArray = computed(() => Object.values(categoryZones.value))

const formattedCategoryName = computed(() => {
  return currentCategory.value ? currentCategory.value.toUpperCase() : 'Unknown Category'
})
</script>

<template>
  <div class="categories-view">
    <div class="header">
      <nav class="breadcrumb">
        <router-link to="/" class="breadcrumb-link">
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
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9,22 9,12 15,12 15,22" />
          </svg>
          Home
        </router-link>
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
          class="breadcrumb-separator"
        >
          <polyline points="9,18 15,12 9,6" />
        </svg>
        <span class="breadcrumb-current">{{ formattedCategoryName }}</span>
      </nav>

      <div class="category-info">
        <h1>{{ formattedCategoryName }} Weather Zones</h1>
        <p>{{ zonesArray.length }} zone{{ zonesArray.length !== 1 ? 's' : '' }} available</p>
      </div>
    </div>

    <div v-if="zonesArray.length > 0" class="zones-grid">
      <router-link
        v-for="zone in zonesArray"
        :key="zone.category + zone.path"
        :to="`/${zone.category}/${zone.path}`"
        class="zone-card"
      >
        <div class="zone-card-content">
          <div class="zone-header">
            <h3 class="zone-name">{{ zone.name }}</h3>
            <div class="zone-badge">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {{ zone.state }}
            </div>
          </div>

          <div class="zone-details">
            <div class="zone-ids">
              <span class="ids-label">Zone IDs:</span>
              <div class="ids-list">
                <span v-for="id in zone.ids" :key="id" class="zone-id">
                  {{ id }}
                </span>
              </div>
            </div>
          </div>

          <div class="zone-footer">
            <span class="view-alerts">
              View Alerts
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
                class="arrow-icon"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7,7 17,7 17,17" />
              </svg>
            </span>
          </div>
        </div>
      </router-link>
    </div>

    <div v-else class="empty-state">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="empty-icon"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <h3>No zones found</h3>
      <p>There are no weather zones available for this category.</p>
      <router-link to="/" class="back-home-btn">
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
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12,19 5,12 12,5" />
        </svg>
        Back to Search
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.categories-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.header {
  margin-bottom: 2rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: hsla(160, 100%, 37%, 1);
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.breadcrumb-link:hover {
  background: hsla(160, 100%, 37%, 0.1);
}

.breadcrumb-separator {
  color: var(--color-text);
  opacity: 0.5;
}

.breadcrumb-current {
  color: var(--color-text);
  opacity: 0.8;
  font-weight: 500;
}

.category-info h1 {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.category-info p {
  font-size: 1.125rem;
  color: var(--color-text);
  opacity: 0.8;
}

.zones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.zone-card {
  background: var(--color-background-soft);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  padding: 0;
  text-decoration: none;
  transition: all 0.3s ease;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.zone-card:hover {
  border-color: hsla(160, 100%, 37%, 0.8);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.zone-card-content {
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.zone-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.zone-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-heading);
  margin: 0;
  flex: 1;
  line-height: 1.4;
}

.zone-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: hsla(160, 100%, 37%, 0.1);
  color: hsla(160, 100%, 37%, 1);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.zone-details {
  flex: 1;
  margin-bottom: 1rem;
}

.zone-ids {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ids-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
  opacity: 0.8;
}

.ids-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.zone-id {
  background: var(--color-background-mute);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-weight: 500;
}

.zone-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: auto;
}

.view-alerts {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: hsla(160, 100%, 37%, 1);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.arrow-icon {
  transition: transform 0.2s ease;
}

.zone-card:hover .arrow-icon {
  transform: translate(2px, -2px);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  color: var(--color-text);
  opacity: 0.5;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--color-text);
  opacity: 0.8;
  margin-bottom: 2rem;
}

.back-home-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: hsla(160, 100%, 37%, 1);
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.back-home-btn:hover {
  background: hsla(160, 100%, 32%, 1);
  transform: translateY(-1px);
}

/* Responsive design */
@media (max-width: 768px) {
  .categories-view {
    padding: 1rem 0.5rem;
  }

  .category-info h1 {
    font-size: 1.75rem;
  }

  .category-info p {
    font-size: 1rem;
  }

  .zones-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .zone-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .zone-badge {
    align-self: flex-start;
  }

  .breadcrumb {
    font-size: 0.8rem;
  }

  .empty-state {
    padding: 3rem 1rem;
  }
}

@media (max-width: 480px) {
  .zone-card-content {
    padding: 1.25rem;
  }

  .ids-list {
    gap: 0.25rem;
  }

  .zone-id {
    font-size: 0.7rem;
    padding: 0.2rem 0.4rem;
  }
}
</style>
