<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ref as dbRef, get, update } from 'firebase/database'
import { db } from '@/firebase.js'

const route = useRoute()
const router = useRouter()

const title = ref('')
const language = ref('javascript')
const description = ref('')
const code = ref('')
const tags = ref('')

// Hent den eksisterende data når siden loades
onMounted(async () => {
  try {
    const snippetRef = dbRef(db, `snippets/${route.params.id}`)
    const snapshot = await get(snippetRef)
    
    if (snapshot.exists()) {
      const data = snapshot.val()
      title.value = data.title
      language.value = data.language
      description.value = data.description
      code.value = data.code
      
      // Lav tags arrayet tilbage til en komma-separeret string til input-feltet
      if (data.tags) {
        tags.value = data.tags.join(', ')
      }
    }
  } catch (error) {
    console.error("Kunne ikke hente snippet:", error)
  }
})

const updateSnippet = async () => {
  const tagsArray = tags.value
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag !== '')

  const updatedData = {
    title: title.value,
    language: language.value,
    description: description.value,
    code: code.value,
    tags: tagsArray
  }

  try {
    const snippetRef = dbRef(db, `snippets/${route.params.id}`)
    // update() overskriver kun de felter vi sender med
    await update(snippetRef, updatedData)
    router.push('/')
  } catch (error) {
    console.error("Der skete en fejl:", error)
    alert("Kunne ikke opdatere koden.")
  }
}
</script>

<template>
  <main class="add-view">
    <h1 class="add-view__title">Rediger snippet</h1>
    
    <form class="snippet-form" @submit.prevent="updateSnippet">
      <div class="snippet-form__group">
        <label for="title" class="snippet-form__label">Titel</label>
        <input id="title" v-model="title" type="text" class="snippet-form__input" required />
      </div>

      <div class="snippet-form__group">
        <label for="language" class="snippet-form__label">Sprog</label>
        <select id="language" v-model="language" class="snippet-form__input" required>
          <option value="css">CSS</option>
          <option value="scss">SCSS</option>
          <option value="javascript">JavaScript</option>
          <option value="vue">Vue</option>
          <option value="html">HTML</option>
        </select>
      </div>

      <div class="snippet-form__group">
        <label for="description" class="snippet-form__label">Beskrivelse</label>
        <input id="description" v-model="description" type="text" class="snippet-form__input" required />
      </div>

      <div class="snippet-form__group">
        <label for="code" class="snippet-form__label">Kode</label>
        <textarea id="code" v-model="code" class="snippet-form__textarea" required></textarea>
      </div>

      <div class="snippet-form__group">
        <label for="tags" class="snippet-form__label">Tags</label>
        <input id="tags" v-model="tags" type="text" class="snippet-form__input" />
      </div>

      <button type="submit" class="snippet-form__submit">Gem ændringer</button>
    </form>
  </main>
</template>

<style lang="scss" scoped>
// Vi kan genbruge præcis samme styling som i AddView
.add-view {
  &__title {
    margin-bottom: 24px;
    color: $color-primary;
  }
}

.snippet-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: $color-surface-alt;
  padding: 30px;
  border-radius: $border-radius;
  border: 1px solid $color-border;

  &__group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__label {
    font-weight: bold;
    font-size: 0.9rem;
    color: $color-primary;
  }

  &__input, &__textarea {
    padding: 12px;
    border: 1px solid $color-border;
    border-radius: $border-radius-sm;
    font-family: inherit;
    font-size: 1rem;
    background-color: $color-surface;
    
    &:focus {
      outline: none;
      border-color: $color-accent;
    }
  }

  &__textarea {
    min-height: 150px;
    resize: vertical;
    font-family: monospace; 
  }

  &__submit {
    margin-top: 10px;
    padding: 12px 24px;
    background-color: $color-accent;
    color: white;
    border: none;
    border-radius: $border-radius-sm;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: $color-accent-hover;
    }
  }
}
</style>