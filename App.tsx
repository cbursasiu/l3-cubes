import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainScreen from './screens/MainScreen';
import {useGeneralStore} from './stores/mainStore';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const store = useGeneralStore();
  React.useEffect(() => {
    store.initLevel(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={MainScreen}
          options={{
            title: undefined,
            header: () => <></>,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
