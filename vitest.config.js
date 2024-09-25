import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['./tests/setup.js'],
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
})
