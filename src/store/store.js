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

export const combinedFilter = computed({
  get() {
    if (selectedLanguage.value !== 'all') return 'lang:' + selectedLanguage.value;
    if (selectedTag.value !== 'all') return 'tag:' + selectedTag.value;
    return 'all';
  },
  set(val) {
    if (val === 'all') {
      selectedLanguage.value = 'all';
      selectedTag.value = 'all';
    } else if (val.startsWith('lang:')) {
      selectedLanguage.value = val.substring(5); // Fjerner "lang:" fra strengen
      selectedTag.value = 'all';
    } else if (val.startsWith('tag:')) {
      selectedTag.value = val.substring(4);  // Fjerner "tag:" fra strengen
      selectedLanguage.value = 'all';
    }
  }
})