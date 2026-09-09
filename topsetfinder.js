import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import RestTimer from "./resttimer";
import { supabase } from './supabase';

export default function TopSetFinder({route, navigation}) {
    const {session} = route.params;
    const {userId} = route.params; 
    const {current_index} = route.params;
    const exercises = session.exercises
    const current_exercise = exercises[current_index]

    const currentExercise = current_exercise.exercise
    const formText = current_exercise.form

    const [topSet,  setTopSet] = useState("");
    const [reps, setReps] = useState(0);
    const [topSetFound, setTopSetFound] = useState(false);
    const [resting, setResting] = useState(false);

    function logReps(weight) {
        setResting(true);
        if (reps > current_exercise.max_reps) {
            setTopSet(Number(weight) + current_exercise.jump);
            setReps("");
        } else if (reps < current_exercise.min_reps) {
            setTopSet(Number(weight) - current_exercise.jump/2);
            setReps("");
        } else {
            setTopSetFound(true);
        }
    }

    useEffect(() => {
        async function findWeight(){
            const {data, error} = await supabase
                .from("Top_sets")
                .select("top_set")
                .eq("exercise", currentExercise)
                .eq("user_id", userId);
            if (data && data.length > 0) {
                setTopSet(data[0].top_set)
            } else {
                const { data, error } = await supabase
                    .from('Starting_weights')
                    .select('starting_weight')
                    .eq('exercise', currentExercise);
                setTopSet(data[0].starting_weight)
            }
        }
        findWeight();
    }, []);

    useEffect(() => {
        if (topSetFound) {
            async function saveTopSet() {
                const {data, error} = await supabase
                    .from("Top_sets")
                    .insert({
                        exercise: currentExercise,
                        top_set: Number(topSet),
                        reps: Number(reps),
                        user_id: userId,
                    });
                if (error) {
                    Alert.alert(error.message);
                }
            }
            saveTopSet();
        }
    }, [topSetFound]);

    if (topSetFound) {
        return (
            <View style={styles.centered}>
                <Text>Top set: {topSet}kg</Text>
                <Button style={styles.button} onPress={() => navigation.navigate("TodayWorkout", {session: session, userId: userId, currentIndex: current_index+1})} title="Next exercise"></Button>
            </View>
        );
    }

    if (resting) {
        return (
            <ScrollView>
                <RestTimer
                    seconds={120}
                    onFinish={() => setResting(false)}
                />
                <Button
                    style={styles.button}
                    onPress={() => setResting(false)}
                    title="Skip rest"
                />
            </ScrollView>
        );
    }

    return (
        <ScrollView style={styles.background}>
            <Text style={styles.text}>Do as many reps as you can on {topSet}kg.</Text>
            <Text style={styles.text}>If you reach 15 reps, stop.{'\n'}</Text>

            <Text style={styles.title}>{currentExercise}</Text>

            <ScrollView>
                {formText.map((form_sentence, index) => (
                    <View key={index}>
                        <Text style={styles.text}>{index+1}. {form_sentence}</Text>
                    </View>
                ))}
            </ScrollView><Text>{'\n'}</Text>

            <Text style={styles.text}>How many reps did you do?</Text>
            <TextInput
                placeholder="0"
                keyboardType="numeric"
                style={styles.input}
                value={reps}
                onChangeText={setReps}
            />

            <Button
                style={styles.button}
                title="Done"
                onPress={() => logReps(topSet)}
            />
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
        fontSize: 30,
        fontWeight: 'bold'
    },
    text: {
        color: "#ffffff",
        fontSize: 20,
    },
    button: {
        color: "#00bfff",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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