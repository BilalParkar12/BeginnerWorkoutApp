import { useEffect } from 'react';
import { Button, StyleSheet } from 'react-native';
import { supabase } from './supabase';

export default function TodayWorkout ({route, navigation}) {
    const {userId} = route.params;
    const {currentIndex} = route.params;
    const {session} = route.params;
    const exercises = session.exercises

    async function finishWorkout() {
        await supabase
            .from('Users')
            .update({CurrentIndex: currentIndex})
            .eq('user_id', userId);
        navigation.navigate("MainTabs", {userId: userId});
    }

    if (currentIndex >= exercises.length) {
        return (
            <Button style={styles.button} onPress={finishWorkout} title="Finish Workout"></Button>
        )
    }

    const currentExercise = exercises[currentIndex]

    useEffect(() => {
        async function findTopSet() {
            const {data, error} = await supabase
                .from("Top_sets")
                .select("top_set")
                .eq("exercise", currentExercise.exercise)
                .eq("user_id", userId);
            
            if (data && data.length > 0) {
                navigation.navigate("CompleteExercise", {session: session, userId, userId, current_index: currentIndex});
            } else {
                navigation.navigate("TopSetFinder", {session: session, userId, userId, current_index: currentIndex});
            }
        }
        findTopSet();
    }, []);

    return null;
};

const styles = StyleSheet.create({
    button: {
        color: "#00bfff",
    }
});