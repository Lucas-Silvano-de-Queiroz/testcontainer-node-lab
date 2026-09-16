import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [swc.vite()],
  test: {
    include: ['**/*.e2e-spec.?(c|m)[jt]s?(x)'],
    globalSetup: ['./test/setup/test-environment.ts'],
    fileParallelism: false,
    hookTimeout: 120000,
    testTimeout: 30000,
  },
});
