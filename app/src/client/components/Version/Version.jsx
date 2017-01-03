import React from 'react'
import { version } from '../../../../package.json'
import FlatButton from 'material-ui/FlatButton';

export default class Version extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {

    return (
      <FlatButton
        label={version}
        disabled={true}
        />
    )
  }
}
