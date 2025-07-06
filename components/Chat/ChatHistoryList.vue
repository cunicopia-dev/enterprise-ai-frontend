<template>
  <div class="flex flex-col h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Chat History</h3>
        <UButton 
          icon="i-heroicons-plus" 
          size="xs" 
          variant="ghost" 
          color="gray" 
          @click="startNewChat"
          :disabled="isLoading"
        />
      </div>
      <UButton 
        label="New Chat" 
        icon="i-heroicons-plus-circle" 
        color="primary" 
        variant="soft" 
        size="sm" 
        block 
        @click="startNewChat"
        :disabled="isLoading"
      />
    </div>
    <div v-if="isLoading" class="p-4">
      <div v-for="i in 5" :key="i" class="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
    </div>
    <div v-else-if="Object.keys(chats).length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
      No chat history yet. Start a new conversation!
    </div>
    <div v-else class="flex-1 overflow-y-auto p-2">
      <NuxtLink
        v-for="chat in formattedChats"
        :key="chat.id"
        :to="chat.to"
        class="flex items-center gap-2 p-2 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        active-class="bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400"
      >
        <UIcon :name="chat.icon" class="flex-shrink-0" />
        <span class="truncate">{{ chat.label }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChat } from '~/composables/useApi'
import type { Conversation } from '~/types/api'

const emit = defineEmits<{
  selectChat: [chatId: string]
}>()

const { getChatList } = useChat()
const chats = ref<Record<string, Conversation>>({})
const isLoading = ref(false)

const formattedChats = computed(() => {
  // The chats object has chat IDs as keys
  return Object.entries(chats.value).map(([chatId, chat]) => ({
    label: chat.title || `Chat ${new Date(chat.created_at).toLocaleDateString()}`,
    icon: 'i-heroicons-chat-bubble-left-right',
    to: `/chat/${chatId}`,
    id: chatId
  }))
})

const fetchChatHistory = async () => {
  isLoading.value = true
  try {
    const response = await getChatList()
    chats.value = response.chats || {}
  } catch (e) {
    console.error('Failed to fetch chat history:', e)
  } finally {
    isLoading.value = false
  }
}

const selectChat = (link: { id: string; to: string }) => {
  navigateTo(link.to)
}

const startNewChat = () => {
  navigateTo('/chat')
}

// Refresh chat history when route changes
const route = useRoute()
watch(() => route.params.id, () => {
  fetchChatHistory()
})

onMounted(() => {
  fetchChatHistory()
  
  // Set up interval to refresh chat list periodically
  const interval = setInterval(() => {
    fetchChatHistory()
  }, 5000) // Refresh every 5 seconds
  
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>
