<template>
  <div class="app-container">
    <header class="nav-bar">
      <!-- router-link er Vues version af et <a> tag. Det skifter side uden at genindlæse browseren -->
      <router-link to="/" class="nav-bar__link">Mine Snippets</router-link>
      <router-link to="/tilfoej" class="nav-bar__link">Tilføj ny</router-link>
    </header>
    
    <!-- Her bliver HomeView eller AddView vist -->
    <router-view />
  </div>
</template>