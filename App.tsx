import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
	SafeAreaProvider,
	initialWindowMetrics,
} from 'react-native-safe-area-context';
import * as storage from './utils/storage';
import { useNavigationPersistence } from './navigators/navigation-utilities';
import { AppNavigator } from './navigators/navigator';
// import { LogBox } from 'react-native';
// LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
// LogBox.ignoreAllLogs(); //Ignore all log notifications

export default function App() {
	return (
		<SafeAreaProvider initialMetrics={initialWindowMetrics}>

				<AppNavigator />

		</SafeAreaProvider>
	);
}
