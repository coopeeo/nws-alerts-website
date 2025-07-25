<script setup lang="ts">
import SearchBar from '@/components/SearchBar.vue'
</script>

<template>
  <main class="home-view">
    <div class="header">
      <h1>NWS Alerts Search</h1>
      <p>Search for National Weather Service zones by ID, name, or category</p>
    </div>

    <SearchBar />

    <div class="welcome-message">
      <svg
        class="welcome-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
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
      <h3>Start by searching for a weather zone</h3>
      <p>Use the search bar above to find NWS zones by entering:</p>
      <ul>
        <li>Zone ID (e.g., "GAZ001")</li>
        <li>Location name (e.g., "Atlanta")</li>
        <li>State abbreviation (e.g., "GA")</li>
      </ul>
    </div>
  </main>
</template>

<style scoped>
.home-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.header p {
  font-size: 1.125rem;
  color: var(--color-text);
  opacity: 0.8;
  max-width: 500px;
  margin: 0 auto;
}

.zone-card {
  background: var(--color-background-soft);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.zone-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.zone-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-heading);
  margin: 0;
  flex: 1;
}

.category-badge {
  background: hsla(160, 100%, 37%, 0.1);
  color: hsla(160, 100%, 37%, 1);
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.zone-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-row {
  display: flex;
  gap: 1rem;
}

.label {
  font-weight: 600;
  color: var(--color-heading);
  min-width: 80px;
}

.value {
  color: var(--color-text);
  flex: 1;
}

.zone-ids {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  background: var(--color-background-mute);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--color-border);
}

.welcome-message {
  text-align: center;
  margin-top: 4rem;
  padding: 2rem;
}

.welcome-icon {
  color: var(--color-text);
  opacity: 0.5;
  margin-bottom: 1rem;
}

.welcome-message h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.welcome-message p {
  color: var(--color-text);
  opacity: 0.8;
  margin-bottom: 1rem;
}

.welcome-message ul {
  text-align: left;
  max-width: 300px;
  margin: 0 auto;
  color: var(--color-text);
  opacity: 0.8;
}

.welcome-message li {
  margin-bottom: 0.5rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .home-view {
    padding: 1rem 0.5rem;
  }

  .header h1 {
    font-size: 2rem;
  }

  .header p {
    font-size: 1rem;
  }

  .zone-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .detail-row {
    flex-direction: column;
    gap: 0.25rem;
  }

  .label {
    min-width: auto;
  }
}
</style>
