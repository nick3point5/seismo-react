let seismoApiUrl, wsSeismoApiUrl

if (process.env.REACT_APP_PRODUCTION) {
  seismoApiUrl = `https://${process.env.REACT_APP_SEISMO_API_URL}`
  wsSeismoApiUrl = `wss://${process.env.REACT_APP_SEISMO_API_URL}`
} else {
  seismoApiUrl = 'http://localhost:4000'
  wsSeismoApiUrl = 'ws://localhost:4000'
}

export { wsSeismoApiUrl }
export default seismoApiUrl