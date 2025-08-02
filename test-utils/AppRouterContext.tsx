import React, { ReactNode } from 'react';

const RouterContext = React.createContext({});

interface AppRouterContextProviderProps {
  children: ReactNode;
  routerOverrides?: Record<string, any>;
}

export function AppRouterContextProvider({ children, routerOverrides = {} }: AppRouterContextProviderProps) {
  const defaultRouter = {
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isReady: true,
    isPreview: false,
  };

  const router = { ...defaultRouter, ...routerOverrides };

  return <RouterContext.Provider value={router}>{children}</RouterContext.Provider>;
}

export { RouterContext };
