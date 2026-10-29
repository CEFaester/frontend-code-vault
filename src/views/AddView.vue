<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ref as dbRef, push } from 'firebase/database'
import { db } from '@/firebase.js'


const router = useRouter()


const title = ref('')
const language = ref('javascript')
const description = ref('')
const code = ref('')
const tags = ref('')

const saveSnippet = async () => {
  // Formatere brugerens input-string fra tags-feltet til et array af ord
  const tagsArray = tags.value
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag !== '')

  // Samler alle værdier fra formularen (v-model) i ét JSON-objekt
  const newSnippet = {
    title: title.value,
    language: language.value,
    description: description.value,
    code: code.value,
    tags: tagsArray
  }

  try {
    // Peger på overkategorien "snippets" i min Firebase database
    const snippetsRef = dbRef(db, 'snippets')
    // push() opretter et nyt, unikt ID og gemmer objektet der
    await push(snippetsRef, newSnippet)

    // Skifter side tilbage til forsiden, når koden er gemt
    router.push('/')
  } catch (error) {
    console.error("Der skete en fejl:", error)
    alert("Kunne ikke gemme koden. Tjek din konsol.")
  }
}
</script>

<template>
  <main class="add-view">
    <h1 class="add-view__title">Opret ny snippet</h1>
    

    <form class="snippet-form" @submit.prevent="saveSnippet">
      
      <div class="snippet-form__group">
        <label for="title" class="snippet-form__label">Titel</label>
        <input id="title" v-model="title" type="text" class="snippet-form__input" required placeholder="f.eks. BEM knap" />
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
        <input id="description" v-model="description" type="text" class="snippet-form__input" required placeholder="Hvad gør denne kode?" />
      </div>

      <div class="snippet-form__group">
        <label for="code" class="snippet-form__label">Kode</label>
        <textarea id="code" v-model="code" class="snippet-form__textarea" required placeholder="Indsæt koden her..."></textarea>
      </div>

      <div class="snippet-form__group">
        <label for="tags" class="snippet-form__label">Tags</label>
        <input id="tags" v-model="tags" type="text" class="snippet-form__input" placeholder="Adskil med komma (f.eks. ui, knap, css)" />
      </div>

      <button type="submit" class="snippet-form__submit">Gem i Vault</button>
    </form>
  </main>
</template>

<style lang="scss" scoped>
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

  &__input, 
  &__textarea {
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