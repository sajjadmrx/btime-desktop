import { useEffect, useState } from 'react'
import { Slider } from '../components/slider'

function App() {
  const [showArrows, setShowArrows] = useState<boolean>(false)

  function onMouseEnter() {
    setShowArrows(true)
  }

  function onMouseLave() {
    setShowArrows(false)
  }

  useEffect(() => {
    const handleColorSchemeChange = (e) => {
      document.documentElement.classList.remove('dark')
      if (e.matches) {
        document.documentElement.classList.add('dark')
      }
    }

    const colorSchemeMediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)'
    )
    handleColorSchemeChange(colorSchemeMediaQuery)

    colorSchemeMediaQuery.addEventListener('change', handleColorSchemeChange)
    return () => {
      colorSchemeMediaQuery.removeEventListener(
        'change',
        handleColorSchemeChange
      )
    }
  }, [])

  return (
    <>
      <div
        className="h-screen w-screen overflow-hidden"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLave}
      >
        <Slider showArrows={showArrows} />
      </div>
    </>
  )
}

export default App
