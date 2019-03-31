import React from "react"
import Link from "gatsby-link"

import Container from "../components/container"
import presets from "../utils/presets"
import {
  Redirect
} from "react-router-dom"

class IndexRoute extends React.Component {
  render() {
    return (
      <Redirect to="/getting-started/"/>
    )
  }
}

export default IndexRoute
