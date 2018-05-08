import React from 'react';
import { connect } from 'react-redux';
import './SearchInput.css';
import { setSearch } from '../../store/actions/searchActions';

const stateToProps = state => ({
  current: state.search.user,
});

export const SearchInput = connect(stateToProps)(
  class SearchInput extends React.Component {
    constructor(props) {
      super(props);
      this.getSearchRequest = this.getSearchRequest.bind(this);
    }

    componentWillUnmount() {
      if(this.props.current) {
        this.props.dispatch(setSearch(''))
      };
    }

    getSearchRequest(e) {
      this.props.dispatch(setSearch(e.target.value));
    }

    render() {
      return (
        <input
          className="search"
          type="search"
          placeholder="Search for contacts or usernames"
          onChange={this.getSearchRequest}
        />
      );
    }
  },
);
