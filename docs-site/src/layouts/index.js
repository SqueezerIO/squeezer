import React from "react"
import Helmet from "react-helmet"

import Navigation from "../components/navigation"
// import MobileNavigation from "../components/navigation-mobile"
import SidebarBody from "../components/sidebar-body"
import docsSidebar from "../../content/doc-links.yaml"
import { rhythm, scale } from "../utils/typography"
import presets from "../utils/presets"
import colors from "../utils/colors"
import createReactClass from "create-react-class"
import traverse from "traverse"
import queryString from "query-string";


import "../css/prism-coy.css"

// Import Futura PT typeface
import "../fonts/Webfonts/futurapt_book_macroman/stylesheet.css"
import "../fonts/Webfonts/futurapt_bookitalic_macroman/stylesheet.css"
import "../fonts/Webfonts/futurapt_demi_macroman/stylesheet.css"
import "../fonts/Webfonts/futurapt_demiitalic_macroman/stylesheet.css"

// Other fonts
import "typeface-spectral"
import "typeface-space-mono"

module.exports = createReactClass({
  propTypes() {
    return {
      children: React.PropTypes.any
    }
  },
  loadMenu(props) {
    const menuTree = []
    let activeLink = null
    let index = 0
    let parentLinks = [], parentLink, rootParent

    docsSidebar.forEach((section, index) => {
      let links = []
      traverse(section.links).forEach(function () {
        const deep = this.level
        const node = this.node
        const key = this.key
        let linkId = `sidebar-link-${index}`
        let path = typeof node === 'string' ? this.node : '#'

        if (deep === 1) {
          parentLink = 0
          rootParent = linkId
        } else {
          parentLink = parentLinks[deep - 1]
        }

        let linkObj = {
          id: linkId,
          title: key,
          type: typeof node === 'string' ? 'children' : 'parent',
          path: path,
          parent: parentLink,
          rootParent: rootParent,
          deep: deep,
          active: false,
          display: false
        }

        if (props.location.pathname === path) {
          activeLink = linkObj
        }

        if (key) {
          links.push(linkObj)
        }

        if (typeof node !== 'string') {
          parentLinks[deep] = linkId
        }

        index++
      })

      menuTree.push({
        title: section.title,
        key: section.title,
        links: links
      })
    })
    return {
      tree: menuTree,
      activeLink: activeLink
    }
  },
  render() {
    const queryParams = queryString.parse(this.props.location.search)
    if (queryParams && queryParams.utm_source) {
      localStorage.setItem('utm_source', queryParams.utm_source)
      localStorage.setItem('utm_medium', queryParams.utm_medium)
      localStorage.setItem('utm_campaign', queryParams.utm_campaign)
    } else if (typeof document !== "undefined" && document.referrer && !localStorage.utm_source) {
      const referrer = document.referrer.replace('https://', '').split(/[/?#]/)[0]
      localStorage.setItem('utm_source', referrer)
      localStorage.setItem('utm_medium', 'referrer')
    }

    const isHomepage = this.props.location.pathname == `/`
    const hasSidebar =
      this.props.location.pathname.slice(0, 6) === `/docs/` ||
      this.props.location.pathname.slice(0, 10) === `/packages/` ||
      this.props.location.pathname.slice(0, 10) === `/enterprise/`
    const menu = this.loadMenu(this.props)
    const sidebarStyles = {
      borderRight: `1px solid ${colors.b[0]}`,
      backgroundColor: presets.sidebar,
      float: `left`,
      width: rhythm(10),
      display: `none`,
      position: `fixed`,
      overflowY: `auto`,
      height: `calc(100vh - ${presets.headerHeight})`,
      WebkitOverflowScrolling: `touch`,
      "::-webkit-scrollbar": {
        width: `6px`,
        height: `6px`,
      },
      "::-webkit-scrollbar-thumb": {
        background: presets.lightBlue,
      },
      "::-webkit-scrollbar-track": {
        background: presets.brandLighter,
      },
    }

    return (
      <div>
        <Helmet defaultTitle={`Squeezer Framework`} titleTemplate={`%s | Squeezer Framework`}>
          <meta name="twitter:site" content="@squeezerio" />
          <meta name="og:type" content="website" />
          <meta name="og:site_name" content="Squeezer.IO" />
        </Helmet>
        <Navigation pathname={this.props.location.pathname} />
        <div
          className={hasSidebar ? `main-body has-sidebar` : `main-body`}
          css={{
            paddingTop: 0,
            [presets.Tablet]: {
              margin: `0 auto`,
              paddingTop: isHomepage ? 0 : presets.headerHeight,
            },
          }}
        >
          {/* TODO Move this under docs/index.js once Gatsby supports multiple levels
               of layouts */}
          <div
            css={{
              ...sidebarStyles,
              [presets.Tablet]: {
                display: 'block'
              },
            }}
          >
            <SidebarBody menu={menu} />
          </div>
          <div
            css={{
              [presets.Tablet]: {
                paddingLeft: hasSidebar ? rhythm(10) : 0,
              },
            }}
          >
            {this.props.children()}
          </div>
        </div>
        {/* <MobileNavigation /> */}
        <script type="text/javascript" src="https://cdn.jsdelivr.net/docsearch.js/2/docsearch.min.js"></script>
      </div>
    )
  },
})
