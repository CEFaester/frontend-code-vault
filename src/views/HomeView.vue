<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase.js'
import { ref as dbRef, onValue } from 'firebase/database'

const snippets = ref([])

onMounted(() => {
  const snippetsRef = dbRef(db, 'snippets')
  
  onValue(snippetsRef, (snapshot) => {
    const data = snapshot.val()
    
    if (data) {
      snippets.value = Object.keys(data).map(key => {
        return {
          id: key,
          ...data[key]
        }
      })
    }
  })
})
</script>
<template>
  <main class="vault">
    <h1 class="vault__title">Snippet Vault</h1>
    
    <div class="vault__grid">
      <!-- Loop igennem alle snippets -->
      <article v-for="snippet in snippets" :key="snippet.id" class="snippet-card">
        <header class="snippet-card__header">
          <h2 class="snippet-card__title">{{ snippet.title }}</h2>
          <span class="snippet-card__badge">{{ snippet.language }}</span>
        </header>
        
        <p class="snippet-card__description">{{ snippet.description }}</p>
        
        <pre class="snippet-card__code-block">
          <code>{{ snippet.code }}</code>
        </pre>
        
        <div class="snippet-card__tags">
          <span v-for="tag in snippet.tags" :key="tag" class="snippet-card__tag">
            #{{ tag }}
          </span>
        </div>
      </article>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.vault {
  &__title {
    margin-bottom: 20px;
    color: $color-primary;
  }

  &__grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}

.snippet-card {
  border: 1px solid $color-border;
  padding: 20px;
  border-radius: $border-radius;
  background-color: $color-surface-alt;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  &__title {
    margin: 0;
    color: $color-primary;
  }

  &__badge {
    background-color: $color-primary;
    color: white;
    padding: 4px 10px;
    border-radius: $border-radius-sm;
    font-size: 0.85em;
    font-weight: bold;
    text-transform: uppercase;
  }

  &__description {
    margin-bottom: 15px;
  }

  &__code-block {
    background-color: $color-code-bg;
    color: $color-code-text;
    padding: 15px;
    border-radius: $border-radius-sm;
    overflow-x: auto;
  }

  &__tags {
    display: flex;
    gap: 8px;
    margin-top: 15px;
  }

  &__tag {
    background-color: darken($color-background, 5%);
    color: $color-text-muted;
    padding: 4px 10px;
    border-radius: $border-radius-pill;
    font-size: 0.85em;
  }
}
</style>