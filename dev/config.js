export const __DEV__ = process.env.NODE_ENV !== 'production'

const isLocalhost = window.location.hostname == 'localhost'

export const baseUrl = isLocalhost ? 'http://localhost:1200/' : '/'