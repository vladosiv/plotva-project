import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Contact } from '../Contact/Contact';
import { connect } from 'react-redux';
import { setCurrentRoom, goToDialog } from '../../store/actions/messagesActions';
import { toggleUser } from '../../store/actions/userActions';


import './Contacts.css';

class ContactsComponent extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
    };
  }

  goToDialog = contact => async e => {
    this.props.dispatch(goToDialog(contact));
    this.props.history.push(`/chat`);
  };

  toggle = contact => {
    this.props.dispatch(toggleUser(contact));
  }

  render() {
    const {contacts, currentUserSearch, user, withToggle, withSearch} = this.props;
    return (
      <React.Fragment>
        <div className="contacts">
          {
            contacts.map((contact, index) => {
              
              const props = {};
              if (user) {
                props.onClick = withToggle ? () => this.toggle(contact) : this.goToDialog(contact);
              } else {
                props.onClick = () => this.props.dispatch(setCurrentRoom(contact._id));            
                props.link = `/chat`;
              }

              const shouldRender = withSearch
              ? contact.name.toLowerCase().indexOf(currentUserSearch.toLowerCase()) >= 0
              : true;

              if (!contact.name){ contact.name = 'Nameless User' }
              
              if (shouldRender) {
                return <Contact key={index} color={`${index}`} {...props} {...contact} />;
              }

              return null;
            })
          }
          {this.state.error}
        </div>
      </React.Fragment>
    );
  }
}

const stateToProps = state => ({
  currentUserSearch: state.user.currentUserSearch
});

export const Contacts = withRouter(connect(stateToProps)(ContactsComponent));
