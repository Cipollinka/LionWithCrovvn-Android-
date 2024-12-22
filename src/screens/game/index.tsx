import React, {useState} from 'react';
import {View, StyleSheet, Alert, Dimensions} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useTimer} from 'react-timer-hook';
import {useFocusEffect} from '@react-navigation/native';
import {trigger} from 'react-native-haptic-feedback';

import Text from 'app/components/text';
import Button from 'app/components/button';
import {navigate} from 'app/navigationRef';
import {questions} from 'app/assets/quizData';
import SafeView from 'app/components/safe-view';
import {saveGlobalScore} from 'app/store/coreReducer';
import {useAppDispatch, useAppSelector} from 'app/store/hooks';
import {GameMode, GameSubMode, LIFE_COUNT} from 'app/enums';

const baseButtonHeight = 80;
const {width} = Dimensions.get('window');
const ratio = width <= 375 ? 1.5 : 1;

const time = new Date();
time.setSeconds(time.getSeconds() + 60);

const GameScreen: React.FC = () => {
  const dispatch = useAppDispatch();

  const [score, setScore] = useState(0);
  const [lifeCount, setLifeCount] = useState(LIFE_COUNT);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [pressedAnswer, setPressedAnswer] = useState<number | null>(null);

  const {gameSubMode, gameMode, settings} = useAppSelector(state => state.core);
  const isOneTimeMode =
    gameMode === GameMode.standart && gameSubMode === GameSubMode.oneTime;
  const activeData = questions[activeQuestion];

  const finishGame = () => {
    setTimeout(() => {
      Alert.alert('Game is over!', 'Your scored: ' + score, [
        {
          text: 'Ok',
          onPress: () => {
            dispatch(saveGlobalScore(score));
            setPressedAnswer(null);
            setScore(0);
            navigate('Home');
          },
        },
      ]);
    }, 700);
  };

  const {seconds, minutes, start, isRunning, pause, resume, restart} = useTimer(
    {
      expiryTimestamp: time,
      onExpire: () => {
        if (isOneTimeMode) {
          finishGame();
        }
      },
    },
  );

  useFocusEffect(
    React.useCallback(() => {
      if (isOneTimeMode) {
        const nextTime = new Date();
        nextTime.setSeconds(nextTime.getSeconds() + 60);
        restart(nextTime);
        start();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOneTimeMode]),
  );

  const showAnswerAndIncrementScore = () => {
    pause();
    Alert.alert('Correct Answer!', activeData.fact, [
      {
        text: 'Ok',
        onPress: () => {
          setPressedAnswer(null);
          setScore(score + 1);
          setActiveQuestion(activeQuestion + 1);
          resume();
        },
      },
    ]);
  };

  const answerQuestion = (answerIndex: number) => {
    if (isOneTimeMode && !isRunning) {
      return;
    }

    if (!isOneTimeMode && lifeCount <= 0) {
      return;
    }

    setPressedAnswer(answerIndex);
    trigger('impactLight', {
      enableVibrateFallback: settings?.vibro,
    });

    if (answerIndex === activeData.correctAnswerIndex) {
      showAnswerAndIncrementScore();

      if (answerIndex === questions.length - 1) {
        finishGame();
      }
    } else {
      const nextLifeCount = lifeCount - 1;

      if (nextLifeCount > 0) {
        setLifeCount(nextLifeCount);
      } else {
        setLifeCount(0);
        finishGame();
      }
    }
  };

  return (
    <SafeView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.view}>
        <View>
          <View style={styles.content}>
            {isOneTimeMode ? (
              <Button disabled text={`${minutes}:${seconds}`} ph={0} />
            ) : (
              <Button disabled text={`HP: ${lifeCount}`} ph={0} />
            )}
            <Button
              disabled
              text={`${activeQuestion + 1}/${questions.length}`}
              ph={0}
            />
            <Button disabled text={`Score: ${score || 0}`} ph={0} />
          </View>

          <View style={styles.block}>
            <Text style={styles.text} fontSize={36} fontWeight="600">
              {activeData?.question}
            </Text>
          </View>

          <View style={styles.actions}>
            {activeData?.answers?.map((answer, index) => (
              <Button
                key={index}
                text={answer}
                height={80}
                disabled={isOneTimeMode ? !isRunning : lifeCount <= 0}
                mode={
                  pressedAnswer === index
                    ? pressedAnswer === activeData.correctAnswerIndex
                      ? 'success'
                      : 'error'
                    : 'default'
                }
                onPress={() => answerQuestion(index)}
              />
            ))}
          </View>
        </View>

        <View style={styles.bottomAction}>
          <Button
            text="Menu"
            fontSize={40}
            height={baseButtonHeight}
            fontWeight="600"
            onPress={() => navigate('Home')}
          />
        </View>
      </ScrollView>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  view: {
    height: '100%',
  },
  content: {
    gap: 12,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  actions: {
    gap: 12,
    height: 270,
  },
  text: {
    textAlign: 'center',
  },
  block: {
    height: 270 / ratio,
    backgroundColor: '#594F31',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 34,
  },
  bottomAction: {
    height: baseButtonHeight,
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
});

export default GameScreen;
