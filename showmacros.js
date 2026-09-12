import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from './supabase';

export default function ShowMacros({route}) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const day = new Date();
    let today = days[day.getDay()];
    const {userId} = route.params;

    const [dataFetched, setDataFetched] = useState(false);

    const [calories, setCalories] = useState(0);
    const [protein, setProtein] = useState(0);
    const [fats, setFats] = useState(0);
    const [carbs, setCarbs] = useState(0);

    const [calories_today,  setCaloriesToday] = useState(0);
    const [protein_today,  setProteinToday] = useState(0);
    const [fats_today,  setFatsToday] = useState(0);
    const [carbs_today,  setCarbsToday] = useState(0);

    const [mealCalories, setMealCalories] = useState('');
    const [mealProtein, setMealProtein] = useState('');
    const [mealFats, setMealFats] = useState('');
    const [mealCarbs, setMealCarbs] = useState('');

    async function logMeal() {
        const newCalories = calories_today + (Number(mealCalories) || 0);
        const newProtein = protein_today + (Number(mealProtein) || 0);
        const newFats = fats_today + (Number(mealFats) || 0);
        const newCarbs = carbs_today + (Number(mealCarbs) || 0);

        setCaloriesToday(newCalories);
        setProteinToday(newProtein);
        setFatsToday(newFats);
        setCarbsToday(newCarbs);

        await supabase
            .from('Users')
            .update({CaloriesToday: newCalories, ProteinToday: newProtein, CarbsToday: newCarbs, FatsToday: newFats})
            .eq("user_id", userId)
            .single();

        setMealCalories('');
        setMealProtein('');
        setMealFats('');
        setMealCarbs('');
    }

    useEffect(() => {
        async function fetchData() {
            const {data, error} = await supabase
                .from('Users')
                .select('Calories, Protein, Carbs, Fats')
                .eq('user_id', userId)
                .single();
            setCalories(data.Calories)
            setProtein(data.Protein)
            setCarbs(data.Carbs)
            setFats(data.Fats)
            setDataFetched(true)
        }
        fetchData();
    }, [])

    useEffect(() => {
        async function resetCalories() {
            const {data, error} = await supabase
                .from('Users')
                .select('LastMacroDate, Calories, Protein, Carbs, Fats')
                .eq('user_id', userId);
            
            if (data.LastMacroDate != today) {
                await supabase
                    .from('Users')
                    .update({CaloriesToday: 0, ProteinToday: 0, CarbsToday: 0, FatsToday: 0, LastMacroDate: today})
                    .eq("user_id", userId);
                setCaloriesToday(0);
                setProteinToday(0);
                setFatsToday(0);
                setCarbsToday(0);
            }
        }
        resetCalories();
    }, []);

    if (!dataFetched) {
        return (
            <ActivityIndicator size="large" />
        );
    }

    return (
        <ScrollView style={styles.background}>
            <View>
                <Text style={styles.title}>Today's Calories and Macros{'\n'}</Text>
                <Text style={styles.text}>Calories: {calories_today}/{calories}</Text>
                <Text style={styles.text}>Protein: {protein_today}/{protein}</Text>
                <Text style={styles.text}>Fats: {fats_today}/{fats}</Text>
                <Text style={styles.text}>Carbohydrates: {carbs_today}/{carbs}</Text>
            </View><Text>{'\n'}{'\n'}{'\n'}</Text>

            <View style={styles.row}>
                <Text style={styles.title}>Log Meal{'\n'}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>Calories: </Text><TextInput placeholder="Calories" keyboardType="numeric" style={styles.inputs} value={mealCalories} onChangeText={setMealCalories} /><Text style={styles.text}> kcal</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>Protein: </Text><TextInput placeholder="Protein" keyboardType="numeric" style={styles.inputs} value={mealProtein} onChangeText={setMealProtein} /><Text style={styles.text}> g</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>Fats: </Text><TextInput placeholder="Fats" keyboardType="numeric" style={styles.inputs} value={mealFats} onChangeText={setMealFats} /><Text style={styles.text}> g</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>Carbs: </Text><TextInput placeholder="Carbs" keyboardType="numeric" style={styles.inputs} value={mealCarbs} onChangeText={setMealCarbs} /><Text style={styles.text}> g</Text>
            </View>
                <Button style={styles.button} title="Log Meal" onPress={logMeal} /><Text>{'\n'}{'\n'}</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    background: {
        backgroundColor: "#191970",
    },
    title: {
        color: "#ffffff",
        marginTop: 50,
        alignItems: 'center',
        fontSize: 30,
        fontWeight: 'bold'
    },
    inputs: {
        color: "#ffffff",
        width: 90,
        borderWidth: 1,
        borderColor: "#ffffff",
        backgroundColor: "#1e90ff",
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    text: {
        color: "#ffffff",
        fontSize: 20,
    },
    button: {
        color: "#00bfff",
    },
    row: {
        flexDirection: 'row',
    }
});
