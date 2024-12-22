import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import Text, {FontWeight} from '../text';

interface IProps {
  text?: string;
  fontSize?: number;
  fontWeight?: FontWeight;
  height?: number;
  ph?: number;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  mode?: 'success' | 'error' | 'default';
}

const BUTTON_MODES = {
  error: require('app/assets/images/error_bg.png'),
  default: require('app/assets/images/btn_bg.png'),
  success: require('app/assets/images/success_bg.png'),
};

const {width} = Dimensions.get('window');
const ratio = width <= 375 ? 1.3 : 1;

const Button: React.FC<IProps> = ({
  ph = 15,
  height = 50,
  fontSize = 24,
  text,
  style,
  fontWeight,
  onPress,
  disabled,
  mode = 'default',
}) => {
  const handlePress = () => {
    onPress?.();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      disabled={disabled}
      style={[styles.container, {height: height / ratio}, style]}>
      <ImageBackground style={styles.image} source={BUTTON_MODES[mode]}>
        <View style={styles.textContainer}>
          <Text
            fontWeight={fontWeight}
            style={[styles.text, {paddingHorizontal: ph}]}
            fontSize={fontSize}>
            {text}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 17,
    overflow: 'hidden',
  },
  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  text: {
    flex: 1,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Button;
