<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { names as nwsZoneNames } from 'virtual:nws-zones'

const route = useRoute()
const isLoading = ref(true)

const currentZone = computed(() => {
  const category = route.params.category as string
  const path = route.params.path as string

  // Find the zone by matching category and path
  return Object.values(nwsZoneNames).find(
    (zone) => zone.category === category && zone.path === path,
  )
})

interface Feature {
  '@context'?: string[]
  id?: string
  type?: string
  geometry?: {
    type?: string
    coordinates?: number[]
    bbox?: number[]
  }
  properties?: {
    id?: string
    areaDesc?: string
    geocode?: {
      UGC?: string[]
      SAME?: string[]
    }
    affectedZones?: string[]
    references?: [
      {
        '@id'?: string
        identifier: string
        sender: string
        sent: string
      },
    ]
    sent?: string
    effective?: string
    onset?: string
    expires?: string
    ends?: string
    status?: string
    messageType?: string
    category?: string
    severity?: string
    certainty?: string
    urgency?: string
    event?: string
    sender?: string
    senderName?: string
    headline?: string
    description?: string
    instruction?: string
    response?: string
    parameters?: {
      additionalProp1?: string[]
      additionalProp2?: string[]
      additionalProp3?: string[]
    }
    scope?: string
    code?: string
    language?: string
    web?: string
    eventCode?: {
      additionalProp1?: string[]
      additionalProp2?: string[]
      additionalProp3?: string[]
    }
  }
}

const mockAlerts = ref<Feature[]>([])

onMounted(() => {
  fetch(`https://api.weather.gov/alerts/active?zone=${currentZone.value?.ids?.join(',')}`)
    .then((response) => response.json())
    .then((data) => {
      mockAlerts.value = data.features || []
      isLoading.value = false
    })
    .catch(() => {
      isLoading.value = false
      // Handle error (e.g., show a notification)
    })
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'extreme':
      return '#8B0000'
    case 'severe':
      return '#FF4500'
    case 'moderate':
      return '#FFA500'
    case 'minor':
      return '#FFD700'
    default:
      return '#32CD32'
  }
}

