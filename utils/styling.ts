import {Dimensions , PixelRatio} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const [shortDimensions, longDimensions] =
    SCREEN_WIDTH < SCREEN_HEIGHT
    ? [SCREEN_WIDTH, SCREEN_HEIGHT]
    : [SCREEN_HEIGHT, SCREEN_WIDTH];

const guidelineBaseWidth = 350;
const guidelineBaseHeight = 812;

export const scale = (size: number) => 
    Math.round(
        PixelRatio.roundToNearestPixel(
            (shortDimensions / guidelineBaseWidth) * (size as number)
        )
    );

export const verticalScale = (size: number) =>
    Math.round(
        PixelRatio.roundToNearestPixel(
            (longDimensions / guidelineBaseHeight) * (size as number)
        )
    );
