'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { persistor, store } from '.';
import { PersistGate } from 'redux-persist/integration/react';
import { EthersProvider } from './ethersProvider/ethersProvider';

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <EthersProvider>{children}</EthersProvider>
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
