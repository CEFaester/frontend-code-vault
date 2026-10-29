<script setup>
import { searchQuery, selectedLanguage, selectedTag, availableTags, combinedFilter } from '@/store/store.js'
</script>

<template>
  <div class="app-container">
    <header class="nav-bar">
      
      <div class="nav-bar__left">
        <router-link to="/" class="nav-bar__brand">CodeVault</router-link>
      </div>

      <div class="nav-bar__center">
        <input 
          v-model="searchQuery" 
          type="text" 
          class="nav-bar__search" 
          placeholder="Søg snippets..."
        />

        <!-- Den nye kombinerede dropdown -->
        <select v-model="combinedFilter" class="nav-bar__select">
          <option value="all">Sprog & Tags</option>
          
          <!-- Sektion 1: Sprog -->
          <optgroup label="Sprog">
            <option value="lang:css">CSS</option>
            <option value="lang:scss">SCSS</option>
            <option value="lang:javascript">JS</option>
            <option value="lang:vue">Vue</option>
            <option value="lang:html">HTML</option>
          </optgroup>

          <!-- Sektion 2: Tags -->
          <optgroup label="Tags" v-if="availableTags.length > 0">
            <option v-for="tag in availableTags" :key="tag" :value="'tag:' + tag">
              #{{ tag }}
            </option>
          </optgroup>
        </select>

        <button 
          v-if="isFiltering" 
          @click="resetFilters" 
          class="nav-bar__reset-btn"
          title="Nulstil filtre"
        >
          ↺
        </button>
      </div>
      
      <div class="nav-bar__right">
        <router-link to="/tilfoej" class="nav-bar__add-btn" title="Tilføj ny snippet">
          +
        </router-link>
      </div>

    </header>
    
    <div class="container">
      <router-view />
    </div>
  </div>
</template>