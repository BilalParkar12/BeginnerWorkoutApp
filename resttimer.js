import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function RestTimer({ seconds = 120, onFinish }) {

    const [timeLeft, setTimeLeft] = useState(seconds);

    useEffect(() => {
        if (timeLeft <= 0) {
            onFinish();
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);

    }, [timeLeft]);

    function formatTime(secs) {
        const minutes = Math.floor(secs / 60);
        const seconds = secs % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Rest</Text>
            <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
            <Text style={styles.text}>Next set coming up</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        padding: 24,
    },
    label: {
        fontSize: 13,
        color: "#666",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 16,
    },
    timer: {
        fontSize: 80,
        fontWeight: "300",
        marginBottom: 12,
    },
    text: {
        fontSize: 15,
        color: "#aaa",
        marginBottom: 40,
    },
});