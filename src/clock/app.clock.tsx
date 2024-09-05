import { useEffect, useRef, useState } from 'react'

function App() {
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
    document.body.classList.add('transparent-active')
    colorSchemeMediaQuery.addEventListener('change', handleColorSchemeChange)
    return () => {
      colorSchemeMediaQuery.removeEventListener(
        'change',
        handleColorSchemeChange
      )
    }
  }, [])

  return (
    <div className="h-screen w-screen overflow-hidden moveable">
      <FlipClock />
    </div>
  )
}

export default App

const FlipClock = () => {
  const [time, setTime] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
  })
  const hourRef = useRef(null)
  const minuteRef = useRef(null)
  const secondRef = useRef(null)

  useEffect(() => {
    const updateTime = () => {
      const date = new Date()
      let hours = date.getHours()
      hours = hours > 12 ? hours - 12 : hours
      hours = hours === 0 ? 12 : hours
      const minutes = date.getMinutes()
      const seconds = date.getSeconds()

      setTime({
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
      })
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    flipNumber(hourRef.current, time.hours)
    flipNumber(minuteRef.current, time.minutes)
    flipNumber(secondRef.current, time.seconds)
  }, [time])

  const flipNumber = (el, newNumber) => {
    if (!el) return
    const currentNumber = el.querySelector('.top .text').textContent
    if (currentNumber === newNumber) return

    const flipper = el.closest('.flipper')
    flipper.classList.add('flipping')
    const newTop = el.querySelector('.top').cloneNode(true)
    const newBottom = el.querySelector('.bottom').cloneNode(true)
    newTop.classList.add('new')
    newBottom.classList.add('new')
    newBottom.querySelector('.text').textContent = newNumber

    el.querySelector('.top').after(newTop)
    newTop.appendChild(newBottom)

    el.querySelector('.top:not(.new) .text').textContent = newNumber
    setTimeout(() => {
      el.querySelector('.bottom:not(.new) .text').textContent = newNumber
      flipper.classList.remove('flipping')
      el.querySelectorAll('.new').forEach((node) => node.remove())
    }, 500)
  }

  return (
    <div className="clock grid grid-cols-3 gap-3 p-3 rounded-[30px]">
      {[hourRef, minuteRef, secondRef].map((ref, index) => (
        <div
          key={index}
          className="flipper relative transform-style-3d perspective-[1600px]  content-center h-100 mt-auto mb-auto"
          ref={ref}
        >
          <div className="top relative !w-full sm:h-20 h-[95px] bg-gradient-to-b from-[#303135] to-[#38393e] mt-2.5 mb-1.5 rounded-t-[19px] shadow-[0_6px_6px_1px_rgba(0,0,0,0.5),0_2px_2px_1px_rgba(255,255,255,0.15)] border-t-2 border-[#66676e] border-b-2 border-b-black">
            <div className="text lg:text-[140px] xs:text-[140px] md:text-[100px] sm:text-[100px]  absolute w-full h-full overflow-hidden leading-[193px] text-center text-gray-300 font-[balooTamma]">
              00
            </div>
          </div>
          <div className="bottom relative !w-full sm:h-20 h-[95px] bg-gradient-to-b from-[#39393f] to-[#414147] mt-1.5 mb-2.5 rounded-b-[19px] shadow-[0_6px_6px_1px_rgba(0,0,0,0.5),0_2px_2px_1px_rgba(255,255,255,0.15)] border-t-2 border-[#66676e] border-b-2 border-b-black">
            <div className="text lg:text-[140px] xs:text-[140px] md:text-[100px] sm:text-[100px] absolute w-full h-full overflow-hidden leading-[0] text-center text-gray-300 font-[balooTamma]">
              00
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
