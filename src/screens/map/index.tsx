import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';

import Button from 'app/components/button';
import SafeView from 'app/components/safe-view';
import {goBack} from 'app/navigationRef';
import {encyclopaedia, animalsPhotos} from 'app/assets/quizData';

const MapScreen: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(NaN);

  return (
    <SafeView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={encyclopaedia}
          keyExtractor={(_, index) => index.toString()}
          numColumns={3}
          columnWrapperStyle={styles.list}
          renderItem={({item, index}) => {
            const key = item.title?.toLowerCase().replaceAll(' ', '_');

            return animalsPhotos[key] ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  if (activeIndex === index) {
                    setActiveIndex(NaN);
                  } else {
                    setActiveIndex(index);
                  }
                }}
                style={[
                  styles.item,
                  activeIndex === index ? styles.activeItem : null,
                ]}>
                <FastImage
                  source={animalsPhotos[key]}
                  style={styles.image}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ) : null;
          }}
        />

        <Image
          source={
            isNaN(activeIndex)
              ? require('app/assets/images/map.png')
              : require('app/assets/images/active_map.png')
          }
          style={styles.map}
        />

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
  list: {
    gap: 16,
    justifyContent: 'center',
  },
  content: {
    gap: 12,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  item: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeItem: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  header: {
    alignItems: 'center',
  },
  thumbnail: {
    alignItems: 'center',
  },
  image: {
    width: 97,
    height: 94,
  },
  bottomAction: {
    marginTop: 20,
    marginBottom: 20,
  },
  map: {
    marginBottom: 10,
  },
});

export default MapScreen;
