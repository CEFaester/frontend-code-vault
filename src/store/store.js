import { ref, computed } from 'vue'

export const searchQuery = ref('')
export const selectedLanguage = ref('all')
export const selectedTag = ref('all')

export const availableTags = ref([])

export const isFiltering = computed(() => {
  return searchQuery.value !== '' || 
         selectedLanguage.value !== 'all' || 
         selectedTag.value !== 'all'
})

export const resetFilters = () => {
  searchQuery.value = ''
  selectedLanguage.value = 'all'
  selectedTag.value = 'all'
}