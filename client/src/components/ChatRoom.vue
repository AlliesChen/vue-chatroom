<script setup lang="ts">
import { Socket } from "socket.io-client";
import { computed, onMounted, ref } from "vue";

const props = defineProps<{ socket: Socket; username: string; room: string }>();

const currentMessage = ref("");
const messageList = ref([]);

async function sendMessage() {
  if (currentMessage.value === "") return;
  
  const timestamp = new Date(Date.now());
  const messageData = {
    room: props.room,
    author: props.username,
    message: currentMessage.value,
    time: timestamp.getHours() + ":" + timestamp.getMinutes(),
  };
  currentMessage.value = "";
  props.socket.emit("send_message", messageData);
  messageList.value.push(messageData);
}

onMounted(() => {
  props.socket.on("receive_message", (data) => {
    messageList.value.push(data);
  });
});
</script>

<template>
  <div class="container flex-col justify-center h-full">
    <header
      class="flex-col justify-center h-8 rounded-t text-semi-bold bg-slate text-white"
    >
      <p class="m-0">Live Chat</p>
    </header>
    <main class="chat-body h-half">
      <ul v-if="messageList.length !== 0">
        <li v-for="(msg, index) in messageList" class="flex-col" :class="msg.author === username ? 'my-message' : 'others-message'" :key="index">
          <p class="m-0">{{msg.message}}</p>
          <div class="flex">
            <p class="m-0">{{msg.time}}</p>
            <p class="m-0">{{msg.author}}</p>
          </div>
        </li>
      </ul>
    </main>
    <footer class="chat-footer flex justify-between h-8">
      <input class="px-1 grow" type="text" placeholder="Message..."
      v-model="currentMessage" @keypress="(event) => {event.key === 'Enter' &&
      sendMessage()}"/>
      <button class="send-btn h-full" @click="sendMessage">&#9658;</button>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:map";
@use "../styles/library";

.container {
  width: 50vw;
}

.chat-body {
  border-block: none;
  border-inline: 2px solid map.get(library.$app-colors, "slate-pale");
}

.chat-footer {
  border: 2px solid map.get(library.$app-colors, "slate-pale");
}

.send-btn {
  color: map.get(library.$app-colors, "slate-neutral");
}

.send-btn:hover {
  color: map.get(library.$app-colors, "green-neutral");
}

.my-message {
  align-items: end;
}

.others-message {
  align-items: start;
}
</style>
