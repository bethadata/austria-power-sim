<template>
  <v-text-field
    :label="label"
    type="number"
    :model-value="modelValue"
    @update:modelValue="updateValue"
    class="filled-outlined number-right"
    variant="outlined"
  >
    <template #append-inner>
      <v-chip size="small" label class="mr-2">
        {{ unit }}
      </v-chip>

      <v-tooltip open-on-click location="top" :open-on-hover="false">
        <template #activator="{ props }">
          <v-icon v-bind="props" size="18" class="help-icon">
            mdi-help-circle-outline
          </v-icon>
        </template>
        {{ tooltip }}
      </v-tooltip>
    </template>
  </v-text-field>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  unit: string
  tooltip: string
  modelValue: number | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
}>()

function updateValue(val: string | number | null) {
  // ensure number behavior like v-model.number
  const num = val === '' || val === null ? null : Number(val)
  emit('update:modelValue', num)
}
</script>


<style> 

.help-icon:hover {
  color: rgb(var(--v-theme-primary));
}

.filled-outlined .v-field {
  background-color: rgba(var(--v-theme-surface), 0.5);
}

.number-right input {
  text-align: right;
  padding-right: 4px;
}

</style>