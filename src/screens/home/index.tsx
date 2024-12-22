import React from 'react';
import {View, Linking, StyleSheet, Dimensions} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';

import {Theme} from 'app/enums';
import Button from 'app/components/button';
import SafeView from 'app/components/safe-view';
import {navigate} from 'app/navigationRef';
import {changeTheme} from 'app/store/coreReducer';
import {useAppDispatch, useAppSelector} from 'app/store/hooks';

const link = 'itms-apps://apps.apple.com/id/app/halojasa/id1492671277?l=id';
const {width} = Dimensions.get('window');
const ratio = width <= 375 ? 1.2 : 1;

const HomeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const {theme} = useAppSelector(state => state.core);

  const openAppStore = () => {
    Linking.canOpenURL(link).then(
      supported => {
        supported && Linking.openURL(link);
      },
      err => console.log(err),
    );
  };

  return (
    <SafeView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Button
            fontSize={20}
            text={theme === Theme.dark ? 'Light Mode' : 'Night Mode'}
            ph={0}
            onPress={() =>
              dispatch(
                changeTheme(theme === Theme.dark ? Theme.light : Theme.dark),
              )
            }
          />
          <Button
            text="Settings"
            fontSize={20}
            ph={0}
            onPress={() => navigate('Settings')}
          />
        </View>

        <FastImage
          source={require('app/assets/images/lion.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.content}>
          <Button
            text="QUIZ"
            fontSize={40}
            height={94}
            onPress={() => navigate('Mode')}
          />
        </View>

        <View style={styles.content}>
          <Button
            text="Encyclopaedia"
            height={250}
            onPress={() => navigate('Encyclopaedia')}
          />
          <Button text="Map" height={250} onPress={() => navigate('Map')} />
        </View>
      </ScrollView>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: 12,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 'auto',
    height: 284 / ratio,
  },
});

export default HomeScreen;
