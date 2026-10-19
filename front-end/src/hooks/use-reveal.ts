import { useEffect, useRef } from 'react'

/**
 * First-view reveal: once the element is a quarter in view, it gets `data-shown`, and
 * so does every `.reveal` inside it. The CSS in globals.css then fades and lifts them
 * in, once. Under reduced motion the CSS shows them at once, without a transition.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current

    if (!root)
      return
    const show = () => {
      root.setAttribute('data-shown', '')
      root
        .querySelectorAll('.reveal')
        .forEach(el => el.setAttribute('data-shown', ''))
    }

    if (typeof IntersectionObserver === 'undefined') {
      show()

      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting)
          return
        io.disconnect()
        show()
      },
      { threshold: 0.25 },
    )

    io.observe(root)

    return () => io.disconnect()
  }, [])

  return ref
}
