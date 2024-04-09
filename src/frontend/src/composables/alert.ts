import { provide, inject, toValue, type InjectionKey, type Ref } from 'vue'
import Alert from '@/components/Alert.vue'

type ShowAlert = InstanceType<typeof Alert>['show']

const ALERT_KEY = Symbol('alert') as InjectionKey<ShowAlert>

export function provideAlert(alert: Ref<InstanceType<typeof Alert> | undefined>) {
  // eslint-disable-next-line arrow-body-style
  provide(ALERT_KEY, (...args: any[]) => {
    // @ts-ignore xxx
    return toValue(alert)?.show(...args) || Promise.resolve('cancel')
  })
}

export function useAlert() {
  const show = inject(ALERT_KEY) || (() => Promise.resolve('cancel'))

  function info(title: string, message: string, button?: string) {
    return show({ type: 'info', title, message, buttonText: button })
  }

  function warning(title: string, message: string, button?: string) {
    return show({ type: 'warning', title, message, buttonText: button })
  }

  function error(title: string, message: string, button?: string) {
    return show({ type: 'error', title, message, buttonText: button })
  }

  function question(title: string, message: string, yes: string, no: string) {
    return show({ type: 'question', title, message, confirmText: yes, cancelText: no })
  }

  function success(title: string, message: string, button?: string) {
    return show({ type: 'success', title, message, buttonText: button })
  }

  return {
    show,
    info,
    warning,
    error,
    question,
    success,
  }
}
