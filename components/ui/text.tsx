import { Text as RNText, TextProps } from "react-native";
import { useTranslation } from "react-i18next";

export default function Text({ children, className = "", ...props }: TextProps) {
    const { i18n } = useTranslation();
    const font = i18n.language === "ar" ? "font-cairo" : "font-poppins";
    // const textAlign = i18n.language === "ar" ? "text-right" : "text-left";
    const hasAlign =
        className.includes("text-left") ||
        className.includes("text-right") ||
        className.includes("text-center") ||
        className.includes("text-justify");

    const defaultAlign = hasAlign
        ? ""
        : i18n.language === "ar"
            ? "text-right"
            : "text-left";
    return (
        <RNText className={`${font} ${defaultAlign} ${className}`} {...props}>
            {children}
        </RNText>
    );
}