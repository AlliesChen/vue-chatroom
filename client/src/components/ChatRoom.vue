<script setup lang="ts">
import { Socket } from "socket.io-client";
import { onMounted, ref } from "vue";

const props = defineProps<{ socket: Socket; username: string; room: string }>();

const currentMessage = ref("");

async function sendMessage() {
  if (currentMessage.value === "") return;
  const timestamp = new Date(Date.now());
  const messageData = {
    room: props.room,
    author: props.username,
    message: currentMessage.value,
    time: timestamp.getHours() + ":" + timestamp.getMinutes(),
  };
  await props.socket.emit("send_message", messageData);
}

onMounted(() => {
  props.socket.on("receive_message", (data) => {
    console.log(data)
  })
})
</script>

<template>
  <div>
    <header class="chat-header">
      <p>Live Chat</p>
    </header>
    <main class="chat-body"></main>
    <footer class="chat-footer">
      <input type="text" placeholder="Hey..." v-model="currentMessage" />
      <button @click="sendMessage">&#9658;</button>
    </footer>
  </div>
</template>

<style scoped></style>
