import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['./tests/setup.js'],
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "clover", "json", "json-summary"],
      reportOnFailure: true,
      include: ["src/**"],
    }
  },
})
