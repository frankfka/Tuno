import { CssBaseline, MuiThemeProvider } from '@material-ui/core';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import theme from '../client/theme/theme';
import { SWRConfig } from 'swr';
import jsonFetcher from '../client/util/jsonFetcher';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SWRConfig
        value={{
          fetcher: jsonFetcher,
        }}
      >
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </MuiThemeProvider>
      </SWRConfig>
    </>
  );
}
export default App;
