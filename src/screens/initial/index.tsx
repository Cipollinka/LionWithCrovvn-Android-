import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import DatePicker from 'react-native-neat-date-picker';

import Text from 'app/components/text';
import Button from 'app/components/button';
import {navigate} from 'app/navigationRef';
import SafeView from 'app/components/safe-view';
import {useAppDispatch} from 'app/store/hooks';
import TextInput from 'app/components/text-input';
import {changeUserInfo, initialUserInfo} from 'app/store/coreReducer';

const purposes = [
  'Planning your travels in Africa',
  'out of curiosity',
  'for studying',
];

const InitialScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);
  const [localUserInfo, setLocalUserInfo] =
    React.useState<typeof initialUserInfo>(initialUserInfo);

  return (
    <>
      <DatePicker
        isVisible={open}
        mode="single"
        onCancel={() => setOpen(false)}
        onConfirm={({dateString}: any) => {
          setOpen(false);
          setLocalUserInfo({
            ...localUserInfo,
            dateOfBirth: dateString,
          });
        }}
      />
      <SafeView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.view}>
          <View style={styles.header}>
            <TextInput
              placeholder="Name"
              maxLength={100}
              value={localUserInfo.name}
              onChangeText={text =>
                setLocalUserInfo({...localUserInfo, name: text})
              }
            />
          </View>

          <Button
            text={localUserInfo.dateOfBirth || 'Years of Births'}
            onPress={() => {
              setOpen(true);
            }}
            fontWeight="600"
            fontSize={30}
            height={76}
          />

          <View style={styles.content}>
            <Text fontSize={36} fontWeight="600" style={styles.text}>
              What you will use the apps for?
            </Text>

            <View style={styles.block}>
              {purposes.map((purpose, index) => (
                <Button
                  key={index}
                  text={purpose}
                  onPress={() => {
                    setLocalUserInfo({
                      ...localUserInfo,
                      purpose,
                    });
                  }}
                  mode={
                    purpose === localUserInfo.purpose ? 'success' : 'default'
                  }
                  fontWeight="600"
                  fontSize={30}
                  height={76}
                />
              ))}
            </View>
          </View>

          <View style={styles.bottomAction}>
            <Button
              text="Continue"
              disabled={!localUserInfo.purpose || !localUserInfo.name}
              onPress={() => {
                dispatch(changeUserInfo(localUserInfo));
                navigate('Home');
              }}
              fontWeight="600"
              fontSize={30}
              height={76}
            />
          </View>
        </ScrollView>
      </SafeView>
    </>
  );
};

const styles = StyleSheet.create({
  view: {},
  text: {
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    alignItems: 'center',
    marginTop: 20,
  },
  header: {
    marginTop: 10,
    marginBottom: 20,
  },
  block: {
    gap: 30,
    marginTop: 10,
    minWidth: '80%',
    maxWidth: '80%',
    marginBottom: 20,
  },
  bottomAction: {
    marginTop: 20,
  },
});

export default InitialScreen;
