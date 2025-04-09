import { useState } from 'react'
import Nav from './components/nav.jsx'
import Body from './components/body.jsx'
import Projects from './components/projects.jsx'
import About from './components/about.jsx'

function App() {
  return (
    <>
      < Nav />
      < Body />
      < Projects />
      < About />
    </>
  )
}

export default App