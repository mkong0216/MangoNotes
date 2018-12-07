import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'

class Loading extends React.Component {
  render () {
    return (
      <Dimmer active inverted>
        <Loader> Loading </Loader>
      </Dimmer>
    )
  }
}

export default Loading
