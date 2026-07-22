import { useState } from 'react'

export function useLocalStorageState<T>(
  _key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, _setValue] = useState<T>(() => {
    let val = initialValue
    try { 
      val = JSON.parse(localStorage.getItem(_key)?? 'null')
      if(val===null) val=initialValue
    }
    catch {
      console.warn(`Invalid JSON in localStorage[${_key}], falling back to initialValue`)
    }
    return val
  })
  const setValue = (_value: T | ((prev: T) => T)): void => {
    _setValue(prev => {
      const nextValue =
        typeof _value === 'function'
          ? (_value as (prev: T) => T)(prev)
          : _value

      localStorage.setItem(_key, JSON.stringify(nextValue))

      return nextValue
    })
  }
  return [value, setValue]
}
