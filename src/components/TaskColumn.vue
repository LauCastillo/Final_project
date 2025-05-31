<script setup>
import TaskCard from "./TaskCard.vue";
defineProps({
  estadoColumn: Object,
    estados: Array,
  tasks: Array
});
const emit = defineEmits(["edit-task", "remove-task", "change-status"]);
</script>

<template>
  <div :name="`estado-${estadoColumn.name.toLowerCase()}`" class="flex-1 min-w-[200px] bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4 text-center">
      {{ estadoColumn.name }}
    </h2>
    <div class="flex-grow  pr-2 -mr-2">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :estadoColumn="estadoColumn"
        :estados="estados"
        @edit-task="emit('edit-task', $event)"
        @remove-task="emit('remove-task', $event)"
        @change-status="emit('change-status', $event)"
      />
    </div>
  </div>
</template>
<style scoped>
h2{
    text-transform: capitalize;
}
</style>