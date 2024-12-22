import React, {useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';

import Button from 'app/components/button';
import TextInput from 'app/components/text-input';
import SafeView from 'app/components/safe-view';
import {goBack, navigate} from 'app/navigationRef';
import {encyclopaedia, animalsPhotos} from 'app/assets/quizData';

const EncyclopaediaScreen: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredData = encyclopaedia.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeView ph={0}>
      <ScrollView
        contentContainerStyle={styles.view}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Button />
        </View>
        <FlatList
          data={filteredData}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.title}
          ListFooterComponent={
            <View style={styles.bottomAction}>
              <Button
                text="Back"
                fontSize={40}
                height={89}
                fontWeight="600"
                onPress={() => goBack()}
              />
            </View>
          }
          renderItem={({item, index}) => {
            const key = item.title?.toLowerCase().replaceAll(' ', '_');

            return animalsPhotos[key] ? (
              <View style={styles.item} key={item.title}>
                <FastImage
                  source={animalsPhotos[key]}
                  style={styles.image}
                  resizeMode="cover"
                />

                <View style={styles.flex}>
                  <Button
                    text={item.title}
                    fontSize={40}
                    fontWeight="600"
                    height={127}
                    disabled
                  />

                  <View style={styles.readMore}>
                    <Button
                      text="Read More"
                      fontSize={24}
                      fontWeight="600"
                      height={59}
                      onPress={() => navigate('Animal', {index})}
                    />
                  </View>
                </View>
              </View>
            ) : null;
          }}
        />
      </ScrollView>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: 16,
  },
  search: {
    marginBottom: 20,
  },
  header: {
    height: 89,
    marginLeft: -30,
    marginRight: -30,
    marginBottom: 20,
  },
  flex: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  image: {
    width: 131,
    height: 127,
    borderRadius: 10,
    overflow: 'hidden',
  },
  readMore: {
    marginTop: 10,
    maxWidth: 160,
    marginHorizontal: 24,
  },
  bottomAction: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default EncyclopaediaScreen;
