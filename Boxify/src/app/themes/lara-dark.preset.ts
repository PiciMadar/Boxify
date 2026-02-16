import { definePreset } from '@primeng/themes';
import Lara from '@primeng/themes/lara';

const LaraDark = definePreset(Lara, {
  semantic: {
    primary: {
      50: '#eff6ff',
      100: '#e0ecff',
      200: '#c7dcff',
      300: '#a8c5ff',
      400: '#7da3ff',
      500: '#5281ff',
      600: '#3d63ff',
      700: '#2d49f5',
      800: '#2541de',
      900: '#1f35c7',
      950: '#0f1ba8',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#eff6ff',
          100: '#e0ecff',
          200: '#c7dcff',
          300: '#a8c5ff',
          400: '#7da3ff',
          500: '#5281ff',
          600: '#3d63ff',
          700: '#2d49f5',
          800: '#2541de',
          900: '#1f35c7',
          950: '#0f1ba8',
        },
        primary: {
          color: '#2d81ff',
          inverseColor: '#ffffff',
          hover: '#5281ff',
          activeColor: '#2541de',
          borderColor: '#c7dcff',
        },
        highlight: {
          background: '#e0ecff',
          focusBackground: '#c7dcff',
          color: '#2d81ff',
          focusColor: '#2541de',
        },
        mask: {
          background: 'rgba(0, 0, 0, 0.4)',
          color: '{surface.0}',
        },
        formField: {
          background: '{surface.0}',
          disabledBackground: '{surface.200}',
          filledBackground: '{surface.50}',
          filledFocusBackground: '{surface.50}',
          borderColor: '{surface.300}',
          hoverBorderColor: '{surface.400}',
          focusBorderColor: '{primary.color}',
          invalidBorderColor: '{red.500}',
          color: '{surface.900}',
          disabledColor: '{surface.500}',
          placeholderColor: '{surface.500}',
          floatLabelBackground: '{surface.0}',
          floatLabelFocusBackground: '{surface.0}',
          floatLabelActiveColor: '{primary.color}',
          floatLabelInvalidColor: '{form.invalid.color}',
          iconColor: '{surface.400}',
        },
      },
    },
  },
});

export default LaraDark;
