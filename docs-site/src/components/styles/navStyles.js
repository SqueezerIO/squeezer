import typography, { rhythm, scale } from "../../utils/typography"
import presets from "../../utils/presets"

const navItemStyles  = {
  ...scale(-1 / 3),
  boxSizing: `border-box`,
  display: `inline-block`,
  color: '#fff',
  textDecoration: `none`,
  letterSpacing: `0.03em`,
  lineHeight: `calc(${presets.headerHeight} - 4px)`,
  padding: `0px ${rhythm(0.5)} 0`,
  position: `relative`,
  top: 0,
  transition: `color .15s ease-out`,
  "&:hover": {
    opacity: 0.8,
  },
}

export default {
  navItemStyles : navItemStyles
}