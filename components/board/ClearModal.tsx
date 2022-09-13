import React, { Dispatch, SetStateAction } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
interface IClearModal {
	isVisible: boolean;
	setDeleteModalVisible: Dispatch<SetStateAction<boolean>>;
	clearBoard: () => void;
}

export const ClearModal = ({
	isVisible,
	setDeleteModalVisible,
	clearBoard,
}: IClearModal) => {
	return (
		<Modal
			isVisible={isVisible}
			useNativeDriver={true}
			hideModalContentWhileAnimating={true}
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<View
				style={{
					backgroundColor: 'white',
					// width: 200,
					// height: 100,
					justifyContent: 'center',
					alignItems: 'center',
					borderRadius: 20,
					padding: 20,
				}}
			>
				<Text>정말로 삭제하시겠어요?</Text>
				<Text>삭제 후에는 되돌릴 수 없어요!</Text>
				<View style={{ flexDirection: 'row' }}>
					<TouchableOpacity
						style={S.deleteModalButton}
						onPress={() => setDeleteModalVisible(false)}
					>
						<Text>아니오</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={S.deleteModalButton}
						onPress={() => clearBoard()}
					>
						<Text>네</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};

const S = StyleSheet.create({
	screen: {
		flex: 1,
	},
	board: { backgroundColor: 'orange' },
	changeButton: {
		// flex:1 ,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	deleteModalButton: {
		paddingHorizontal: 10,
		paddingVertical: 10,
		borderWidth: 1,
		borderRadius: 10,
		marginHorizontal: 5,
		marginTop: 10,
	},
});
