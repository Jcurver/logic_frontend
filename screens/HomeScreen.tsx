import React, { FC } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { NavigatorParamList } from '../navigators/navigator';
import { useNavigation } from '@react-navigation/native';

export const HomeScreen: FC<StackScreenProps<NavigatorParamList, 'home'>> = ({
	navigation: { navigate },
}) => {
	return (
		<View style={S.screen}>
			<Text style={{ fontSize: 30 }}>Home</Text>
			<TouchableOpacity onPress={() => navigate('logicPlay')}>
				<Text style={{ fontSize: 30 }}>logic Play</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => navigate('uploadImage')}>
				<Text style={{ fontSize: 30 }}>upload Image</Text>
			</TouchableOpacity>
		</View>
	);
};

const S = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
