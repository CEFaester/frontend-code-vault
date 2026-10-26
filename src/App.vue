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
<style lang="scss" scoped>
.vault {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.snippet-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.snippet-card {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  background: #fafafa;

  &__title {
    margin-top: 0;
    color: #333;
  }

  &__code-block {
    background: #2d2d2d;
    color: #f8f8f2;
    padding: 15px;
    border-radius: 6px;
    overflow-x: auto;
  }

  &__tags {
    display: flex;
    gap: 8px;
    margin-top: 15px;
  }

  &__tag {
    background: #e0e0e0;
    padding: 4px 10px;
    border-radius: 15px;
    font-size: 0.85em;
  }
}
</style>