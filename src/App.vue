<script setup>
import { ref, onMounted } from 'vue'
import { db } from './firebase.js'
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
<style scoped>
.vault {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: sans-serif;
}

.vault__grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.snippet-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  background: #f9f9f9;
}

.snippet-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.snippet-card__badge {
  background: #42b883;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: bold;
}

.snippet-card__code-block {
  background: #282c34;
  color: #abb2bf;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
}

.snippet-card__tag {
  display: inline-block;
  margin-right: 0.5rem;
  margin-top: 1rem;
  color: #666;
  font-size: 0.875rem;
}
</style>