import {Component} from 'relax-framework';
import React from 'react';

export default class Button extends Component {
  static propTypes = {
    label: React.PropTypes.string.isRequired,
    action: React.PropTypes.string.isRequired,
    actionProps: React.PropTypes.object.isRequired
  }

  static contextTypes = {
    addElementAtSelected: React.PropTypes.func
  }

  onClick (event) {
    event.preventDefault();

    if (this.props.action === 'addElement') {
      this.context.addElementAtSelected(this.props.actionProps);
    }
  }

  render () {
    return (
      <a href='#' className='button button-primary' onClick={this.onClick.bind(this)}>
        {this.props.label}
      </a>
    );
  }
}
