import { render, screen } from '@testing-library/react'
import Home from '../src/app/page'
import '@testing-library/jest-dom'

window.URL.revokeObjectURL = jest.fn();
jest.mock('tone', () => {
  return {
    start: jest.fn(),
    Transport: {
      stop: jest.fn(),
      bpm: {
        value: null
      }
    }
  }
})

describe('Home', () => {
  it('renders', () => {
    render(<Home />);
  })
})