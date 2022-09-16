import React, { FC, useRef, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
	Image,
	Alert,
	Button,
	Platform,
	ActivityIndicator,
	TextInput,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { NavigatorParamList } from '../navigators/navigator';
import ImagePicker from 'react-native-image-crop-picker';
import { useLinkProps } from '@react-navigation/native';
import MyImagePicker from '../components/common/imagePicker';
import storage from '@react-native-firebase/storage';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';

interface ISheet {
	close: () => void;
	open: () => void;
}

export const UploadImageScreen: FC<
	StackScreenProps<NavigatorParamList, 'uploadImage'>
> = () => {
	const [image, setImage] = useState<string>();
	const [uploading, setUploading] = useState<boolean>(false);
	const [transferred, setTransferred] = useState<number>(0);
	const [post, setPost] = useState(null);

	const takePhotoFromCamera = () => {
		ImagePicker.openCamera({
			width: 300,
			height: 300,
			cropping: true,
		}).then((image) => {
			console.log('image:: ', image);
			const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
			if (imageUri) {
				setImage(imageUri);
			} else {
				console.log('error:: imgUri is not exist');
			}
		});
	};

	const choosePhotoFromLibrary = () => {
		ImagePicker.openPicker({
			width: 300,
			height: 300,
			cropping: true,
		}).then((image) => {
			console.log('image:: ', image);
			const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
			setImage(imageUri);
		});
	};

	// const submitPost = async () => {
	// 	if (!image) return;
	// 	const uploadUri = image;
	// 	let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

	// 	setUploading(true);

	// 	try {
	// 		await storage().ref(filename).putFile(uploadUri);
	// 		setUploading(false);
	// 		Alert.alert(
	// 			'Image uploaded!',
	// 			'Your image has been uploaded to the Firebase Cloud Stroage Successfully!'
	// 		);
	// 	} catch (e) {
	// 		console.log('e:: ', e);
	// 	}

	// 	setImage(undefined);
	// };

	// const submitPost = async () => {
	// 	const imageUrl = await uploadImage();
	// 	console.log('Image Url: ', imageUrl);
	// 	console.log('Post: ', post);

	// 	firestore()
	// 		.collection('posts')
	// 		.add({
	// 			userId: 'user',
	// 			post: post,
	// 			postImg: imageUrl,
	// 			postTime: firestore.Timestamp.fromDate(new Date()),
	// 			likes: null,
	// 			comments: null,
	// 		})
	// 		.then(() => {
	// 			console.log('Post Added!');
	// 			Alert.alert(
	// 				'Post published!',
	// 				'Your post has been published Successfully!'
	// 			);
	// 			setPost(null);
	// 		})
	// 		.catch((error) => {
	// 			console.log(
	// 				'Something went wrong with added post to firestore.',
	// 				error
	// 			);
	// 		});
	// };

	// const uploadImage = async () => {
	// 	if (image == null) {
	// 		return null;
	// 	}
	// 	const uploadUri = image;
	// 	let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

	// 	// Add timestamp to File Name
	// 	const extension = filename.split('.').pop();
	// 	const name = filename.split('.').slice(0, -1).join('.');
	// 	filename = name + Date.now() + '.' + extension;

	// 	setUploading(true);
	// 	setTransferred(0);

	// 	const storageRef = storage().ref(`photos/${filename}`);
	// 	const task = storageRef.putFile(uploadUri);

	// 	// Set transferred state
	// 	task.on('state_changed', (taskSnapshot) => {
	// 		console.log(
	// 			`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
	// 		);

	// 		setTransferred(
	// 			Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
	// 				100
	// 		);
	// 	});

	// 	try {
	// 		await task;

	// 		const url = await storageRef.getDownloadURL();

	// 		setUploading(false);
	// 		setImage(undefined);

	// 		// Alert.alert(
	// 		//   'Image uploaded!',
	// 		//   'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
	// 		// );
	// 		return url;
	// 	} catch (e) {
	// 		console.log(e);
	// 		return null;
	// 	}
	// };

	return (
		<View style={styles.container}>
			<View style={styles.inputWrapper}>
				{image != null ? (
					<Image
						style={{ width: '100%', height: 250, marginBottom: 15 }}
						source={{ uri: image }}
					/>
				) : null}

				<TextInput
					placeholder="What's on your mind?"
					multiline
					numberOfLines={4}
					// value={post}
					onChangeText={(content: any) => setPost(content)}
					style={styles.InputField}
				/>
				{uploading ? (
					<View style={{ justifyContent: 'center', alignItems: 'center' }}>
						<Text>{transferred} % Completed!</Text>
						<ActivityIndicator size="large" color="#0000ff" />
					</View>
				) : // <SubmitBtn onPress={submitPost}>
				// 	<SubmitBtnText>Post</SubmitBtnText>
				// </SubmitBtn>
				null}
			</View>
			<ActionButton buttonColor="#2e64e5" buttonTextStyle={{ fontSize: 15 }}>
				<ActionButton.Item
					buttonColor="#9b59b6"
					title="Take Photo"
					onPress={takePhotoFromCamera}
				>
					<Icon name="camera-outline" style={styles.actionButtonIcon} />
				</ActionButton.Item>
				<ActionButton.Item
					buttonColor="#3498db"
					title="Choose Photo"
					onPress={choosePhotoFromLibrary}
				>
					<Icon name="md-images-outline" style={styles.actionButtonIcon} />
				</ActionButton.Item>
			</ActionButton>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},

	image_picker: {
		width: 180,
		height: 180,
		borderRadius: 90,
	},
	container_images: {
		alignItems: 'center',
		marginTop: '1%',
	},
	actionButtonIcon: {
		fontSize: 20,
		height: 22,
		color: 'white',
	},
	inputWrapper: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		backgroundColor: '#2e64e515',
	},
	InputField: {
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 24,
		textAlign: 'center',
		width: '90%',
		marginBottom: 15,
	},
});
