import type { BaseDesignTokens, ColorScheme, DesignTokens, Preset, Theme } from "@primeuix/themes/types";
import { definePreset, palette, type ColorScale } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura"
import type { AuraBaseDesignTokens, AuraBaseTokenSections, semantic } from "@primeuix/themes/aura/base";



// Can I properly type my "dynamic" color scheme tokens? VVV that doesn't seem right (has extra properties)
const DynamicColorModeTokens = {

    semantic: {

        primary: palette('#823fde') as ColorScale,

        colorScheme: {
            light: {
                primary: {
                    color: 'var(--c-brand-2)',
                    activeColor: 'var(--c-brand-3)',
                    hoverColor: 'var(--c-brand-3)',
                    contrastColor: 'var(--c-text-1)',
                },

                surface: {
                    "0": 'var(--c-bg-2)',
                    "100": 'var(--c-bg-2)',
                    "200": 'var(--c-bg-3)',
                    "300": 'var(--c-bg-3)',
                    "400": 'var(--c-bg-4)',
                    "500": 'var(--c-bg-4)',
                    "600": 'var(--c-bg-4)',
                    "700": 'var(--c-bg-5)',
                    "800": 'var(--c-bg-5)',
                    "900": 'var(--c-bg-5)',
                    "950": 'var(--c-bg-5)',
                },

                text: {
                    color: 'var(--c-text-1)',
                    mutedColor: 'var(--c-text-2)',
                },

                content: {
                    background: 'var(--c-bg-3)',
                    color: 'var(--c-text-1)',
                    hoverColor: 'var(--c-text-1)',
                    borderColor: 'var(--c-ring-2)',
                    hoverBackground: 'var(--c-bg-4)'
                },

                formField: {
                    background: 'var(--c-bg-3)',
                    borderColor: 'var(--c-ring-2)',
                    color: 'var(--c-text-1)',

                    hoverBorderColor: 'var(--c-ring-1)',
                    focusBorderColor: 'var(--c-ring-1)',

                    disabledBackground: 'var(--c-bg-3)',
                    disabledColor: 'var(--c-text-2)',

                    invalidBorderColor: 'var(--c-danger-2)',
                    invalidPlaceholderColor: 'var(--c-danger-2)',

                    placeholderColor: 'var(--c-text-2)',
                    iconColor: 'var(--c-text-1)',
                },

                list: {
                    option: {
                        color: 'var(--c-text-1)',
                        focusColor: 'var(--c-text-1)',
                        selectedColor: 'var(--c-text-1)',
                        selectedFocusColor: 'var(--c-text-1)',
                        focusBackground: 'var(--c-bg-4)',
                        selectedBackground: 'var(--c-brand-2)',
                        selectedFocusBackground: 'var(--c-brand-2)',
                        icon: {
                            color: 'var(--c-text-1)',
                            focusColor: 'var(--c-text-1)',
                        }
                    },
                    optionGroup: {
                        background: 'var(--c-bg-3)',
                        color: 'var(--c-text-1)'
                    }
                },

                highlight: {
                    background: 'var(--c-bg-3)',
                    color: 'var(--c-text-1)',
                    focusColor: 'var(--c-text-1)',
                    focusBackground: 'var(--c-bg-3)'
                }

            }
        },
        disabledOpacity: '0.5'
    },

    components: {
        // Button Variants:
        button: {
            colorScheme: {
                light: {
                    text: {
                        secondary: {
                            hoverBackground: 'var(--c-bg-4)',
                            activeBackground: 'var(--c-bg-4)',
                            color: 'var(--c-text-1)'
                        }
                    },
                }
            }
        }

    }



} satisfies Partial<Preset<AuraBaseDesignTokens>>



export const PrimeVueTheme: Theme = {
    preset: definePreset(Aura, {
        semantic: {
            colorScheme: {
                light: DynamicColorModeTokens.semantic.colorScheme.light,
                dark: DynamicColorModeTokens.semantic.colorScheme.light
            }
        },
        components: DynamicColorModeTokens.components
    }),
    options: {
        darkModeSelector: 'false'
    }
}
