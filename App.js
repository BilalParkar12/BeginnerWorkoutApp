import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CompleteExercise from "./completeexercise";
import Inputs from "./inputs";
import LogIn from "./login";
import ShowMacros from "./showmacros";
import SignUp from "./signup";
import StartWorkout from "./startWorkout";
import TodayWorkout from "./todayworkout";
import TopSetFinder from "./topsetfinder";

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

function NavigationBars({ route }) {
    const params = route.params;
    return (
        <Tab.Navigator>
            <Tab.Screen name="StartWorkout" component={StartWorkout} initialParams={params} />
            <Tab.Screen name="ShowMacros"     component={ShowMacros}     initialParams={params} />
        </Tab.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="SignUp"       component={SignUp} />
                <Stack.Screen name="LogIn"        component={LogIn} />
                <Stack.Screen name="Inputs"       component={Inputs} />
                <Stack.Screen name="TodayWorkout" component={TodayWorkout} />
                <Stack.Screen name="TopSetFinder" component={TopSetFinder} />
                <Stack.Screen name="CompleteExercise" component={CompleteExercise} />
                <Stack.Screen name="MainTabs"     component={NavigationBars} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}