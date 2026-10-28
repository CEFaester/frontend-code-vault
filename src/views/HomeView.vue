<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase.js'
import { ref as dbRef, onValue, remove } from 'firebase/database'

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

const deleteSnippet = async (id) => {
  if (confirm("Er du sikker på, at du vil slette denne snippet?")) {
    try {
      const exactSnippetRef = dbRef(db, `snippets/${id}`)
      await remove(exactSnippetRef)
    } catch (error) {
      console.error("Kunne ikke slette:", error)
      alert("Der skete en fejl. Tjek konsollen.")
    }
  }
}

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

        <footer class="snippet-card__footer">
          <div class="snippet-card__tags">
            <span v-for="tag in snippet.tags" :key="tag" class="snippet-card__tag">
              #{{ tag }}
            </span>
          </div>

          <button @click="deleteSnippet(snippet.id)" class="snippet-card__delete-btn">
            Slet
          </button>
        </footer>
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

&__footer {
    display: flex;
    justify-content: space-between; // Skubber tags til venstre og knappen til højre
    align-items: flex-end;
    margin-top: 15px;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__tag {
    background-color: darken($color-background, 5%);
    color: $color-text-muted;
    padding: 4px 10px;
    border-radius: $border-radius-pill;
    font-size: 0.85em;
  }

  &__delete-btn {
    background-color: transparent;
    color: #dc3545;
    border: 1px solid #dc3545;
    padding: 6px 12px;
    border-radius: $border-radius-sm;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: #dc3545;
      color: white;
    }
  }
}
</style>