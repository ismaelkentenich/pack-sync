import React from "react";
import { View, TouchableOpacity, ViewStyle, StyleProp, TouchableOpacityProps } from "react-native";
import { styles } from "./styles";
import Theme from "@theme/theme";

type CardProps = TouchableOpacityProps & {
  children: React.ReactNode;
  touchable?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function Card({ children, touchable = true, style, ...rest }: CardProps) {
  const Container = touchable ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.cardContainer, style]}
      activeOpacity={touchable ? 0.8 : 1}
      {...(touchable ? rest : {})}
    >
      {children}
    </Container>
  );
}
