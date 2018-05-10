import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout } from '../Layout/Layout';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { SearchInput } from '../SearchInput/SearchInput';
import { ChatInput } from '../ChatInput/ChatInput';
import { UserList } from '../UserList/UserList';
import { ChatUserList } from '../ChatUserList/ChatUserList';
import { ChatsPage } from '../ChatsPage/ChatsPage';
import { Chat } from '../Chat/Chat';
import { ChatForm } from '../ChatForm/ChatForm';
import { ProfilePage } from '../ProfilePage/ProfilePage';
import { Login } from '../Login/Login';

const ContactsPage = () => (
  <Layout
    header={<Header type="contacts" title="Contacts" subtitle="" />}
    content={
      <React.Fragment>
        <SearchInput />
        <UserList />
      </React.Fragment>
    }
    footer={<Footer path="Contacts" />}
  />
);

const ChatView = () => (
  <Layout
    header={<Header type="chats" title="Chats" subtitle="" />}
    content={<ChatsPage />}
    footer={<Footer path="Chats" />}
  />
);

const ProfileView = () => (
  <Layout
    header={<Header type="profile" title="Profile" subtitle="" />}
    content={<ProfilePage />}
    footer={<Footer path="Settings" />}
  />
);

const DialogPage = () => (
  <Layout
    header={<Header type="dialog" />}
    content={<Chat />}
    footer={<ChatForm />}
  />
);

const CreateChatPage = () => (
  <Layout
    header={<Header type="contacts" title="Contacts" subtitle="" withToggle toggleAction="newChat"/>}
    content={
      <React.Fragment>
        <ChatInput />
        <UserList withToggle />
      </React.Fragment>
    }
    footer={<Footer path="Chats" />}
  />
);

const AddToChatPage = () => (
  <Layout
    header={<Header type="contacts" title="Contacts" subtitle="" withToggle toggleAction="addToChat"/>}
    content={
      <UserList withToggle />
    }
    footer={<Footer path="Chats" />}
  />
);

const EditChatPage = () => (
  <Layout
    header={<Header type="contacts" title="Contacts" subtitle="" withToggle toggleAction="goToEdit"/>}
    content={<ChatUserList />}
    footer={<Footer path="Chats" />}
  />
);

export class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/chats" component={ChatView} />
        <Route exact path="/contacts" component={ContactsPage} />
        <Route exact path="/profile" component={ProfileView} />
        
        <Route exact path="/chat" component={DialogPage} />
        <Route exact path="/create_chat" component={CreateChatPage} />
        <Route exact path="/edit_chat" component={EditChatPage} />
        <Route exact path="/add_to_chat" component={AddToChatPage} />
        
      </Switch>
    );
  }
}
