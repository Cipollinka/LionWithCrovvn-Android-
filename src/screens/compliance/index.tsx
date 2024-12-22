import React, {useState} from 'react';
import {View, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import {trigger} from 'react-native-haptic-feedback';
// @ts-ignore
import shuffle from 'lodash.shuffle';

import {chunk} from 'app/utils';
import {LIFE_COUNT} from 'app/enums';
import Button from 'app/components/button';
import {navigate} from 'app/navigationRef';
import {useAppDispatch, useAppSelector} from 'app/store/hooks';
import SafeView from 'app/components/safe-view';
import {saveGlobalScore} from 'app/store/coreReducer';
import {animalsPhotos, encyclopaedia} from 'app/assets/quizData';

const chunkSize = 5;
const data = chunk(
  encyclopaedia.map(item => item.title),
  chunkSize,
);
const animalNames: string[] = data.map(item => shuffle(item)) as any[];

const time = new Date();
time.setSeconds(time.getSeconds() + 60);

const ComplianceScreen: React.FC = () => {
  const dispatch = useAppDispatch();

  const {settings} = useAppSelector(state => state.core);

  const [score, setScore] = useState(0);
  const [lifeCount, setLifeCount] = useState(LIFE_COUNT);
  const [activeScreen, setActiveScreen] = useState(0);
  const [leftColumnName, setLeftColumnName] = useState('');
  const [rightColumnName, setRightColumnName] = useState('');
  const [successAnimals, setSuccessAnimals] = useState<string[]>([]);

  const finishGame = () => {
    setTimeout(() => {
      Alert.alert('Game is over!', 'Your scored: ' + score, [
        {
          text: 'Ok',
          onPress: () => {
            dispatch(saveGlobalScore(score));
            setScore(0);
            setActiveScreen(0);
            navigate('Home');
          },
        },
      ]);
    }, 600);
  };

  const checkForActiveScreen = (nextScore: number) => {
    if (nextScore === encyclopaedia.length) {
      finishGame();
      return;
    }

    if (nextScore >= (activeScreen + 1) * chunkSize) {
      setActiveScreen(activeScreen + 1);
    }
  };

  const wrongAnswer = () => {
    const nextLifeCount = lifeCount - 1;

    trigger('impactLight', {
      enableVibrateFallback: settings?.vibro,
    });

    if (nextLifeCount > 0) {
      setLifeCount(nextLifeCount);
    } else {
      setLifeCount(0);
      finishGame();
    }
  };

  const onLeftColumnPress = (name: string) => {
    if (name === rightColumnName) {
      setSuccessAnimals([...successAnimals, name]);
      setLeftColumnName('');
      setRightColumnName('');
      setScore(score + 1);
      checkForActiveScreen(score + 1);
      trigger('impactLight', {
        enableVibrateFallback: settings?.vibro,
      });
    } else {
      if (rightColumnName) {
        wrongAnswer();
        setLeftColumnName('');
        setRightColumnName('');
      } else {
        setLeftColumnName(name);
        setRightColumnName('');
      }
    }
  };

  const onRightColumnPress = (name: string) => {
    if (name === leftColumnName) {
      setSuccessAnimals([...successAnimals, name]);
      setLeftColumnName('');
      setRightColumnName('');
      setScore(score + 1);
      checkForActiveScreen(score + 1);
      trigger('impactLight', {
        enableVibrateFallback: settings?.vibro,
      });
    } else {
      if (leftColumnName) {
        wrongAnswer();
        setLeftColumnName('');
        setRightColumnName('');
      } else {
        setRightColumnName(name);
        setLeftColumnName('');
      }
    }
  };

  return (
    <SafeView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Button disabled text={`HP: ${lifeCount}`} ph={0} />
          <Button disabled text={`Score: ${score || 0}`} ph={0} />
        </View>

        <View style={styles.actions}>
          {data[activeScreen].map((item: string, index: number) => {
            const animal = animalNames?.[activeScreen]?.[index];
            const imageKey = animal?.toLowerCase().replaceAll(' ', '_');

            return (
              <View style={styles.block} key={index}>
                <Button
                  text={item}
                  height={120}
                  disabled={successAnimals.includes(item)}
                  mode={successAnimals.includes(item) ? 'success' : 'default'}
                  onPress={() => onLeftColumnPress(item)}
                  style={leftColumnName === item ? styles.active : null}
                />
                <View style={styles.gap} />
                {animalsPhotos[imageKey] ? (
                  <TouchableOpacity
                    disabled={successAnimals.includes(animal)}
                    activeOpacity={0.7}
                    onPress={() => onRightColumnPress(animal)}>
                    <FastImage
                      source={animalsPhotos[imageKey]}
                      resizeMode="cover"
                      style={[
                        styles.image,
                        rightColumnName === animal ? styles.active : null,
                        successAnimals.includes(animal) ? styles.success : null,
                      ]}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            );
          })}
        </View>
        <View style={styles.bottomAction}>
          <Button
            text="Menu"
            fontSize={40}
            height={63}
            fontWeight="600"
            onPress={() => navigate('Home')}
          />
        </View>
      </ScrollView>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  gap: {
    width: '25%',
  },
  block: {
    flexDirection: 'row',
  },
  active: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  success: {
    borderWidth: 2,
    borderColor: 'green',
  },
  image: {
    width: 131,
    height: 120,
    borderRadius: 10,
    overflow: 'hidden',
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
  },
  text: {
    textAlign: 'center',
  },
  bottomAction: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default ComplianceScreen;