const getUrgencyIcon = (urgency: string) => {
  switch (urgency.toLowerCase()) {
    case 'immediate':
      return '🚨'
    case 'expected':
      return '⚠️'
    case 'future':
      return '📅'
    default:
      return 'ℹ️'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}
</script>

<template>
  <div class="alerts-view">
    <!-- Header Section -->
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
        <router-link :to="`/${route.params.category}`" class="breadcrumb-link">
          {{ (route.params.category as string)?.toUpperCase() }}
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
        <span class="breadcrumb-current">{{ currentZone?.name || 'Zone' }}</span>
      </nav>

      <div class="zone-header">
        <div class="zone-info">
          <h1>{{ currentZone?.name || 'Weather Zone' }}</h1>
          <div class="zone-meta">
            <div class="zone-badges">
              <span class="state-badge">{{ currentZone?.state || 'Unknown' }}</span>
              <span class="ids-badge">{{ currentZone?.ids?.join(', ') || 'No IDs' }}</span>
            </div>
          </div>
        </div>
        <div class="status-indicator">
          <div class="status-dot disabled"></div>
          <span class="status-text">Live Updates Disabled</span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading weather alerts...</p>
    </div>

    <!-- Alerts Content -->
    <div v-else class="alerts-content">
      <!-- Coming Soon Banner -->
      <div class="coming-soon-banner">
        <div class="banner-content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="banner-icon"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <div class="banner-text">
            <h3>Real-time Updating Alerts Coming Soon!</h3>
            <p>We're building live weather alert updatings without needing to do anything.</p>
          </div>
        </div>
      </div>

      <div class="alerts-section">
        <div class="section-header">
          <h2>
            <svg
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
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Active Weather Alerts
          </h2>
          <span class="alert-count"
            >{{ mockAlerts.length }} Alert{{ mockAlerts.length !== 1 ? 's' : '' }}</span
          >
        </div>

        <div class="alerts-grid">
          <div
            v-for="alert in mockAlerts"
            :key="alert.id"
            class="alert-card"
            :style="{ '--severity-color': getSeverityColor(alert.properties!.severity!) }"
          >
            <div class="alert-header">
              <div class="alert-title">
                <span class="urgency-icon">{{ getUrgencyIcon(alert.properties!.urgency!) }}</span>
                <h3>{{ alert.properties!.event }}</h3>
              </div>
              <div class="alert-badges">
                <span
                  class="severity-badge"
                  :style="{ backgroundColor: getSeverityColor(alert.properties!.severity!) }"
                >
                  {{ alert.properties!.severity! }}
                </span>
                <span class="urgency-badge">{{ alert.properties!.urgency! }}</span>
              </div>
            </div>

            <div class="alert-content">
              <p class="alert-headline">{{ alert.properties!.headline! }}</p>
              <p class="alert-description">{{ alert.properties!.description! }}</p>

              <div class="alert-instruction" v-if="alert.properties!.instruction">
                <strong>Instructions:</strong> {{ alert.properties!.instruction }}
              </div>
            </div>

            <div class="alert-footer">
              <div class="alert-timing">
                <div class="timing-item">
                  <span class="timing-label">Effective:</span>
                  <span class="timing-value">{{ formatDate(alert.properties!.onset!) }}</span>
                </div>
                <div class="timing-item">
                  <span class="timing-label">Expires:</span>
                  <span class="timing-value">{{ formatDate(alert.properties!.expires!) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Alerts State (for when alerts are empty) -->
      <div v-if="mockAlerts.length === 0" class="no-alerts">
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
          class="no-alerts-icon"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14,2 14,8 20,8" />
          <path d="M10 12h4" />
          <path d="M10 16h2" />
        </svg>
        <h3>No Active Alerts</h3>
        <p>There are currently no weather alerts for this zone. Check back later for updates.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alerts-view {
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

.zone-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.zone-info h1 {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.75rem;
}

.zone-badges {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.state-badge {
  background: hsla(160, 100%, 37%, 0.1);
  color: hsla(160, 100%, 37%, 1);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
}

.ids-badge {
  background: var(--color-background-mute);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.8rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-background-soft);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #32cd32;
  animation: pulse 2s infinite;
}

.status-dot.disabled {
  background: #eb0909;
  animation: none;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(50, 205, 50, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(50, 205, 50, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(50, 205, 50, 0);
  }
}

.status-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top: 3px solid hsla(160, 100%, 37%, 1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.coming-soon-banner {
  background: linear-gradient(135deg, hsla(160, 100%, 37%, 0.1), hsla(160, 100%, 37%, 0.05));
  border: 2px solid hsla(160, 100%, 37%, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.banner-icon {
  color: hsla(160, 100%, 37%, 1);
  flex-shrink: 0;
}

.banner-text h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 0.25rem;
}

.banner-text p {
  color: var(--color-text);
  opacity: 0.8;
  margin: 0;
}

.alerts-section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-heading);
  margin: 0;
}

.alert-count {
  background: var(--color-background-mute);
  color: var(--color-text);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
}

.alerts-grid {
  display: grid;
  gap: 1.5rem;
}

.alert-card {
  background: var(--color-background-soft);
  border: 2px solid var(--color-border);
  border-left: 4px solid var(--severity-color);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.alert-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.alert-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.urgency-icon {
  font-size: 1.25rem;
}

.alert-title h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-heading);
  margin: 0;
}

.alert-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.severity-badge {
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.urgency-badge {
  background: var(--color-background-mute);
  color: var(--color-text);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.alert-content {
  margin-bottom: 1rem;
}

.alert-headline {
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.alert-description {
  color: var(--color-text);
  line-height: 1.5;
  margin-bottom: 1rem;
}

.alert-instruction {
  background: var(--color-background-mute);
  padding: 1rem;
  border-radius: 6px;
  border-left: 3px solid var(--severity-color);
  color: var(--color-text);
  line-height: 1.5;
}

.alert-footer {
  border-top: 1px solid var(--color-border);
  padding-top: 1rem;
}

.alert-timing {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.timing-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.timing-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text);
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.timing-value {
  font-size: 0.875rem;
  color: var(--color-text);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.no-alerts {
  text-align: center;
  padding: 4rem 2rem;
}

.no-alerts-icon {
  color: var(--color-text);
  opacity: 0.5;
  margin-bottom: 1rem;
}

.no-alerts h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.no-alerts p {
  color: var(--color-text);
  opacity: 0.8;
}

.features-preview {
  background: var(--color-background-soft);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid var(--color-border);
}

.features-preview h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 1.5rem;
  text-align: center;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  text-align: center;
  padding: 1.5rem;
  background: var(--color-background);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.feature-card h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.feature-card p {
  font-size: 0.875rem;
  color: var(--color-text);
  opacity: 0.8;
  line-height: 1.4;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .alerts-view {
    padding: 1rem 0.5rem;
  }

  .zone-header {
    flex-direction: column;
    gap: 1rem;
  }

  .zone-info h1 {
    font-size: 1.75rem;
  }

  .alert-header {
    flex-direction: column;
    gap: 0.75rem;
  }

  .alert-timing {
    grid-template-columns: 1fr;
  }

  .banner-content {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
