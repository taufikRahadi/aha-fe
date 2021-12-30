<template>
  <div class="this">
    <div class="flex this w-screen h-screen justify-center items-center">
      <div class="bg-white shadow-md rounded-md px-5 py-5 w-1/5 h-fit">
        <h3 class="text-2xl text-gray-600">{{ $route.name }}</h3>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style>
.this {
  background-color: #dfe6e9;
}
</style>
