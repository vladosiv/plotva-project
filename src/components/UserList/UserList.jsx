import React, { PureComponent } from 'react';

import { Contacts } from '../Contacts/Contacts';
import { InfiniteScroller } from '../InfiniteScroller/InfiniteScroller';
import { Contact } from '../Contact/Contact';
import { SectionTitle } from '../SectionTitle/SectionTitle';

import { addUsers, setNext, toggleUser, deselectUsers } from '../../store/actions/userActions';
import { Loader } from '../Loader/Loader';
import { Error } from '../Error/Error';
import { FETCH_CONTACTS_ERROR } from '../../errorCodes';
import { connect } from 'react-redux';

import api from '../../../src/api.js';

class UserListComponent extends PureComponent {
  constructor() {
    super();
    this.state = {
      error: null,
    };
    this.fetchNext = this.fetchNext.bind(this);
    this.addToChat = this.addToChat.bind(this);
  }

  async componentDidMount() {
    if(!this.props.users.length){
      this.fetchNext();
    }
  }

  componentWillUnmount() {
    if (this.props.selectedUsers.length) {
      this.props.dispatch(deselectUsers());   
    }
  }

  async fetchNext() {
    const next = this.props.next;
    if (next === null) {
      return;
    }
    try {
      let resp = await api.getUsers(next);
      this.props.dispatch(addUsers(resp.items));
      this.props.dispatch(setNext(resp.next));
    } catch (err) {
      console.error(err);
      this.setState({ error: err });
    }
  }

  addToChat(contact) {
    this.props.dispatch(toggleUser(contact));
  }

  render() {
    const { error } = this.state;
    const { users, user, createChat, editChat, current } = this.props;
    if (!users.length && !error) {
      return <Loader />;
    }
    const newUsers = [...users];
    const currentUserIndex = users.indexOf(users.find(item => item._id === user._id));

    if (currentUserIndex > -1) {
      newUsers.splice(currentUserIndex, 1)
    }
    
    return (
      <React.Fragment>
        {
          createChat || editChat
          ? false
          : (
            <Contact
              name={user.name}
              content={user.phone}
              img={user.img}
              size="large"
              contentType="message"
              color="7"
            />
          )
        }
        <SectionTitle title="Contacts" />        
        <InfiniteScroller
          loadMore={this.fetchNext}
          className={createChat ? 'infinite-scroller_chat-create' : 'infinite-scroller_contacts'}
          next={this.props.next}
        >
          <Contacts
            type="contactList"
            contacts={newUsers}
            user={user}
            search={current}
            addToChat={this.addToChat}
            createChat={createChat}
          />
          {error ? <Error code={FETCH_CONTACTS_ERROR} /> : null}
        </InfiniteScroller>
      </React.Fragment>
    );
  }
}

const stateToProps = state => ({
  user: state.user.user,
  users: state.user.users,
  next: state.user.next,
  selectedUsers: state.user.selectedUsers,
  current: state.search.currentUserSearch,
});

export const UserList = connect(stateToProps)(UserListComponent);
