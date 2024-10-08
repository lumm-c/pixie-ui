import React, { createContext, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontFamilies } from '@/utils/fontFamilies'
import { FontWeights } from '@/utils/fontWeights'
import { fontConfigs } from '@/utils/fontConfigs';
import { colorThemes as defaultColorThemes } from '@/utils/colortheme';

const ThemeContext = createContext();

export const ThemeProvider = ({
    children,
    fontFamily = FontFamilies.NAIKAI,
    fontWeight = FontWeights.REGULAR,
    colorTheme = defaultColorThemes
}) => {

    useEffect(() => {
        const fontConfig = fontConfigs[fontFamily]?.[fontWeight];

        if (!fontConfig) {
            console.error(`Font configuration not found for ${fontFamily} with weight ${fontWeight}`);
            return;
        }
        const { woff2, woff } = fontConfig;

        const fontFace = `
          @font-face {
            font-family: '${fontFamily}';
            src: url('${woff2}') format('woff2'),
                 url('${woff}') format('woff');
            font-weight: ${fontWeight};
            font-style: normal;
          }
        `;

        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(fontFace));
        document.head.appendChild(style);

        // 清理舊的樣式
        return () => {
            document.head.removeChild(style);
        };
    }, [fontFamily, fontWeight]);

    const theme = {
        fontFamily,
        fontWeight,
        colors: colorTheme
    };

    return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};


ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
    fontFamily: PropTypes.string,
    fontWeight: PropTypes.number,
    colorTheme: PropTypes.object,
};

export const useTheme = () => useContext(ThemeContext);
