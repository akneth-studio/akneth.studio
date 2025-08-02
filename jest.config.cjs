const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  // Lepsza konfiguracja aliasów i pokrycia kodu
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$'
: 'identity-obj-proxy',
    // Obsługa aliasów ścieżek (jeśli używasz `@/` w `tsconfig.json`)
    '^@/(.*)$'
: '<rootDir>/src/$1',
  },
  coverageReporters: ['text', 'lcov', 'cobertura'],
  // Określenie, które pliki mają być uwzględnione w raporcie pokrycia kodu
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/_app.{js,jsx,ts,tsx}',
    '!src/**/_document.{js,jsx,ts,tsx}',
    '!src/pages/api/**', // Zazwyczaj nie testuje się API w ten sposób
  ],
  // Ignorowanie ścieżek podczas wyszukiwania testów
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
};

// Lista modułów ESM w node_modules, które wymagają transformacji przez Babel/SWC
const esmModulesToTransform = [
  'isows', 'react-markdown', 'rehype-raw', 'comma-separated-tokens',
  'space-separated-tokens', 'web-namespaces', 'zwitch', 'html-void-elements',
  'isomorphic-ws', '@supabase/.*', 'unified', 'is-plain-obj', 'remark-.*', 'rehype-.*', 'estree-util-is-identifier-name', 'html-url-attributes',
  'unist-.*', 'hast-.*', 'mdast-.*', 'micromark', 'micromark-.*', 'decode-named-character-reference', 'trim-lines', 'vfile.*', 'bail',
  'trough', 'd3-.*', 'internmap', 'delaunator', 'robust-predicates',
  'devlop', 'hastscript', 'property-information',
].join('|');

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
// We wrap it in an async function to modify the config after it's created.
module.exports = async () => {
  process.env.TZ = 'Europe/Warsaw';
  const jestConfig = await createJestConfig(customJestConfig)();
  // The following line is the key fix for the ESM-related errors.
  // It modifies the default transformIgnorePatterns from next/jest.
  jestConfig.transformIgnorePatterns[0] = `/node_modules/(?!(${esmModulesToTransform}))`;
  return jestConfig;
};