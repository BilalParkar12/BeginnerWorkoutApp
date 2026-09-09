import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from './supabase';

export default function StartWorkout({route, navigation}) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const day = new Date();
    let today = days[day.getDay()];
    const {userId} = route.params;
    const [plan, setPlan] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        async function resetCurrentIndex() {
            setCurrentIndex(0);
        }
        resetCurrentIndex();
    }, []);

    useEffect(() => {
        async function fetchPlan() {
            const {data, error} = await supabase
                .from('Users')
                .select('Plan, CurrentIndex, WorkoutDate')
                .eq('user_id', userId)
                .single();

            if (data.WorkoutDate !== today) {
                setCurrentIndex(0);
                await supabase
                    .from('Users')
                    .update({ CurrentIndex: 0, WorkoutDate: today })
                    .eq('user_id', userId);
            } else {
                setCurrentIndex(data.CurrentIndex)
            }
            setPlan(data.Plan)
        }
        fetchPlan();
    }, []);

    if (!plan) {
        return (
            <SafeAreaProvider>
                <SafeAreaView>
                    <ActivityIndicator size="large" />
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    const sessions = plan.sessions
    const todaySession = sessions.find((session) => session.day === today)

    if (!todaySession) {
        return (
            <ScrollView style={styles.background}>
                <Text style={styles.title}>Rest day!</Text>
            </ScrollView>
        )
    }

    const exercises = todaySession.exercises

    if (currentIndex >= exercises.length) {
        return (
            <ScrollView style={styles.background}>
                <Text style={styles.title}>Workout Finished!</Text>
            </ScrollView>
        )
    }

    return (
        <Button style={styles.button} onPress={() => navigation.navigate("TodayWorkout", {userId: userId, session: todaySession, currentIndex: 0})} title="Start Workout"></Button>
    )
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
    button: {
        color: "#00bfff",
    }
});