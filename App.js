import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Koti from './components/Koti';
import Kartta from './components/Kartta';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{headerShown: false}} name="Koti" component={Koti} />
        <Stack.Screen name="Kartta" component={Kartta} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
