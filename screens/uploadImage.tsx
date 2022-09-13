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


export const UploadImageScreen: FC<
	StackScreenProps<NavigatorParamList, 'uploadImage'>
> = () => {
	const open = () => {
		ImagePicker.openCamera({
			width: 300,
			height: 300,
			cropping: true,
		})
			.then((image) => {
				console.log('image::', image);
			})
			.catch((err) => console.log('err:: ', err));
	};
	return (
		<View style={S.screen}>
			<TouchableOpacity onPress={() => open()}>
			</TouchableOpacity>
				<Board line={20} />
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
