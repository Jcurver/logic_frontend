import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { NavigatorParamList } from '../navigators/navigator';

export const UploadImageScreen: FC<
	StackScreenProps<NavigatorParamList, 'uploadImage'>
> = () => {
	return (
		<View style={S.screen}>
			<Text></Text>
		</View>
	);
};

const S = StyleSheet.create({
	screen: {
		flex: 1,
	},
});
