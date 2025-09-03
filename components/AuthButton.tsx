// Accessible authentication button with Google branding

import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    ActivityIndicator,
    AccessibilityInfo
} from 'react-native';

interface AuthButtonProps {
    title: string;
    onPress: () => void;
    variant: 'primary' | 'secondary';
    loading?: boolean;
    disabled?: boolean;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
    title,
    onPress,
    variant,
    loading = false,
    disabled = false
}) => {
    const isPrimary = variant === 'primary';

    const handlePress = async () => {
        if (!loading && !disabled) {
            // Provide haptic feedback for better UX
            const isScreenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();
            if (isScreenReaderEnabled) {
                AccessibilityInfo.announceForAccessibility(`${title} button pressed`);
            }
            onPress();
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                isPrimary ? styles.primaryButton : styles.secondaryButton,
                (disabled || loading) && styles.disabledButton
            ]}
            onPress={handlePress}
            disabled={disabled || loading}
            accessibilityRole="button"
            accessibilityLabel={title}
            accessibilityHint={isPrimary ? "Sign up for a new account" : "Sign in to existing account"}
            accessibilityState={{
                disabled: disabled || loading,
                busy: loading
            }}
        >
            <View style={styles.buttonContent}>
                {/* Google Logo */}
                <View style={styles.iconContainer}>
                    <Text style={styles.googleIcon}>G</Text>
                </View>

                {/* Button Text */}
                <Text style={[
                    styles.buttonText,
                    isPrimary ? styles.primaryText : styles.secondaryText,
                    (disabled || loading) && styles.disabledText
                ]}>
                    {loading ? 'Please wait...' : title}
                </Text>

                {/* Loading Spinner */}
                {loading && (
                    <ActivityIndicator
                        size="small"
                        color={isPrimary ? '#FFFFFF' : '#1E40AF'}
                        style={styles.spinner}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    primaryButton: {
        backgroundColor: '#1E40AF',
        borderWidth: 2,
        borderColor: '#1E40AF',
    },
    secondaryButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#E2E8F0',
    },
    disabledButton: {
        opacity: 0.6,
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    iconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    googleIcon: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4285F4',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
    },
    primaryText: {
        color: '#FFFFFF',
    },
    secondaryText: {
        color: '#1E40AF',
    },
    disabledText: {
        opacity: 0.7,
    },
    spinner: {
        marginLeft: 8,
    },
});