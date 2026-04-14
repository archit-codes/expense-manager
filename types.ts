import {Href} from "expo-router";
import {Firestore , Timestamp} from "firebase/firestore";
import {Icon} from "phosphor-react-native";
import React, {ReactNode} from "react";
import {
    ActivityIndicator,
    ActivityIndicatorProps,
    ImageStyle,
    PressableProps,
    TextInput,
    TextInputProps,
    TextProps,
    TextStyle,
    TouchableOpacityProps,
    View,
    ViewStyle,
} from "react-native";

export type ScreenWrapperProps = {
    style?: ViewStyle;
    children: ReactNode;
};

export type NodeWrapperProps = {
    style?: ViewStyle;
    children: ReactNode;
    bg?: string;
};

export type accountOptionType = {
    title: string;
    icon: React.ReactNode;
    bgColor: string;
    routeName?: any;
};

export type TypoProps = {
    size?:number;
    color?: string;
    fontWeight?: TextStyle['fontWeight'];
    children: any | null;
    style?: TextStyle;
    textProps?: TextProps;
}

export interface InputProps extends TextInputProps {
    icon?: React.ReactNode;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    inputRef?: React.RefObject<TextInput>;
    // label?: string;
    // error?: string;
}

export interface CustomButtonProps extends TouchableOpacityProps{
    style?: ViewStyle;
    onPress?: () => void;
    loading?: boolean;
    children: React.ReactNode;
}


export type BackButtonProps = {
    style?: ViewStyle;
    iconSize?: number;
};

export type ImageUploadProps = {
    file?: any;
    onSelect: (file: any) => void;
    onClear: () => void;
    containerStyle?: ViewStyle;
    imageStyle?: ImageStyle;
    placeholder?: string;
};

export type UserType={
    uid?: string;
    email?: string | null;
    name?: string | null;
    image?: any;
} | null;

export type UserDataType = {
    name: string;
    image?: any;
};

export type AuthContextType = {
    user: UserType;
    setUser: Function;
    login: (
        email: string,
        password: string,
        name?: string
  ) => Promise<{ success: boolean; msg?: string }>;
    register: (
        email: string,
        password: string,
        name: string
    ) => Promise<{ success: boolean; msg?: string }>;
    updateUserData: (userId: string) => Promise<void>;
};