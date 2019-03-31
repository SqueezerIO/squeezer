import Link from "gatsby-link"
import { rhythm, scale, options } from "../utils/typography"
import presets from "../utils/presets"

import { css } from "glamor"

let stripeAnimation = css.keyframes({
  "0%": { backgroundPosition: `0 0` },
  "100%": { backgroundPosition: `30px 60px` },
})

const Button = ({ to, overrideCSS, type, onClick, disabled, label}) => (
  <button
    css={{
      border: `1px solid #FFF`,
      borderRadius: 5,
      boxShadow: `none`,
      color: '#FFF',
      fontSize: '25px',
      verticalAlign: 'middle',
      fontWeight: `normal`,
      backgroundColor: `transparent`,
      backgroundSize: `30px 30px`,
      // margin: '0 !important',
      padding: '13px 15px',
      cursor: 'pointer',
      [presets.Mobile]: {
        marginTop: rhythm(0.5)
      },
      [presets.Tablet]: {
        marginTop: 0
      },
      [presets.Desktop]: {
        marginTop: 0
      },
      "&&": {
        boxShadow: `none`,
        backgroundColor: `transparent`,
        transiton: `all .15s ease-out`,
        ":hover": {
          backgroundSize: `30px 30px`,
          backgroundColor: presets.brand,
          backgroundImage: `linear-gradient(45deg, rgba(0,0,0, 0.1) 25%, transparent 25%, transparent 50%, rgba(0,0,0, 0.1) 50%, rgba(0,0,0, 0.1) 75%, transparent 75%, transparent)`,
          color: `#fff`,
          animation: `${stripeAnimation} 2.8s linear infinite`,
        },
        ":after": {
          content: ``,
          display: `block`,
        },
      },
      ...overrideCSS
    }}
    disabled={disabled}
    onClick={onClick}
    type={type}
  >
    {label}
  </button>
)

export default Button
