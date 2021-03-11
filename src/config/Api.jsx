let seismoApiUrl, wsSeismoApiUrl
if (process.env.REACT_APP_PRODUCTION) {
  seismoApiUrl = 'http://localhost:4000'
  wsSeismoApiUrl = 'ws://localhost:4000'
} else {
  seismoApiUrl = `https://${process.env.REACT_APP_SEISMO_API_URL}`
  wsSeismoApiUrl = `ws://${process.env.REACT_APP_SEISMO_API_URL}`
}

export { wsSeismoApiUrl }
export default seismoApiUrl