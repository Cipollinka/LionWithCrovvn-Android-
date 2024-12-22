import React from 'react';
import {View, StyleSheet} from 'react-native';

import {GameSubMode} from 'app/enums';
import Button from 'app/components/button';
import SafeView from 'app/components/safe-view';
import {goBack, navigate} from 'app/navigationRef';
import {useAppDispatch} from 'app/store/hooks';
import {setGameSubMode} from 'app/store/coreReducer';

const baseButtonHeight = 89;

const SubModeScreen: React.FC = () => {
  const dispatch = useAppDispatch();

  const redirectToGame = (subMode: GameSubMode) => {
    dispatch(setGameSubMode(subMode));
    navigate('Game');
  };

  return (
    <SafeView>
      <View style={styles.view}>
        <View style={styles.header} />

        <View style={styles.content}>
          <Button
            text="On Time"
            onPress={() => redirectToGame(GameSubMode.oneTime)}
            fontWeight="600"
            fontSize={40}
            height={89}
          />
          <Button
            text="Normal"
            fontWeight="600"
            fontSize={40}
            onPress={() => redirectToGame(GameSubMode.normal)}
            height={baseButtonHeight}
          />
        </View>

        <View style={styles.bottomAction}>
          <Button
            text="Back"
            fontSize={40}
            height={baseButtonHeight}
            fontWeight="600"
            onPress={() => goBack()}
          />
        </View>
      </View>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  content: {
    gap: 40,
    height: 200,
    marginTop: 10,
    marginBottom: 20,
  },
  view: {
    justifyContent: 'space-between',
    height: '100%',
  },
  image: {
    width: 'auto',
    height: 284,
  },
  bottomAction: {
    height: baseButtonHeight,
    marginBottom: 20,
  },
});

export default SubModeScreen;
