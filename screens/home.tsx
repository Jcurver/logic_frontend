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
			<Text>asdfsadfasdf</Text>
			<TouchableOpacity onPress={() => navigate('uploadImage')}>
				<Text>hi</Text>
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
