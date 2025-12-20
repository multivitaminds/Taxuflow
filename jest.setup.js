// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom"

// Mock Next.js router
// `jest` is available as a global in the Jest environment
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }
  },
  usePathname() {
    return ""
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock Supabase
jest.mock("@supabase/ssr", () => ({
  createBrowserClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    })),
  })),
}))
