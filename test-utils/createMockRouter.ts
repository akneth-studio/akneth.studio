import { NextRouter } from 'next/router';

export function createMockRouter(router: Partial<NextRouter>): NextRouter {
  return {
    basePath: '',
    pathname: '/',
    route: '/',
    asPath: '/',
    query: {},
    back: jest.fn(),
    beforePopState: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
    push: jest.fn(),
    reload: jest.fn(),
    replace: jest.fn(),
    forward: jest.fn(),
    isFallback: false,
    isReady: true,
    isPreview: false,
    isLocaleDomain: false,
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    ...router,
  };
}
