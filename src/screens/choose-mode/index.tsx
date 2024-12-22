import React from 'react';
import {View, Alert, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import {GameMode} from 'app/enums';
import Text from 'app/components/text';
import Button from 'app/components/button';
import SafeView from 'app/components/safe-view';
import {goBack, navigate} from 'app/navigationRef';
import {setGameMode} from 'app/store/coreReducer';
import {useAppDispatch, useAppSelector} from 'app/store/hooks';

const baseButtonHeight = 89;

const ChooseModeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const {globalScore} = useAppSelector(state => state.core);

  const showScoreboard = () => {
    Alert.alert('Scoreboard', 'Your scored: ' + (globalScore || 0));
  };

  return (
    <SafeView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.view}>
        <View style={styles.header}>
          <Text fontSize={64} fontWeight="600">
            QUIZ
          </Text>
        </View>

        <View style={styles.content}>
          <Button
            text="Standart"
            onPress={() => {
              dispatch(setGameMode(GameMode.standart));
              navigate('SubMode');
            }}
            fontWeight="600"
            fontSize={40}
            height={89}
          />
          <Button
            text="Compliance"
            fontWeight="600"
            fontSize={40}
            height={baseButtonHeight}
            onPress={() => {
              dispatch(setGameMode(GameMode.compliance));
              navigate('Compliance');
            }}
          />

          <View style={styles.action}>
            <Button
              text="Scoreboard"
              fontWeight="600"
              fontSize={40}
              height={65}
              style={styles.scoreboard}
              onPress={showScoreboard}
            />
          </View>
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
      </ScrollView>
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
    height: 350,
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
  action: {
    flex: 1,
    alignItems: 'center',
  },
  scoreboard: {
    minWidth: 249,
    maxHeight: 65,
  },
  bottomAction: {
    height: baseButtonHeight,
    marginBottom: 20,
  },
});

export default ChooseModeScreen;
