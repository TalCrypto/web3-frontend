/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    screens: {
      xs: '400px',
      sm: '600px',
      md: '840px',
      lg: '968px',
      xl: '1100px',
      '2xl': '1300px',
      '3xl': '1400px'
    },
    container: {
      center: true,
      // have default horizontal padding
      padding: '20px',
      // default breakpoints but with 40px removed
      screens: {
        xs: '400px',
        sm: '600px',
        md: '840px',
        lg: '968px',
        xl: '1100px',
        '2xl': '1300px',
        '3xl': '1400px'
      }
    },
    extend: {
      colors: {
        primaryBlue: '#2574fb',
        primaryBlueHover: '#5190fc',
        primaryBluePressed: '#1e5dc9',
        primaryPink: '#FF42CA',
        secondaryPink: '#C970D0',

        secondaryBlue: '#202249',
        darkBlue: '#0C0D20',
        mediumBlue: '#242652',
        lightBlue: '#171833',
        lightBlue50: '#12122a',
        highEmphasis: '#ffffffde',
        mediumEmphasis: '#a8cbffbf',
        marketRed: '#ff5656',
        marketGreen: '#78f363',
        warn: '#ffc24bde',
        competition: '#FFEFD0',
        seasonGreen: '#D0FF4B',
        tooltipArrow: '#213676',
        buttonGreen: '#48AE36',
        buttonRed: '#EA3E3F',
        buttonHover: '#ffffff33',

        gradientBlue: '#04AEFC',
        gradientPink: '#F703D9',

        direction: {
          unselected: {
            normal: '#c3d8ff7a',
            disabled: '#c3d8ff26'
          }
        },

        comingSoon: '#ffc34bde',
        modal: {
          item: {
            hover: '#2574fb33'
          }
        }
      },
      fontSize: {
        h1: [
          '36px',
          {
            // lineHeight: '18.29px',
            fontWeight: '700'
          }
        ],
        h2: [
          '32px',
          {
            // lineHeight: '39.01px',
            fontWeight: '700'
          }
        ],
        h3: [
          '24px',
          {
            // lineHeight: '18.29px',
            fontWeight: '700'
          }
        ],
        h4: [
          '20px',
          {
            // lineHeight: '18.29px',
            fontWeight: '600'
          }
        ],
        h5: [
          '16px',
          {
            // lineHeight: '18.29px',
            fontWeight: '600'
          }
        ],
        b1: [
          '15px',
          {
            lineHeight: '18.29px',
            fontWeight: '400'
          }
        ],
        b1e: [
          '15px',
          {
            lineHeight: '18.29px',
            fontWeight: '600'
          }
        ],
        b2: [
          '14px',
          {
            lineHeight: '17.07px',
            fontWeight: '400'
          }
        ],
        b2e: [
          '14px',
          {
            lineHeight: '17.07px',
            fontWeight: '600'
          }
        ],
        b3: [
          '12px',
          {
            // lineHeight: '17.07px',
            fontWeight: '400'
          }
        ],
        b3e: [
          '12px',
          {
            lineHeight: '14.63px',
            fontWeight: '600'
          }
        ]
      }
    }
  },
  plugins: []
};
