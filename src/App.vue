<script setup>
import { searchQuery, selectedLanguage, selectedTag, availableTags, isFiltering, resetFilters } from '@/store/store.js'
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

        <select v-model="selectedLanguage" class="nav-bar__select">
          <option value="all">Sprog</option>
          <option value="css">CSS</option>
          <option value="scss">SCSS</option>
          <option value="javascript">JS</option>
          <option value="vue">Vue</option>
          <option value="html">HTML</option>
        </select>

        <select v-model="selectedTag" class="nav-bar__select">
          <option value="all">Tags</option>
          <option v-for="tag in availableTags" :key="tag" :value="tag">
            #{{ tag }}
          </option>
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