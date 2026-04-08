import { Text as RNText, TextProps } from "react-native";

export default function Text({ children, className, ...props }: TextProps) {
    return (
        <RNText className={className} {...props}>
            {children}
        </RNText>
    );
}