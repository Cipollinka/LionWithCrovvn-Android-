import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';

import Text from 'app/components/text';
import {goBack} from 'app/navigationRef';
import Button from 'app/components/button';
import SafeView from 'app/components/safe-view';
import {encyclopaedia, animalsPhotos} from 'app/assets/quizData';

interface IProps {
  route?: {
    params?: {
      index: number;
    };
  };
}

const SettingsScreen: React.FC<IProps> = ({route}) => {
  const activeData = encyclopaedia[route?.params?.index || 0];
  const imageKey = activeData?.title?.toLowerCase().replaceAll(' ', '_');

  return (
    <SafeView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text fontSize={64} fontWeight="600">
            {activeData?.title}
          </Text>
        </View>
        {animalsPhotos[imageKey] ? (
          <View style={styles.thumbnail}>
            <FastImage
              source={animalsPhotos[imageKey]}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        ) : null}

        {activeData?.list.map((item, index) => (
          <View key={index} style={styles.content}>
            <Text fontSize={17} fontWeight="600">
              {item.title}
            </Text>
            <Text fontSize={17} fontWeight="400">
              {item.description}
            </Text>
          </View>
        ))}

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
  content: {
    marginBottom: 6,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  thumbnail: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 237,
    height: 230,
  },
  bottomAction: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default SettingsScreen;
