import React from 'react';

interface RouterContextType {
  push?: (url: string) => void;
  replace?: (url: string) => void;
  back?: () => void;
  forward?: () => void;
  refresh?: () => void;
  pathname?: string;
  query?: Record<string, string | string[]>;
  asPath?: string;
  // Add other router properties as needed
}

const RouterContext = React.createContext<RouterContextType>({});

export { RouterContext };
