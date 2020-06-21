<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<!-- Global styles -->
<style>
html * {
  font-family: Arial;
}

button {
  font-size: 20px;
}

input[type='submit'] {
  font-size: 20px;
}
</style>

<style scoped>
.flex-grid {
  display: flex;
  margin: auto -1rem 1rem;
}

.col {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  padding: 1rem;
}

.left-sidebar {
  flex: 0 0 auto;
}

.main {
  flex: 1 1 auto;
}

.right-col {
  flex: 0 0 auto;
}
</style>
