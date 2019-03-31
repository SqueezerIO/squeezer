import React from "react"
import SearchIcon from "react-icons/lib/fa/search"

export default class DocSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeSearch: false
    };
  }

  onFocus = () => {
    this.setState({
      activeSearch: true
    });
  }

  onBlur = () => {
    this.setState({
      activeSearch: false
    });
  }

  render() {
    return (
      <div>
        <SearchIcon css={{
          position: 'absolute',
          color: '#d9d9d9',
          opacity: 0.3,
          marginLeft: '30px',
          marginTop: '10px'
        }}/>
        <input css={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '7px',
          boxShadow: 'none',
          border: 0,
          color: 'white',
          fontSize: '16px',
          borderRadius: '25px',
          paddingLeft: '38px',
          width: this.state.activeSearch ? '250px' : '150px',
          marginRight: '90px',
          marginLeft: '20px',
          transition: 'all 0.3s cubic-bezier(0.2, 0.85, 0.2, 1.1)',
        }} id="docs-search" onFocus={this.onFocus} onBlur={this.onBlur} placeholder="Search docs" type="text" />
      </div>
    )
  }
}  