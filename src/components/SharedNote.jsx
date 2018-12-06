import React from 'react'
import { Header, Image } from 'semantic-ui-react'
import mangonotes from '../images/icon-1.png'
import '../css/SharedNote.css'

class SharedNote extends React.Component {
  render () {
    return (
      <div className="shared">
        <Header as="h2" dividing>
          <Image src={mangonotes} />
          MangoNotes 
          <Header.Subheader> </Header.Subheader>
        </Header>
      </div>
    )
  }
}

export default SharedNote
