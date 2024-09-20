import axios from 'axios'
import { getMainApi } from '../../src/api/api'
import { store } from '../store'
import os from 'os'

interface EventData {
  name: string //ex: 'setting_theme'
  value: any //ex: 'dark'
  widget: string
  attchment?: any
}

const api = axios.create()

let MAIN_API = null
export async function sendEvent(data: EventData) {
  try {
    const mainStore = await store.get('main')
    if (!mainStore.enableAnalytics) return

    if (!MAIN_API) {
      MAIN_API = await getMainApi()
    }

    api.defaults.baseURL = MAIN_API

    data.attchment = {
      ...data.attchment,
      userId: mainStore.userId,
      userAgent: os.platform(),
    }

    await api.post('/analytics', data)

    return true
  } catch (err) {
    return false
  }
}
