import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Layout } from '../Layout/Layout';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { SearchInput } from '../SearchInput/SearchInput';
import { ChatInput } from '../ChatInput/ChatInput';
import { UserList } from '../UserList/UserList';
import { ChatsPage } from '../ChatsPage/ChatsPage';
import { Chat } from '../Chat/Chat';
import { ChatForm } from '../ChatForm/ChatForm';
import { ProfilePage } from '../ProfilePage/ProfilePage';
import { Init } from '../Init/Init';
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
    header={<Header type="contacts" title="Contacts" subtitle="" createChat />}
    content={
      <React.Fragment>
        <ChatInput />
        <UserList createChat />
      </React.Fragment>
    }
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
        <Route exact path="/chat/:id" component={DialogPage} />
        <Route exact path="/init/create/:name" component={Init} />
        <Route exact path="/init/join/:roomId" component={Init} />
        <Route exact path="/profile" component={ProfileView} />
        <Route exact path="/create_chat" component={CreateChatPage} />
      </Switch>
    );
  }
}
