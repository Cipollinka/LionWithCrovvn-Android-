import React from 'react';
import {Text as RNText, TextProps, StyleProp, Dimensions} from 'react-native';

export type FontWeight = '400' | '600';

interface IProps extends TextProps {
  style?: StyleProp<any>;
  color?: string;
  fontSize?: number;
  fontWeight?: FontWeight;
}

const {width} = Dimensions.get('window');

const FONT_FAMILIES_BY_FONT_WEIGHT = {
  '400': {fontFamily: 'Bellota-Regular'},
  '600': {fontFamily: 'Bellota-Bold'},
};

const Text: React.FC<IProps> = ({
  children,
  style,
  color,
  fontSize = 16,
  fontWeight = '400',
  ...props
}) => {
  const styleFontWeight = (style?.fontWeight || fontWeight) as FontWeight;
  const fontFamilyStyle = FONT_FAMILIES_BY_FONT_WEIGHT[styleFontWeight];
  const ratio = width <= 375 ? 1.3 : 1;

  return (
    <RNText
      selectable
      {...props}
      style={[
        {
          color: color || '#fff',
          fontSize: fontSize / ratio,
          lineHeight: (fontSize / ratio) * 1.25,
        },
        {fontWeight},
        style,
        fontFamilyStyle,
      ]}
      allowFontScaling>
      {children}
    </RNText>
  );
};

export default Text;
