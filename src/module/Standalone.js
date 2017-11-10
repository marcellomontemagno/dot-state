import React from 'react';
import StateProvider from './StateProvider';
import WithState from './WithState';

export default function Standalone ({children}) {
  return <StateProvider>
    <WithState>
      {children}
    </WithState>
  </StateProvider>
}
