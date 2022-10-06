<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { io } from "socket.io-client";
import ChatRoom from "./components/ChatRoom.vue";

const socket = io("http://localhost:3001");

const username = ref("");
const room = ref("");
const showChat = ref(false);

function joinRoom() {
  if (username.value === "" && room.value === "") return;
  socket.emit("join_room", room.value);
  showChat.value = true;
}
</script>

<template>
  <div class="flex-col justify-center h-full">
    <!-- Lobby -->
    <div v-if="showChat === false" class="_translate-y flex-col gap-3">
      <h3 class="my-4 text-2xl">Join A Chat</h3>
      <input class="px-1 py-2 rounded border _border-green bg-green-pale border-green" type="text" placeholder="Display Name..." v-model="username" />
      <input class="px-1 py-2 rounded border _border-green bg-green-pale border-green" type="text" placeholder="Room ID..." v-model="room" />
      <button class="py-2 rounded bg-green text-white" @click="joinRoom">Join A Room</button>
    </div>

    <ChatRoom v-else :socket="socket" :username="username" :room="room" />
  </div>
</template>

<style lang="scss" scoped>
@use "sass:map";
@use "./styles/library";

._translate-y {
  transform: translateY(-25%)
}

._border-green:focus,
._border-green:focus-within,
._border-green:focus-visible {
  
  border-color: map.get(library.$app-colors, "blue-neutral");
  background-color: map.get(library.$app-colors, "blue-pale");
}
</style>