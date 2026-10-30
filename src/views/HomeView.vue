<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { db } from '@/firebase.js'
import { ref as dbRef, onValue, remove } from 'firebase/database'
import { searchQuery, selectedLanguage, selectedTag, availableTags } from '@/store/store.js'
import IconEdit from '@/components/icons/IconEdit.vue'
import IconDelete from '@/components/icons/IconDelete.vue'

const copiedId = ref(null)
const snippets = ref([])

onMounted(() => {
  // Peger på hele "snippets" grenen i databasen
  const snippetsRef = dbRef(db, 'snippets')
  
  // onValue lytter konstant efter. Hvis databasen ændres eksternt (f.eks. af botten), opdateres dette automatisk.
  onValue(snippetsRef, (snapshot) => {
    const data = snapshot.val()
    
    if (data) {
      // Firebase leverer data som et objekt med unikke nøgler.
      // Her konverterers det til et almindeligt array, som Vues v-for nemt kan bruge.
      snippets.value = Object.keys(data).map(key => {
        return {
          id: key,      // Key bliver trukket ud og gemt som "id" (vigtigt til edit/delete)
          ...data[key]  // Tilføjer resten af dataen (titel, kode, etc.)
        }
      })
    }
  })
})

const deleteSnippet = async (id) => {
  if (confirm("Er du sikker på, at du vil slette denne snippet?")) {
    try {
      // Finder den præcise lokation for den valgte kodestump ved hjælp af dens id
      const exactSnippetRef = dbRef(db, `snippets/${id}`)

      // remove() sletter hele grenen og dens indhold permanent
      await remove(exactSnippetRef)
    } catch (error) {
      console.error("Kunne ikke slette:", error)
      alert("Der skete en fejl. Tjek konsollen.")
    }
  }
}

const copyCode = async (codeText, id) => {
  try {
    await navigator.clipboard.writeText(codeText)
    copiedId.value = id
    
    setTimeout(() => {
      copiedId.value = null
    }, 2000)
  } catch (error) {
    console.error('Kunne ikke kopiere koden:', error)
  }
}

watch(snippets, (newSnippets) => {
  const tagsSet = new Set()
  newSnippets.forEach(snippet => {
    if (Array.isArray(snippet.tags)) {
      snippet.tags.forEach(tag => tagsSet.add(tag))
    }
  })
  availableTags.value = Array.from(tagsSet)
}, { deep: true })

// computed property overvåger sine afhængigheder (searchQuery, selectedLanguage osv.)
// og genberegner kun resultatet, når en af dem ændrer sig.
const filteredSnippets = computed(() => {
  // filter() kigger på alle snippets og returnerer kun dem, hvor kravene er sande.
  return snippets.value.filter(snippet => {

    // Tjekker om titlen eller beskrivelsen indeholder søgeordet
    const matchesSearch = 
      snippet.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.value.toLowerCase())

    // Hvis brugeren har valgt "all", godkendes sproget automatisk. Ellers tjekker den om de matcher.
    const matchesLanguage = 
      selectedLanguage.value === 'all' || 
      snippet.language.toLowerCase() === selectedLanguage.value.toLowerCase()

    const matchesTag = 
      selectedTag.value === 'all' || 
      (Array.isArray(snippet.tags) && snippet.tags.includes(selectedTag.value))

    // Kravene sættes sammen med AND (&&). Alle tre skal være sande for at kortet vises.
    return matchesSearch && matchesLanguage && matchesTag
  })
})

const isFiltering = computed(() => {
  return searchQuery.value !== '' || 
         selectedLanguage.value !== 'all' || 
         selectedTag.value !== 'all'
})

const resetFilters = () => {
  searchQuery.value = ''
  selectedLanguage.value = 'all'
  selectedTag.value = 'all'
}

