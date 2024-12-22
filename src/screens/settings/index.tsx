import React from 'react';
import {View, Switch, Dimensions, StyleSheet} from 'react-native';
import Slider from '@react-native-community/slider';
import {ScrollView} from 'react-native-gesture-handler';

import Text from 'app/components/text';
import Button from 'app/components/button';
import {goBack} from 'app/navigationRef';
import SafeView from 'app/components/safe-view';
import {changeSettings} from 'app/store/coreReducer';
import {useAppDispatch, useAppSelector} from 'app/store/hooks';

const {width} = Dimensions.get('window');
const ratio = width <= 375 ? 1.5 : 1;

const SettingsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const {settings} = useAppSelector(state => state.core);

  return (
    <SafeView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.view}>
        <View>
          <View style={styles.header}>
            <Text fontSize={64} fontWeight="600">
              Settings
            </Text>
          </View>
          <View style={styles.textBlock}>
            <Text fontSize={43} fontWeight="600">
              SOUND
            </Text>
          </View>

          <View style={styles.block}>
            <Slider
              value={settings?.sound}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#434343"
              onValueChange={value => {
                dispatch(
                  changeSettings({
                    sound: value,
                  }),
                );
              }}
            />
          </View>

          <View style={styles.textBlock}>
            <Text fontSize={43} fontWeight="600">
              VIBRO
            </Text>
          </View>
          <View style={[styles.textBlock, styles.block]}>
            <Switch
              trackColor={{false: '#434343', true: '#BAAE8A'}}
              thumbColor="#fff"
              style={styles.switch}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                dispatch(
                  changeSettings({
                    vibro: !settings?.vibro,
                  }),
                );
              }}
              value={!!settings?.vibro}
            />
          </View>
        </View>

        <View style={styles.bottomAction}>
          <Button
            text="Back"
            fontSize={40}
            height={89}
            fontWeight="600"
            onPress={() => goBack()}
          />
        </View>
      </ScrollView>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  view: {
    justifyContent: 'space-between',
    height: '100%',
  },
  switch: {
    marginTop: 20,
    transform: [{scaleX: 1.4}, {scaleY: 1.4}],
  },
  header: {
    alignItems: 'center',
    marginBottom: 100 / ratio,
  },
  textBlock: {
    alignItems: 'center',
  },
  block: {
    marginBottom: 40,
  },
  bottomAction: {
    height: 89,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginBottom: 20,
  },
});

export default SettingsScreen;
