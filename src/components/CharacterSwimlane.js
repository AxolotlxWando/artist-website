import React, { Component, PropTypes } from 'react'
import Act from 'components/Act'

import 'sass/components/character-swimlane.scss'

class CharacterSwimlane extends Component {
  render () {
    return (
      <div>
        <div className={'CharacterSwimlane'}>
          CharacterSwimlane Header
        </div>
        <Act key={'laughing out loud'} />
        <Act key={'punch in the face'} />
      </div>
    )
  }
}

CharacterSwimlane.PropTypes = {
  key: PropTypes.string.isRequired
}

export default CharacterSwimlane
