import React, {useEffect, useRef, useState} from 'react';
import {
  Linking,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  View,
  Image,
  Alert,
  BackHandler,
} from 'react-native';
import WebView from 'react-native-webview';

export default function AppManagerChild({navigation, route}) {
  const linkRefresh = route.params.data;

  const webViewRef = useRef(null);

  const [isTwoClick, setTwoClick] = useState(false);

  const redirectDomens = ['https://ninecasino.life/#deposit'];

  const openInBrowser = [
    'mailto:',
    'itms-appss://',
    'https://m.facebook.com/',
    'https://www.facebook.com/',
    'https://www.instagram.com/',
    'https://twitter.com/',
    'https://www.whatsapp.com/',
    'https://t.me/',
    'fb://',
    'conexus://',
    'bmoolbb://',
    'cibcbanking://',
    'bncmobile://',
    'rbcmobile://',
    'scotiabank://',
    'pcfbanking://',
    'tdct://',
    'nl.abnamro.deeplink.psd2.consent://',
    'nl-snsbank-sign://',
    'nl-asnbank-sign://',
    'triodosmobilebanking',
    'wise',
    'skrill',
  ];

  function backHandlerButton() {
    if (isTwoClick) {
      navigation.goBack();
      return;
    }
    setTwoClick(true);
    webViewRef.current.goBack();
    setTimeout(() => {
      setTwoClick(false);
    }, 1000);
  }

  useEffect(() => {
    const backActionClick = () => {
      backHandlerButton();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backActionClick,
    );

    return () => backHandler.remove();
  }, []);

  const checkLinkInArray = (link, array) => {
    for (let i = 0; i < array.length; i++) {
      if (link.includes(array[i])) {
        return true;
      }
    }
    return false;
  };

  const openURLInBrowser = async (url) => {
    await Linking.openURL(url);
  };

  const onShouldStartLoadWithRequest = event => {
    if (checkLinkInArray(event.url, openInBrowser)) {
      try {
        Linking.openURL(event.url);
      } catch (error) {
        Alert.alert(
          'Ooops',
          "It seems you don't have the bank app installed, wait for a redirect to the payment page",
        );
      }
      return false;
    }

    if (checkLinkInArray(event.mainDocumentURL, redirectDomens)) {
      navigation.navigate('main');
      return false;
    }
    return true;
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
        <StatusBar barStyle={'light-content'} backgroundColor={'black'} />
        <WebView
          originWhitelist={[
            '*',
            'http://*',
            'https://*',
            'intent://*',
            'tel:*',
            'mailto:*',
            'itms-appss://*',
            'https://m.facebook.com/*',
            'https://www.facebook.com/*',
            'https://www.instagram.com/*',
            'https://twitter.com/*',
            'https://x.com/*',
            'https://www.whatsapp.com/*',
            'https://t.me/*',
            'fb://*',
          ]}
          source={{uri: linkRefresh}}
          textZoom={100}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          allowsBackForwardNavigationGestures={true}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          onError={syntEvent => {
            const {nativeEvent} = syntEvent;
            const {code} = nativeEvent;
            if (code === -1101) {
              navigation.goBack();
            }
            if (code === -1002) {
              Alert.alert(
                'Ooops',
                "It seems you don't have the bank app installed, wait for a redirect to the payment page",
              );
              navigation.goBack();
            }
          }}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          setSupportMultipleWindows={false}
          useWebView2={true}
          allowFileAccess={true}
          showsVerticalScrollIndicator={false}
          javaScriptCanOpenWindowsAutomatically={true}
          style={{flex: 1}}
          ref={webViewRef}
          userAgent={
            'Mozilla/5.0 (Linux; Android 9; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36'
          }
        />
      </SafeAreaView>
    </View>
  );
}
