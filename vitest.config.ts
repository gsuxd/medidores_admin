import { defineConfig, UserConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths'


export default defineConfig(
  {
    plugins: [
      tsconfigPaths()
    ] as UserConfig['plugins'],
    test: {
      environment: 'happy-dom',
      include: ['test/unit/**/*.test.{ts,tsx}'],
      name: 'node',
      exclude: ['test/e2e/**/*.test.{ts,tsx}'],
      coverage: {
        provider: 'istanbul',
        include: ['src/**/*'],
      }
    },
  },
)