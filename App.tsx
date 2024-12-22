import React from 'react';
import {Provider} from 'react-redux';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {store} from './src/store/store';
import RootNavigator from './src/navigation/RootNavigator';

const rootStyles = {flex: 1};

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={rootStyles}>
      <SafeAreaProvider>
        <Provider store={store}>
          <RootNavigator />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
