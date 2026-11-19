import { useState } from 'react'

/** Hook state input form: const [value, onChange, setValue] = useInput('') */
export default function useInput(initial = '') {
  const [value, setValue] = useState(initial)
  const onChange = (e) => setValue(e.target.value)
  return [value, onChange, setValue]
}
