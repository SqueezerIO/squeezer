import presets from "../utils/presets"
import React from "react"
import _ from "lodash"

class TerminalParseCommands extends React.Component {
  constructor(props) {
    super(props)
    this.commands = props.commands
    this.complete = false
    this.state    = {
      output : ''
    };
    this.pause = null
  }

  componentDidMount() {
    this.process()
  }

  componentWillUnmount() {
    window.clearTimeout(this.pause)
  }

  renderComment(text, index) {
    return (
      <div
        key={index} css={{
          width : '100%',
          color : presets.lightBlue
        }}
      >
        # {text}
      </div>
    )
  }

  renderCommand(text, index) {
    return (
      <div
        key={index} css={{
          width     : '100%',
          color     : presets.brandLighter,
          marginTop : '-6px'
        }}
      >
    <span css={{
      WebkitTouchCallout : 'none',
      WebkitUserSelect   : 'none',
      KhtmlUserSelect    : 'none',
      MozUserSelect      : 'none',
      MsUserSelect       : 'none',
      UserSelect         : 'none'
    }}>$&nbsp;</span>{text}{this.commands[index].complete ? '' : '_'}
      </div>
    )
  }

  display() {
    let output   = []
    const commands = this.commands

    _.forEach(commands, (val, key) => {
      const type = val.type
      const text = val.text
      if (_.has(val, 'atChar')) {
        const atChar     = val.atChar
        const textAtChar = text.substr(0, atChar)
        if (type === 'comment') {
          output = _.concat(output, this.renderComment(textAtChar, key))
        } else if (type === 'command') {
          output = _.concat(output, this.renderCommand(textAtChar, key))
        }
      }
    })

    this.setState({
      output : output
    })
  }

  process() {
    const commands    = this.commands
    const commandsLen = commands.length
    let currentIndex  = 0

    const run = () => {
      const command = this.commands[currentIndex];
      const type    = command.type;
      const text    = command.text;
      const textLen = text.length

      const iterate = (arg) => {
        if (arg === true) {
          currentIndex += 1;
        }
        if (currentIndex < commandsLen) {
          run()
        }
      }

      if (type === 'comment') {
        this.commands[currentIndex].atChar = textLen
        this.display()
        this.pause = setTimeout(() => {
          iterate(true)
        }, 300)
      } else if (type === 'command') {
        this.pause = setTimeout(() => {
          this.display()
          this.commands[currentIndex].atChar = command.atChar || 0
          if (command.atChar < textLen) {
            this.commands[currentIndex].atChar += 1
            iterate(false)
          } else {
            this.commands[currentIndex].complete = true
            iterate(true)
          }
        }, 80)
      }
    }

    run()
  }

  render() {
    return (
      <div>
        { this.state.output }
      </div>
    )
  }
}

const FakeButton = () => (
  <div css={{
    height          : '10px',
    width           : '10px',
    borderRadius    : '50%',
    border          : 0,
    position        : 'relative',
    top             : '2px',
    marginLeft      : '5px',
    left            : '5px',
    backgroundColor : presets.brandLight,
    display         : 'inline-block'
  }}></div>
);

const Terminal = ({ to, overrideCSS, commands }) => (
  <div
    css={{
      width      : '100%',
      minHeight  : '250px',
      fontFamily : 'monaco',
      fontSize   : '13px',
      ...overrideCSS
    }}
  >
    <div css={{
      width                : '100%',
      boxSizing            : 'border-box',
      height               : '25px',
      backgroundColor      : '#f2f2f2',
      margin               : '0 auto',
      borderTopRightRadius : '5px',
      borderTopLeftRadius  : '5px',
    }}>
      <FakeButton/><FakeButton/><FakeButton/>
    </div>
    <div css={{
      backgroundColor : '#272727',
      width           : '100%',
      height          : '100%',
      padding         : '12px 10px 10px 10px',
    }} id="text">
      <TerminalParseCommands commands={commands}/>
    </div>
  </div>
)

export  default Terminal
