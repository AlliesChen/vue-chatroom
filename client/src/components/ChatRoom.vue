<script setup lang="ts">
import { Socket } from "socket.io-client";
import { computed, onMounted, ref } from "vue";

interface MessageData {
  room: string;
  author: string;
  message: string;
  time: string;
}

const props = defineProps<{ socket: Socket; username: string; room: string }>();

const currentMessage = ref("");
const messageList = ref<MessageData[]>([]);

function getTimeString() {
  const timestamp = new Date(Date.now());
  const hourVal = timestamp.getHours();
  const minuteVal = timestamp.getMinutes();
  const hourStr = hourVal < 10 ? "0" + hourVal.toString() : hourVal.toString();
  const minuteStr =
    minuteVal < 10 ? "0" + minuteVal.toString() : minuteVal.toString();
  return `${hourStr}:${minuteStr}`;
}

async function sendMessage() {
  if (currentMessage.value === "") return;

  const messageData = {
    room: props.room,
    author: props.username,
    message: currentMessage.value,
    time: getTimeString(),
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
      class="px-4 flex-col justify-center items-start h-8 rounded-t text-semibold bg-slate text-white"
    >
      <p>Live Chat</p>
    </header>
    <main class="chat-body h-half">
      <ul v-if="messageList.length !== 0" class="px-3 flex-col gap-4">
        <li
          v-for="(msg, index) in messageList"
          class="message-container flex-col"
          :class="msg.author === username ? 'my-message' : 'others-message'"
          :key="index"
        >
          <p class="self-start py-1 px-3 w-full rounded">
            {{ msg.message }}
          </p>
          <div class="flex gap-3 w-full">
            <p class="text-sm">{{ msg.time }}</p>
            <p class="text-sm text-semibold">{{ msg.author }}</p>
          </div>
        </li>
      </ul>
    </main>
    <footer class="chat-footer flex justify-between h-8 w-full">
      <input
        class="px-1 grow w-full"
        type="text"
        placeholder="Message..."
        v-model="currentMessage"
        @keypress="
          (event) => {
            event.key === 'Enter' && sendMessage();
          }
        "
      />
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

.message-container {
  max-width: 55%;
}

.chat-body {
  border-block: none;
  border-inline: 2px solid map.get(library.$app-colors, "slate-pale");
  overflow-y: auto;
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
  align-self: end;
  align-items: end;
  > p {
    background-color: map.get(library.$app-colors, "blue-dark");
  }
  > div {
    justify-content: end;
    color: map.get(library.$app-colors, "blue-pale");
  }
}

.others-message {
  align-self: start;
  align-items: start;
  > p {
    background-color: map.get(library.$app-colors, "green-dark");
  }
  > div {
    justify-content: start;
    color: map.get(library.$app-colors, "green-pale");
  }
}

@media (prefers-color-scheme: light) {
  .my-message {
    > p {
      color: map.get(library.$app-colors, "blue-pale");
    }
    > div {
      color: map.get(library.$app-colors, "blue-neutral");
    }
  }

  .others-message {
    > p {
      color: map.get(library.$app-colors, "green-pale");
    }
    > div {
      color: map.get(library.$app-colors, "green-neutral");
    }
  }
}
</style>
