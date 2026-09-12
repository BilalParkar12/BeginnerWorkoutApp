import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import { supabase } from './supabase';

const api_url = "https://pythonbackend-2f9z.onrender.com"

const AGES = Array.from({ length: 38 }, (_, i) => 18 + i);
const GOALS = ["Building muscle", "Strength"]
const DAYS = [3, 4, 5]

export default function MainScreen ({route, navigation}) {
    const [weight,  setWeight] = useState("");
    const [height,  setHeight] = useState("");
    const [age,  setAge] = useState(null);
    const [gender,  setGender] = useState(null)
    const [goals,  setGoals] = useState([]);
    const [days,  setDays] = useState(null);
    const [dataFound, setDataFound] = useState(true);
    const {userId} = route.params;

    function toggleGoal(goal) {
        if (goals.includes(goal)) {
            setGoals(goals.filter((g) => g != goal));
        } else {
            setGoals([...goals, goal]);
        }
    }
    function validate() {
        if (!weight) {
            Alert.alert("Ensure your weight is inserted");
            return false;
        }
        if (!height) {
            Alert.alert("Ensure your height is inserted");
            return false;
        }
        if (!gender) {
            Alert.alert("Missing info", "Please select your gender.");
            return false;
        }
        if (!age) {
            Alert.alert("Ensure your age is inserted");
            return false;
        }
        if (goals.length === 0) {
            Alert.alert("Ensure your fitness goals are inserted");
            return false;
        }
        if (!days) {
            Alert.alert("Ensure the number of days you can train is inserted");
            return false;
        }
        return true;
    }

    const daysOftheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const day = new Date();
    let today = daysOftheWeek[day.getDay()];
    
    async function submit() {
        if (!validate()) return;
        setDataFound(false);
        const response = await fetch(`${api_url}/calculate`, {
            method: "POST",
            headers: {  "Content-Type": "application/json" },
            body: JSON.stringify({
                age: Number(age),
                weight: parseFloat(weight),
                height: parseFloat(height),
                gender: gender,
                goals: goals,
                days: Number(days)
            }),
        });
        if (!response.ok) throw new Error("Server error");
        const data = await response.json();
        
        await supabase
            .from('Users')
            .insert({
                user_id: userId,
                Weight: Number(weight),
                Height: Number(height),
                Gender: gender,
                Age: Number(age),
                user_id: userId,
                Calories: Number(data.calories),
                Protein: Number(data.protein),
                Carbs: Number(data.carbs),
                Fats: Number(data.fat),
                Plan: data.plan,
                WorkoutDate: today,
                LastMacroDate: today,
            })
        setDataFound(true)

        navigation.navigate("MainTabs", {userId: userId})
    }

    if (!dataFound) {
        return (
            <ActivityIndicator size="large" />
        );
    }

    return (
        <ScrollView style={styles.background}>
            <Text style={styles.title}>Let's get started</Text>
            <Text style={styles.text}>Tell us about yourself so we can build your plan{'\n'}</Text>
            <View style={styles.row}>
                <Text style={styles.text}>Weight: </Text>
                <TextInput
                    keyboardType="decimal-pad"
                    style={styles.input}
                    value={weight}
                    onChangeText={setWeight}
                />
                <Text style={styles.text}> kg{'\n'}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.text}>Height: </Text>
                <TextInput
                    keyboardType="numeric"
                    style={styles.input}
                    value={height}
                    onChangeText={setHeight}
                />
            <Text style={styles.text}> cm{'\n'}</Text>
            </View>

            <Text style={styles.text}>Age{'\n'}</Text>
            <ScrollView>
                {AGES.map((a) => (
                    <TouchableOpacity
                        key={a}
                        style={[styles.ageBtn, age === a && styles.ageBtnSelected]}
                        onPress={() => setAge(a)}
                    >
                        <Text style={[styles.ageBtnText, age === a && styles.ageBtnTextSelected]}>
                            {a}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView><Text>{'\n'}</Text>
        <View>
            <Text style={styles.text}>Gender{'\n'}</Text>
                <RadioButton.Group
                    onValueChange={(value) => setGender(value)}
                    value={gender}
                >
                    <View style={styles.row}>
                        <Text style={styles.text}>Male</Text>
                        <RadioButton value="male" color="#fafafa" />
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>Female</Text>
                        <RadioButton value="female" color="#fafafa" />
                    </View>
                </RadioButton.Group>
        </View><Text>{'\n'}</Text>

            <Text style={styles.text}>Fitness goals</Text>
            <Text style={styles.text}>Select all that apply{'\n'}</Text>
            {GOALS.map((g) => {
                const checked = goals.includes(g);
                return (
                <TouchableOpacity
                    style={styles.row}
                    key={g}
                    onPress={() => toggleGoal(g)}
                >
                    <Text style={styles.text}>
                    {g}
                    </Text>
                    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                    {checked && <Text style={styles.checkMark}>✓</Text>}
                    </View>
                </TouchableOpacity>
                );
            })}
            <Text style={styles.text}>{'\n'}Days per week to train{'\n'}</Text>
            <View>
                {DAYS.map((d) => (
                <TouchableOpacity
                    key={d}
                    style={[styles.dayBtn, days === d && styles.dayBtnSelected]}
                    onPress={() => setDays(d)}
                >
                    <Text style={[styles.dayBtnText, days === d && styles.dayBtnTextSelected]}>
                    {d}
                    </Text>
                </TouchableOpacity>
                ))}
            </View><Text>{'\n'}</Text>
            <Button style={styles.button} onPress={submit} title="Build my plan"></Button>
            <View>
                <Text>{'\n'}{'\n'}{'\n'}</Text>
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    dayBtn: {
        width: 52,
        height: 52,
        borderRadius: 26,
        borderWidth: 0.5,
        borderColor: "#ddd",
        backgroundColor: "#fafafa",
        alignItems: "center",
        justifyContent: "center",
    },
    dayBtnSelected: {
        backgroundColor: "#534AB7",
        borderColor: "#7F77DD",
    },
    dayBtnText: {
        fontSize: 16,
        color: "#666",
    },
    dayBtnTextSelected: {
        color: "#3C3489",
        fontWeight: "500",
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 0.5,
        borderColor: "#ddd",
        backgroundColor: "#fafafa",
        alignItems: "center",
        justifyContent: "center",
    },
    checkboxChecked: {
        backgroundColor: "#534AB7",
        borderColor: "#534AB7",
    },
    checkMark: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    checkLabel: {
        fontSize: 16,
        color: "#444",
    },
    checkLabelChecked: {
        color: "#1a1a1a",
        fontWeight: "500",
    },
    ageBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 0.5,
        borderColor: "#ddd",
        backgroundColor: "#fafafa",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
    ageBtnSelected: {
        backgroundColor: "#534AB7",
        borderColor: "#7F77DD",
    },
    ageBtnText: {
        fontSize: 14,
        color: "#666",
    },
    ageBtnTextSelected: {
        color: "#3C3489",
        fontWeight: "500",
    },
    background: {
        backgroundColor: "#191970",
    },
    title: {
        color: "#ffffff",
        marginTop: 50,
        alignItems: 'center',
        fontSize: 30,
        fontWeight: 'bold',
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
    },
    input: {
        color: "#ffffff",
        width: 50,
        height: 40,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: "#ffffff",
        backgroundColor: "#1e90ff",
    }
});
