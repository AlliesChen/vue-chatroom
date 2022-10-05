<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { io } from "socket.io-client"
import ChatRoom from "./components/ChatRoom.vue"

const socket = io("http://localhost:3001");

const username = ref("test");
const room = ref("");

function joinRoom() {
  if(username.value === "" && room.value === "") return
  socket.emit("join_room", room.value);
}

</script>

<template>
  <div class="App">
    <h3>Join A Chat</h3>
    <input type="text" placeholder="John..." v-model="username">
    <input type="text" placeholder="Room ID..." v-model="room">
    <button @click="joinRoom">Join A Room</button>
    <ChatRoom :socket="socket" :username="username" :room="room" />
  </div>
</template>

<style lang="scss" scoped>


</style>
