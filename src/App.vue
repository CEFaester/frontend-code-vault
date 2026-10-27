<template>
  <div class="app-container">
    <header class="nav-bar">
      <!-- router-link er Vues version af et <a> tag. Det skifter side uden at genindlæse browseren -->
      <router-link to="/" class="nav-link">Mine Snippets</router-link>
      <router-link to="/tilfoej" class="nav-link">Tilføj ny</router-link>
    </header>
    
    <!-- Her bliver HomeView eller AddView vist -->
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
.nav-bar {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #2c3e50;
  margin-bottom: 30px;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: bold;
  
  &.router-link-active {
    color: #42b983; // Giver den aktive side en anden farve
  }
}
</style>