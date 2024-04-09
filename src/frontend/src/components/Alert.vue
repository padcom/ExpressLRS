<template>
  <div v-if="visible" class="alert-wrapper" @keydown.escape="close('cancel')">
    <div class="alert-frame">
      <div class="alert-header" :class="{ [alertType]: true }">
        <span class="alert-close" @click="close('cancel')">X</span>
        <component :is="image" />
      </div>
      <div class="alert-body">
        <span class="alert-title">{{ alertTitle }}</span>
        <span class="alert-message">{{ alertMessage }}</span>

        <div v-if="alertType === 'question'" class="question-buttons">
          <Button v-focus type="danger" @click="close('confirm')">
            {{ alertConfirmText }}
          </Button>
          <Button type="tertiary" class="question" @click="close('cancel')">
            {{ alertCancelText }}
          </Button>
        </div>
        <Button v-else v-focus :class="{ [alertType]: true }" @click="close('ok')">
          {{ alertButtonText }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export type AlertType = 'error' | 'success' | 'warning' | 'info' | 'question'
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import Button from '@/components/Button.vue'
import infoSvg from './alert/info.svg?component'
import successSvg from './alert/success.svg?component'
import errorSvg from './alert/error.svg?component'

const visible = ref(false)
const alertType = ref<AlertType>('info')
const alertTitle = ref<string>('Alert')
const alertMessage = ref<string>('Message')
const alertButtonText = ref<string>('OK')
const alertConfirmText = ref<string>('OK')
const alertCancelText = ref<string>('Cancel')

const image = computed(() => {
  switch (alertType.value) {
    case 'info': return infoSvg
    case 'success': return successSvg
    default: return errorSvg
  }
})

const vFocus = { mounted: (el: HTMLElement) => el.focus() }

let promiseResolve: ((value: string | PromiseLike<string>) => void) | null

function close(reason: string) {
  if (promiseResolve) promiseResolve(reason)
  promiseResolve = null
  visible.value = false
}

interface ShowAlertOptions {
  type: AlertType
  title: string
  message: string
  buttonText?: string,
  confirmText?: string,
  cancelText?: string,
}

function show({
  type,
  title,
  message,
  buttonText = 'OK',
  confirmText = 'OK',
  cancelText = 'Cancel',
}: ShowAlertOptions) {
  alertType.value = type
  alertTitle.value = title
  alertMessage.value = message
  alertButtonText.value = buttonText
  alertConfirmText.value = confirmText
  alertCancelText.value = cancelText

  return new Promise(resolve => {
    promiseResolve = resolve
    visible.value = true
  })
}

defineExpose({ show })
</script>

<style lang="postcss" scoped>
/* Alert box design by Igor Ferrão de Souza: https://www.linkedin.com/in/igor-ferr%C3%A3o-de-souza-4122407b/ */

.alert-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  margin: 0px auto;
  padding: 0px auto;
  left: 0;
  top: 0;
  overflow: hidden;
  position: fixed;
  background: rgb(0, 0, 0, 0.3);
  z-index: 999999;
}

@keyframes open-frame {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.95);
  }
  50% {
    transform: scale(0.97);
  }
  75% {
    transform: scale(0.93);
  }
  100% {
    transform: scale(1);
  }
}

.alert-frame {
  background: #fff;
  min-height: 400px;
  width: 450px;
  box-shadow: 5px 5px 10px rgb(0, 0, 0, 0.2);
  border-radius: 10px;
  animation: open-frame 0.3s linear;
}

.alert-header {
  display: flex;
  flex-direction: row;
  height: 175px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;

  &.error {
    background: var(--clr-error);
  }
  &.success {
    background: var(--clr-success);
  }
  &.warning {
    background: var(--clr-warning);
  }
  &.info {
    background: var(--clr-info);
  }
  &.question {
    background: var(--clr-question);
  }
}

.alert-img {
  height: 80px;
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  align-self: center;
}

.alert-close {
  width: 30px;
  height: 30px;
  color: rgb(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Dosis", sans-serif;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  line-height: 30px;
  transition: color 0.5s;
  margin-left: auto;
  margin-right: 5px;
  margin-top: 5px;

  &:hover {
    color: rgb(0, 0, 0, 0.5);
  }
}

.alert-body {
  padding: 30px 30px;
  display: flex;
  flex-direction: column;
  text-align: center;
  font-family: "Source Sans Pro", Helvetica, sans-serif;
}

.alert-title {
  font-size: 18px !important;
  font-family: "Source Sans Pro", Helvetica, sans-serif;
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 35px;
  color: #222;
  align-self: center;
}

.alert-message {
  font-size: 15px !important;
  color: #666;
  font-family: "Source Sans Pro", Helvetica, sans-serif;
  font-weight: 400;
  font-size: 15px;
  text-align: center;
  margin-bottom: 35px;
  line-height: 1.6;
  align-self: center;
}

.question-buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 0.5rem;
}

button {
  width: initial;
}
</style>
