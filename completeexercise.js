import { useEffect, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, TextInput, View, } from "react-native";
import RestTimer from "./resttimer";
import { supabase } from './supabase';

export default function CompleteExercise({route, navigation}) {
    const {session} = route.params;
    const {userId} = route.params; 
    const {current_index} = route.params;
    const exercises = session.exercises
    const current_exercise = exercises[current_index]
    const warmUpSets = current_exercise.warm_ups
    const numOfTopSets = current_exercise.top_sets
    const currentExercise = current_exercise.exercise
    const formText = current_exercise.form

    const [warmUpIndex, setWarmUpIndex] = useState(0);
    const [topSetIndex, setTopSetIndex] = useState(0);
    const [topSet,  setTopSet] = useState("");
    const [reps, setReps] = useState("");
    const [repsCompleted, setRepsCompleted] = useState("");
    const [resting, setResting] = useState(false);

    function logReps() {
        const repsNum = parseInt(repsCompleted);
        setResting(true);
        setRepsCompleted(repsNum);
        setTopSetIndex(topSetIndex+1);
    }

    useEffect(() => {
        async function findWeight(){
            const {data, error} = await supabase
                .from("Top_sets")
                .select("top_set, reps")
                .eq("exercise", currentExercise)
                .eq("user_id", userId);
            if (data[0].reps >= current_exercise.max_reps) {
                setTopSet(data[0].top_set + current_exercise.jump)
                setReps(current_exercise.min_reps)
            } else {
                setTopSet(data[0].top_set)
                setReps(data[0].reps + 1)
            }
        }
        findWeight();
    }, []);

    useEffect(() => {
        async function saveTopSet() {
            await supabase
                .from("Top_sets")
                .update({
                    top_set: Number(topSet),
                    reps: Number(repsCompleted),
                })
                .eq("user_id", userId)
                .eq("exercise", currentExercise);
        }
        saveTopSet();
    }, []);

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

    if (warmUpIndex < warmUpSets.length) {
        let warmUpWeight;
        if (warmUpSets[warmUpIndex][0] === 20) {
            warmUpWeight = 20;
        } else {
            warmUpWeight = warmUpSets[warmUpIndex][0] * topSet;
        }
        return (
            <ScrollView style={styles.background}>
                <Text style={styles.title}>Warm Up Set {warmUpIndex+1}</Text>
                <Text style={styles.title}>{currentExercise}</Text>
                <Text style={styles.text}>Complete {warmUpSets[warmUpIndex][1]} reps on {warmUpWeight}kg</Text>
                <ScrollView>
                    {formText.map((form_sentence, index) => (
                        <View key={index}>
                            <Text style={styles.text}>{index+1}. {form_sentence}</Text>
                        </View>
                    ))}
                </ScrollView><Text>{'\n'}</Text>
                <Button
                    style={styles.button}
                    title="Done"
                    onPress={() => setWarmUpIndex(warmUpIndex+1)}
                />
            </ScrollView>
        )
    }

    if (topSetIndex < numOfTopSets) {
        return (
            <ScrollView style={styles.background}>
                <Text style={styles.text}>Do at least {reps} reps on {topSet}kg.</Text>

                <Text style={styles.title}>{currentExercise}</Text>

                <ScrollView>
                    {formText.map((form_sentence, index) => (
                        <View key={index}>
                            <Text style={styles.text}>{index+1}. {form_sentence}</Text>
                        </View>
                    ))}
                </ScrollView>

                <Text style={styles.text}>How many reps did you do?</Text>
                <TextInput
                    placeholder="0"
                    keyboardType="numeric"
                    style={styles.input}
                    value={repsCompleted}
                    onChangeText={setRepsCompleted}
                />

                <Button
                    style={styles.button}
                    title="Done"
                    onPress={() => logReps()}
                />
            </ScrollView>
        )
    }

    return (
        <View style={styles.centered}>
            <Text>Top set: {topSet}kg</Text>
            <Button style={styles.button} onPress={() => navigation.navigate("TodayWorkout", {session: session, userId: userId, currentIndex: current_index+1})} title="Next exercise"></Button>
        </View>
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