</script>
<template>
  <main class="vault">
    <div class="vault__grid">
      <!-- Loop igennem alle snippets -->
      <article v-for="snippet in filteredSnippets" :key="snippet.id" class="snippet-card">
        <header class="snippet-card__header">
          <h2 class="snippet-card__title">{{ snippet.title }}</h2>
          <span class="snippet-card__badge">{{ snippet.language }}</span>
        </header>
        
        <p class="snippet-card__description">{{ snippet.description }}</p>
        
        <div class="snippet-card__code-wrapper">
          <pre class="snippet-card__code-block"><code>{{ snippet.code }}</code></pre>
          
          <button 
            @click="copyCode(snippet.code, snippet.id)" 
            class="snippet-card__copy-btn"
          >
            {{ copiedId === snippet.id ? 'Kopieret! ✓' : 'Kopiér' }}
          </button>
        </div>


        <footer class="snippet-card__footer">
          <div class="snippet-card__tags">
            <span v-for="tag in snippet.tags" :key="tag" class="snippet-card__tag">
              #{{ tag }}
            </span>
          </div>

          <div class="snippet-card__actions">
            <!-- Rediger knap med ikon -->
            <router-link 
              :to="`/rediger/${snippet.id}`" 
              class="snippet-card__action-btn snippet-card__action-btn--edit"
              title="Rediger snippet"
            >
              <IconEdit />
            </router-link>

            <!-- Slet knap med ikon -->
            <button 
              @click="deleteSnippet(snippet.id)" 
              class="snippet-card__action-btn snippet-card__action-btn--delete"
              title="Slet snippet"
            >
              <IconDelete />
            </button>
          </div>
        </footer>
      </article>

        <p v-if="filteredSnippets.length === 0" class="vault__empty">
          Ingen snippets matchede din søgning.
        </p>

    </div>
  </main>
</template>

<style lang="scss" scoped>
.vault {
  &__title {
    margin-bottom: 20px;
    color: $color-primary;
  }

  &__controls {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 30px;

    @media (min-width: 600px) {
      flex-direction: row;
      justify-content: space-between;
    }
  }

  &__search {
    flex: 1;
    padding: 10px 14px;
    border: 1px solid $color-border;
    border-radius: $border-radius-sm;
    font-size: 0.95rem;
    background-color: $color-surface;

    &:focus {
      outline: none;
      border-color: $color-accent;
    }
  }

  &__filters {
    display: flex;
    gap: 10px;
  }

  &__select {
    padding: 10px 14px;
    border: 1px solid $color-border;
    border-radius: $border-radius-sm;
    font-size: 0.95rem;
    background-color: $color-surface;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: $color-accent;
    }
  }

  &__reset-btn {
    padding: 10px 14px;
    background-color: transparent;
    color: $color-text-muted;
    border: 1px solid $color-border;
    border-radius: $border-radius-sm;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap; // Sikrer at teksten ikke knækker over to linjer

    &:hover {
      background-color: $color-border;
      color: $color-primary;
    }
  }

  &__empty {
    text-align: center;
    color: $color-text-muted;
    padding: 40px 0;
    font-style: italic;
  }

  &__grid {
    // Skaber kolonnerne
    column-count: 1; // Standard på mobil
    column-gap: 20px;

    // Tilføjer flere kolonner i takt med at skærmen bliver bredere
    @media (min-width: 768px) {
      column-count: 2;
    }
    @media (min-width: 1200px) {
      column-count: 3;
    }
    @media (min-width: 1600px) {
      column-count: 4; // Perfekt til ultrabrede skærme
    }
  }
}


.snippet-card {
  break-inside: avoid; 
  margin-bottom: 20px;
  border: 1px solid $color-border;
  padding: 20px;
  border-radius: $border-radius;
  background-color: $color-surface-alt;

  &__code-wrapper {
    position: relative;
    margin-bottom: 15px;
  }

  &__code-block {
    background-color: $color-code-bg;
    color: $color-code-text;
    padding: 15px;
    padding-bottom: 40px; 
    border-radius: $border-radius-sm;
    overflow-x: auto;
  }

  &__copy-btn {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: rgba(255, 255, 255, 0.15);
    color: $color-code-text;
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 4px 10px;
    border-radius: $border-radius-sm;
    font-size: 0.75rem;
    font-weight: bold;
    cursor: pointer;
    backdrop-filter: blur(4px);
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }
  }

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
    background-color: $color-border;
    color: $color-primary;
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
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 15px;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__tag {
    background-color: rgba(255, 255, 255, 0.05);
    color: $color-text-muted;
    padding: 4px 10px;
    border-radius: $border-radius-pill;
    font-size: 0.85em;
  }

  &__action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent; // Fjern browserens standard hvide/grå baggrund på <button>
    border: none;
    padding: 8px; // Ekstra luft omkring ikonet
    border-radius: $border-radius-sm;
    color: $color-primary; // Tydelig, lys farve i stedet for en mørk grå
    cursor: pointer;
    transition: all 0.2s ease;

    svg {
      display: block;
      width: 20px;  // Tvinger ikonet op i en ordentlig, læsbar størrelse
      height: 20px;
    }

    // Rediger ikon (Hover)
    &--edit:hover {
      color: $color-accent;
      border-color: $color-accent;
      background-color: rgba(244, 166, 215, 0.15);
    }

    // Slet ikon (Hover)
    &--delete:hover {
      color: #ef4444;
      border-color: #ef4444;
      background-color: rgba(239, 68, 68, 0.15);
    }
  }
}
</style>