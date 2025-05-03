<template>
  <div class="form-field mb-4">
    <label :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <!-- Text input -->
    <input
      v-if="type === 'text'"
      :id="id"
      v-model="localValue"
      :type="inputType || 'text'"
      :placeholder="placeholder"
      :required="required"
      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    >
    
    <!-- Email input -->
    <input
      v-else-if="type === 'email'"
      :id="id"
      v-model="localValue"
      type="email"
      :placeholder="placeholder"
      :required="required"
      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    >
    
    <!-- Phone input -->
    <input
      v-else-if="type === 'phone'"
      :id="id"
      v-model="localValue"
      type="tel"
      :placeholder="placeholder || 'e.g. (555) 123-4567'"
      :required="required"
      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    >
    
    <!-- Textarea -->
    <textarea
      v-else-if="type === 'textarea'"
      :id="id"
      v-model="localValue"
      :placeholder="placeholder"
      :required="required"
      :rows="rows || 4"
      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    ></textarea>
    
    <!-- Select dropdown -->
    <select
      v-else-if="type === 'select'"
      :id="id"
      v-model="localValue"
      :required="required"
      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    >
      <option value="" disabled selected>{{ placeholder || 'Select an option' }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    
    <!-- Radio buttons -->
    <div v-else-if="type === 'radio'" class="mt-2 space-y-2">
      <div v-for="option in options" :key="option.value" class="flex items-center">
        <input
          :id="`${id}-${option.value}`"
          v-model="localValue"
          type="radio"
          :value="option.value"
          :required="required"
          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
        >
        <label :for="`${id}-${option.value}`" class="ml-2 block text-sm text-gray-700">
          {{ option.label }}
        </label>
      </div>
    </div>
    
    <!-- Checkboxes -->
    <div v-else-if="type === 'checkbox'" class="mt-2 space-y-2">
      <div v-for="option in options" :key="option.value" class="flex items-center">
        <input
          :id="`${id}-${option.value}`"
          v-model="localSelectedOptions"
          type="checkbox"
          :value="option.value"
          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        >
        <label :for="`${id}-${option.value}`" class="ml-2 block text-sm text-gray-700">
          {{ option.label }}
        </label>
      </div>
    </div>
    
    <!-- Date input -->
    <input
      v-else-if="type === 'date'"
      :id="id"
      v-model="localValue"
      type="date"
      :required="required"
      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    >
    
    <!-- Error message -->
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    
    <!-- Help text -->
    <p v-if="helpText" class="mt-1 text-sm text-gray-500">{{ helpText }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Define option interface
interface FormOption {
  value: string;
  label: string;
}

// Define props
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text',
    validator: (value: string) => {
      return ['text', 'email', 'phone', 'textarea', 'select', 'radio', 'checkbox', 'date'].includes(value)
    }
  },
  inputType: {
    type: String,
    default: null
  },
  value: {
    type: [String, Number, Array] as PropType<string | number | string[]>,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  options: {
    type: Array as PropType<FormOption[]>,
    default: () => []
  },
  rows: {
    type: Number,
    default: 4
  },
  error: {
    type: String,
    default: ''
  },
  helpText: {
    type: String,
    default: ''
  }
})

// Define emits
const emit = defineEmits(['update:value'])

// Local state
const localValue = ref<string | number | null>(
  typeof props.value === 'string' || typeof props.value === 'number' ? props.value : null
)
const localSelectedOptions = ref<string[]>(Array.isArray(props.value) ? props.value : [])

// Watch for changes in localValue and emit update events
watch(localValue, (newValue) => {
  emit('update:value', newValue)
})

// Watch for changes in localSelectedOptions (for checkboxes)
watch(localSelectedOptions, (newValue) => {
  emit('update:value', newValue)
})

// Watch for changes in props.value
watch(() => props.value, (newValue) => {
  if (props.type === 'checkbox') {
    localSelectedOptions.value = Array.isArray(newValue) ? newValue : []
  } else if (typeof newValue === 'string' || typeof newValue === 'number') {
    localValue.value = newValue
  } else {
    localValue.value = null
  }
})
</script>
