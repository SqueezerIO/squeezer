import React from "react"
import Container from "../components/container"
import createReactClass from "create-react-class"

const IndexRoute = createReactClass({
  render() {
    return (
      <Container>
        <h1>Page not found</h1>
      </Container>
    )
  },
})

export default IndexRoute
