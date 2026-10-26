<script setup lang="ts">
import type { QuestionChoice, QuestionModel } from '@/models/question.model'
import { QuestionService } from '@/services/question.service'
import { UserService } from '@/services/user.service'
import { nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'

interface Message {
  from: 'bot' | 'me'
  text: string
}

const router = useRouter()

const open = ref(false)
const node = ref<QuestionModel | null>(null)
const history = ref<Message[]>([])
const chatBody = ref<HTMLElement | null>(null)

function say(from: Message['from'], text: string) {
  history.value.push({ from, text })
  // posle dodavanja poruke skrolujemo na dno razgovora
  nextTick(() => {
    if (chatBody.value) {
      chatBody.value.scrollTop = chatBody.value.scrollHeight
    }
  })
}

// prikazuje cvor razgovora; prijava se proverava svaki put, jer se moze promeniti
async function show(id: string, announce = true) {
  const next = await QuestionService.getNode(id, UserService.currentUser() != null)
  if (next) {
    node.value = next
    if (announce) {
      say('bot', next.reply)
    }
  }
}

function pick(choice: QuestionChoice) {
  say('me', choice.text)

  if (choice.route) {
    router.push(choice.route)
    say('bot', 'Evo, otvorio sam stranicu. Treba li još nešto?')
    show('start', false)
    return
  }

  if (choice.goTo) {
    show(choice.goTo)
  }
}

function restart() {
  history.value = []
  show('start')
}

show('start')
</script>

<template>
  <div class="position-fixed bottom-0 end-0 m-3 chat-widget">
    <div class="card mb-2 chat-window" v-if="open">
      <div class="chat-head">
        <span class="chat-avatar"><i class="fa-solid fa-robot"></i></span>
        <div class="flex-grow-1 lh-sm">
          <strong>Biljko, pomoćnik</strong>
          <small class="d-block opacity-75">Odgovara odmah</small>
        </div>
        <button type="button" class="btn btn-sm text-white" title="Početak" @click="restart()">
          <i class="fa-solid fa-rotate-left"></i>
        </button>
        <button type="button" class="btn-close btn-close-white" aria-label="Zatvori" @click="open = false"></button>
      </div>

      <div class="chat-body" ref="chatBody">
        <div v-for="(m, i) in history" :key="i" class="mb-2" :class="{ 'text-end': m.from == 'me' }">
          <span class="chat-msg" :class="m.from">{{ m.text }}</span>
        </div>
      </div>

      <div class="chat-choices" v-if="node">
        <button type="button" class="chat-choice" v-for="c in node.choices" :key="c.text" @click="pick(c)">
          {{ c.text }}
        </button>
      </div>
    </div>

    <button type="button" class="btn btn-success rounded-pill shadow" @click="open = !open">
      <i class="fa-solid fa-comments"></i> Pomoć
    </button>
  </div>
</template>