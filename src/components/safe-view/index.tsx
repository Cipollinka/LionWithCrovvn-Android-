import React, {PropsWithChildren} from 'react';
import {SafeAreaView, View, StyleSheet, ImageBackground} from 'react-native';

import {Theme} from 'app/enums';
import {useAppSelector} from 'app/store/hooks';

import bgDark from 'app/assets/images/bg_dark.png';
import bgWhite from 'app/assets/images/bg_white.png';

interface IProps {
  ph?: number;
}

const SafeView: React.FC<PropsWithChildren<IProps>> = ({
  children,
  ph = 16,
  ...props
}) => {
  const {theme} = useAppSelector(state => state.core);
  const image = theme === Theme.dark ? bgDark : bgWhite;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={image}
        resizeMode="cover"
        style={[styles.image, {paddingHorizontal: ph}]}>
        <SafeAreaView {...props}>{children}</SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
});

export default SafeView;
