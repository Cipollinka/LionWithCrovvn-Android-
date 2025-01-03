import React, {useEffect, useRef, useState} from 'react';
import {
  Linking,
  SafeAreaView,
  StatusBar,
  View,
  Alert,
  BackHandler,
} from 'react-native';
import WebView from 'react-native-webview';
import Storage from './Storage';
import LoadingAppManager from './LoadingAppManager';

export default function AppManagerMain({navigation}) {
  const [linkRefresh, setLinkRefresh] = useState('');

  async function getSavedParams() {
    await Storage.get('link').then(res => {
      setLinkRefresh(res);
      console.log(linkRefresh);
    });
  }
  useEffect(() => {
    getSavedParams();
  }, []);

  const webViewRef = useRef(null);

  const redirectDomens = [
    'https://spin.city/payment/success?identifier=',
    'https://jokabet.com/',
    'https://winspirit.app/?identifier=',
    'https://rocketplay.com/api/payments',
    'https://ninewin.com/',
  ];

  const domensForBlock = [
    'bitcoin',
    'litecoin',
    'dogecoin',
    'tether',
    'ethereum',
    'bitcoincash',
  ];

  const openInBrowser = [
    'mailto:',
    'itms-appss://',
    'https://m.facebook.com/',
    'https://www.facebook.com/',
    'https://www.instagram.com/',
    'https://twitter.com/',
    'https://x.com/',
    'https://www.whatsapp.com/',
    'https://t.me/',
    'fb://',
  ];

  const openURLInBrowser = async (url) => {
    await Linking.openURL(url);
  };

  const checkLinkInArray = (link, array) => {
    for (let i = 0; i < array.length; i++) {
      if (link.includes(array[i])) {
        return true;
      }
    }
    return false;
  };

  const [currentURL, setCurrentURL] = useState('');
  const checkURL = useRef('');

  function checkLockedURL(url) {
    setCurrentURL(url);
    setTimeout(() => {
      if (currentURL === 'about:blank') {
        webViewRef.current.injectJavaScript(
          `window.location.replace('${linkRefresh}')`,
        );
      }
    }, 2000);
  }

  const onShouldStartLoadWithRequest = event => {
    let currentUrl = event.url;
    // console.log(currentUrl);

    try {
      if (
          event.mainDocumentURL.includes('pay.skrill.com') ||
          event.mainDocumentURL.includes('app.corzapay.com') ||
          event.mainDocumentURL.includes(
              'https://checkout.payop.com/en/payment/invoice-preprocessing/',
          )
      ) {
        navigation.navigate('child', {data: event.mainDocumentURL});
      }
    } catch (error) {
    }

    if (checkLinkInArray(currentUrl, openInBrowser)) {
      webViewRef.current.stopLoading();
      openURLInBrowser(currentUrl);
      webViewRef.current.injectJavaScript(
          `window.location.replace('${linkRefresh}')`,
      );
    }

    if (checkLinkInArray(currentUrl, redirectDomens)) {
      webViewRef.current.injectJavaScript(
          `window.location.replace('${linkRefresh}')`,
      );
    }

    if (checkLinkInArray(currentUrl, domensForBlock)) {
      webViewRef.current.stopLoading();
      return false;
    }
    return true;
  };

  const stateChange = navState => {
    const currentUrl = navState.url;
    checkURL.current = currentUrl;
    console.log(currentUrl);
    checkLockedURL(currentUrl);
  };

  const [isDoubleClick, setDoubleClick] = useState(false);

  const isBackClick = () => {
    if (isDoubleClick) {
      webViewRef.current.injectJavaScript(
        `window.location.replace('${linkRefresh}')`,
      );
      return;
    }
    setDoubleClick(true);
    webViewRef.current.goBack();
    setTimeout(() => setDoubleClick(false), 400);
  };

  const [isInit, setInit] = React.useState(false);
  const [isLoadingPage, setLoadingPage] = useState(true);
  const [isInvisibleLoader, setInvisibleLoader] = useState(false);

  const finishLoading = () => {
    if (!isInit) {
      setInit(true);
    } else {
      setLoadingPage(false);
      setInvisibleLoader(true);
    }
  };

  useEffect(() => {
    const backActionClick = () => {
      isBackClick();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backActionClick,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <>
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
            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
            onNavigationStateChange={stateChange}
            source={{uri: linkRefresh}}
            textZoom={100}
            allowsBackForwardNavigationGestures={true}
            domStorageEnabled={true}
            javaScriptEnabled={true}
            onLoadStart={() => setLoadingPage(true)}
            onLoadEnd={() => finishLoading()}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            onError={syntEvent => {
              const {nativeEvent} = syntEvent;
              const {code} = nativeEvent;
              if (code === -1002) {
                Alert.alert(
                  'Ooops',
                  "It seems you don't have the bank app installed, wait for a redirect to the payment page",
                );
              }
            }}
            onOpenWindow={syntheticEvent => {
              const {nativeEvent} = syntheticEvent;
              const {targetUrl} = nativeEvent;
              try {
                if (Linking.canOpenURL(targetUrl)) {
                  navigation.navigate('child', {data: targetUrl});
                }
              } catch (error) {}
            }}
            useWebView2={true}
            setSupportMultipleWindows={false}
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
      {isLoadingPage && !isInvisibleLoader ? <LoadingAppManager /> : <></>}
    </>
  );
}
