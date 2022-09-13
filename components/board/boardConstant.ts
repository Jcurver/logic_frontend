import { useHeaderHeight } from '@react-navigation/elements';
import { Dimensions } from 'react-native';

export const windowWidth = Dimensions.get('window').width;
export const touchableBoardWidth = (windowWidth * 3) / 4;
const headerHeight = useHeaderHeight();
export const boardStartYpx = windowWidth / 4 + headerHeight;
export const boardStartXpx = windowWidth / 4;
export let BoardTargetedX = 0;
export let BoardTargetedY = 0;
