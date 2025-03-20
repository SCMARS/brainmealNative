import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    ViewStyle
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

// Abstract food-related shapes for background animation
const FoodShape = ({ style }: { style: ViewStyle }) => {
    const animation = new Animated.Value(0);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true
                }),
                Animated.timing(animation, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: true
                })
            ])
        ).start();
    }, []);

    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 10]
    });

    return (
        <Animated.View
            style={[
                styles.shape,
                style,
                {
                    transform: [{ translateY }]
                }
            ]}
        />
    );
};

export default function Index() {
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true
        }).start();
    }, []);

    const handleLogin = () => {
        router.push({ pathname: 'login' });
    };

    const handleRegister = () => {
        router.push({ pathname: 'register' });
    };

    return (
        <View style={styles.container}>
            {/* Animated Background Shapes */}
            <FoodShape style={{ top: '10%', left: '15%', width: 60, height: 60, borderRadius: 30 }} />
            <FoodShape style={{ top: '30%', right: '10%', width: 80, height: 80, borderRadius: 20, transform: [{ rotate: '45deg' }] }} />
            <FoodShape style={{ bottom: '20%', left: '20%', width: 70, height: 70, borderRadius: 8, transform: [{ rotate: '30deg' }] }} />

            {/* Content Container */}
            <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
                {/* Logo Circle */}
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>BM</Text>
                </View>

                {/* App Title and Slogan */}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>brainmeal</Text>
                    <Text style={styles.slogan}>Fuel Your Mind with Smart Nutrition</Text>
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleLogin}>
                        <LinearGradient
                            colors={['#FF6B00', '#FF8E3C']}
                            style={styles.button}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.buttonText}>Login</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleRegister}>
                        <LinearGradient
                            colors={['rgba(255,107,0,0.2)', 'rgba(255,142,60,0.2)']}
                            style={[styles.button, styles.registerButton]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={[styles.buttonText, styles.registerText]}>Register</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        position: 'relative',
        overflow: 'hidden'
    },
    shape: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 107, 0, 0.15)',
        zIndex: 1
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        paddingHorizontal: 30
    },
    logoContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FF6B00',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        shadowColor: '#FF6B00',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10
    },
    logoText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white'
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 60
    },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        letterSpacing: 1
    },
    slogan: {
        fontSize: 16,
        color: '#FFFFFF99',
        textAlign: 'center',
        letterSpacing: 0.5
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 320
    },
    button: {
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#FF6B00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5
    },
    registerButton: {
        borderWidth: 1,
        borderColor: '#FF6B00',
        backgroundColor: 'transparent'
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5
    },
    registerText: {
        color: '#FF6B00'
    }
});
