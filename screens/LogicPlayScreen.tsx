import React, { FC } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { NavigatorParamList } from '../navigators/navigator';
import ImagePicker from 'react-native-image-crop-picker';
import { useLinkProps } from '@react-navigation/native';
import { Board } from '../components';

export const LogicPlayScreen: FC<
	StackScreenProps<NavigatorParamList, 'logicPlay'>
> = () => {
	return (
		<View style={S.screen}>
			<Board line={10} />
		</View>
	);
};

const S = StyleSheet.create({
	screen: {
		flex: 1,
		// justifyContent: 'center',
		alignItems: 'center',
	},
	board: {
		backgroundColor: 'red',
	},
});
