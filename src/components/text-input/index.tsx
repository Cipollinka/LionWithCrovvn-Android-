import React from 'react';
import {
  TextInput as TextInputRN,
  StyleSheet,
  Dimensions,
  TextInputProps,
  ImageBackground,
} from 'react-native';

const {width} = Dimensions.get('window');
const ratio = width <= 375 ? 1.3 : 1;

const TextInput: React.FC<TextInputProps> = props => {
  return (
    <ImageBackground
      style={styles.image}
      source={require('app/assets/images/btn_bg.png')}>
      <TextInputRN
        style={styles.input}
        {...props}
        cursorColor="#fff"
        selectionColor="#fff"
        textAlign="center"
        placeholderTextColor="#fff"
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 17,
    overflow: 'hidden',
  },
  input: {
    height: 76 / ratio,
    width: '100%',
    fontSize: 30 / ratio,
    color: '#fff',
    fontFamily: 'Bellota-Bold',
    paddingHorizontal: 20,
  },
});

export default TextInput;
