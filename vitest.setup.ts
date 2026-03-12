import { vi } from 'vitest';

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    })),
  },
}));

// Mock router
vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
  })),
  useRoute: vi.fn(() => ({
    params: {},
    query: {},
  })),
}));

// Mock pinia
vi.mock('pinia', () => ({
  defineStore: vi.fn((id, setup) => {
    const store = setup();
    return () => store;
  }),
}));
