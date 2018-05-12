import React from 'react';
import { connect } from 'react-redux';
import './ChatInput.css';
import { setChatName } from '../../store/actions/messagesActions';

const stateToProps = state => ({});

export const ChatInput = connect(stateToProps)(
  class ChatInput extends React.Component {
    constructor(props) {
      super(props);
      this.getNewChatName = this.getNewChatName.bind(this);
    }

    getNewChatName(event) {
      this.props.dispatch(setChatName(event.target.value));
    }

    render() {
      return (
        <input
          className="search"
          type="search"
          placeholder="Enter new unique chat name."
          onChange={this.getNewChatName}
        />
      );
    }
  },
);
