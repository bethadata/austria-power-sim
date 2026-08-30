<script setup lang="ts">
import HelpIcon from '@/components/ui/HelpIcon.vue'

withDefaults(
  defineProps<{
    label: string
    unit: string
    tooltip?: string
    modelValue: number | null | undefined
    disabled?: boolean
  }>(),
  { tooltip: '', disabled: false },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
}>()

function updateValue(val: string | number | null) {
  // Same behaviour as v-model.number, which the component cannot use because
  // the value goes through this wrapper.
  emit('update:modelValue', val === '' || val === null ? null : Number(val))
}
</script>

<template>
  <v-text-field
    :label="label"
    :model-value="modelValue"
    :disabled="disabled"
    type="number"
    variant="outlined"
    density="compact"
    hide-details
    class="number-right"
    @update:model-value="updateValue"
  >
    <template #append-inner>
      <span class="text-body-small text-medium-emphasis unit">{{ unit }}</span>
      <HelpIcon v-if="tooltip" :text="tooltip" class="ml-1" />
    </template>
  </v-text-field>
</template>

<style>
/*
 * Unscoped: the input is rendered inside Vuetify's own field markup, which a
 * scoped attribute selector does not reach.
 */
.number-right input {
  text-align: right;
  padding-right: 4px;
}

/* Chrome and Firefox spinners double the control's affordance next to a unit
   and a help icon, and they clip the right-aligned value. */
.number-right input::-webkit-outer-spin-button,
.number-right input::-webkit-inner-spin-button {
  appearance: none;
  margin: 0;
}

.number-right input[type='number'] {
  -moz-appearance: textfield;
}

.number-right .unit {
  white-space: nowrap;
}
</style>
