import { rhythm, scale, options } from "../utils/typography"
import presets from "../utils/presets"

const FuturaParagraph = ({ children, overrideCSS }) => (
  <p
    css={{
      ...overrideCSS,
      fontFamily: options.headerFontFamily.join(`,`),
      marginBottom: 0,
    }}
  >
    {children}
  </p>
)

export default FuturaParagraph
