import React from "react"
import Link from "gatsby-link"

import typography, { rhythm, scale, options } from "../utils/typography"
import presets from "../utils/presets"

class SidebarBody extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      menu: props.menu.tree,
      activeLink: props.menu.activeLink
    };
  }

  processMenu(val, direct) {
    const status = val.active ? false : true
    const menu = this.state.menu

    if ((val.type === 'children' && !direct) || (val.parent == 0 && direct)) {
      return
    }

    menu.map((section, sectionIndex) => (
      section.links.map((link, linkIndex) => {
        // add active arrow to selected parent
        if ((val.type === 'parent' && val.id === link.id)) {
          menu[sectionIndex].links[linkIndex].active = status
        }

        // display current children tree for the selected parent
        if (val.id === link.parent) {
          menu[sectionIndex].links[linkIndex].display = status
        }

        // show all subtree childrens for a parent
        if (status === false && link.rootParent === val.rootParent && link.deep > val.deep) {
          if (link.display === true) {
            menu[sectionIndex].links[linkIndex].display = status
          }
          if (link.active) {
            menu[sectionIndex].links[linkIndex].active = false
          }
        }

        // show all parent tree for a children
        if (status === true && link.rootParent === val.rootParent) {
          if (link.display === false && link.deep <= val.deep) {
            menu[sectionIndex].links[linkIndex].display = status
          }
          if (!link.active && link.deep < val.deep) {
            menu[sectionIndex].links[linkIndex].active = true
          }
        }
      })
    ))

    this.setState({
      menu: menu
    })
  }

  handleClick = (e, val) => {
    this.processMenu(val);

    if (val.type === 'parent') {
      e.preventDefault();
    }
  }

  componentDidMount() {
    const activeLink = this.state.activeLink

    if (this.state.activeLink) {
      this.processMenu(activeLink, true)
    }
  }

  render() {
    const fontSize = this.props.inline
      ? scale(0).fontSize
      : scale(-2 / 15).fontSize
    const headerStyles = this.props.inline
      ? {
        fontSize: scale(2 / 5).fontSize,
        fontStyle: false,
        color: false,
      }
      : {
        fontSize: scale(-1 / 3).fontSize,
        fontStyle: `normal`,
        color: presets.brandLight,
      }
    const headerTextTransform = this.props.inline ? false : `uppercase`

    return (
      <div
        className="sidebar"
        css={{
          marginBottom: rhythm(1),
          padding: this.props.inline ? 0 : rhythm(3 / 4),
        }}
      >
        {this.state.menu.map((section, index) => (
          <div
            key={section.title}
            css={{
              fontSize,
            }}
          >
            <h3
              css={{
                ...headerStyles,
                textTransform: headerTextTransform,
                marginTop: index === 0 ? 0 : false,
              }}
            >
              {section.title}
            </h3>
            <ul
              css={{
                listStyle: `none`,
                margin: 0,
                fontFamily: typography.options.headerFontFamily.join(`,`),
              }}
            >
              {section.links.map(val => {
                const title = val.title

                // Don't show the main docs link on mobile as we put these
                // links on that main docs page so it's confusing to have
                // the page link to itself.
                if (this.props.inline && section.links[title] === `/docs/`) {
                  return null
                }

                // If the last character is a * then the doc page is still in draft
                let changedTitle = title
                let linkStyle = {
                  "&&": {
                    borderBottom: `none`,
                    boxShadow: `none`,
                    fontWeight: `normal`,
                    marginLeft: rhythm(0.5 * (val.deep - 1)),
                    ":hover": {
                      color: `inherit`,
                      borderBottom: `none`,
                      boxShadow: `none`,
                    },
                  },
                }

                let liCss = {
                  marginBottom: options.blockMarginBottom / 2,

                }

                if (val.display === false && val.parent !== 0) {
                  liCss.display = 'none'
                } else {
                  liCss.display = 'block'
                }

                return (
                  <li
                    id={val.id}
                    key={val.id}
                    css={liCss}
                  >
                    <Link onClick={(e) => this.handleClick(e, val)} className=" " to={val.path} css={linkStyle} activeStyle={{
                      color: `${presets.brand}`
                    }}>
                      <span css={{
                        display: val.type === 'parent' ? '' : 'none',
                        fontSize: '10px',
                        verticalAlign: 'middle',
                        marginLeft: '-12px',
                        marginRight: '2px'
                      }}>{val.active ? '▼' : '►'}</span>
                      {changedTitle}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    )
  }
}

export default SidebarBody