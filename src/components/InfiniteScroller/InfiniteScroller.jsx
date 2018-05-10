import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import debounce from 'debounce';
import { Loader } from '../Loader/Loader';

import './styles.css';

export class InfiniteScroller extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
    this.container = null;
    this.handleScroll = debounce(this.handleScroll.bind(this), 100);
    this.loadMore = this.loadMore.bind(this);
    this.setRef = this.setRef.bind(this);
  }

  componentDidMount() {
    document.body.addEventListener('scroll', this.handleScroll, { passive: true, capture: true });
    const element = ReactDOM.findDOMNode(this);

    if (this.props.reverse) {
      element.scrollTop = element.scrollHeight;
    }
    if (element.scrollTop === 0 && this.props.next) {
      this.loadMore();
    }
  }

  componentWillUpdate() {
    const element = ReactDOM.findDOMNode(this);
    this.shouldScrollBottom = element.scrollTop + element.offsetHeight === element.scrollHeight && this.props.reverse;
  }
   
  componentDidUpdate() {
     if (this.shouldScrollBottom) {
       const element = ReactDOM.findDOMNode(this);
       element.scrollTop = element.scrollHeight
     }
     
  }

  componentWillUnmount() {
    document.body.removeEventListener('scroll', this.handleScroll, { capture: true });
  }

  handleScroll() {
    if (this.container && this.props.next) {
      const scrollTop = this.container.scrollTop;
      const scrollHeight = this.container.scrollHeight;
      const clientHeight = this.container.clientHeight;
      if (!this.state.isLoading) {
        const shouldLoadMore = !this.props.reverse
                   ? scrollHeight <= scrollTop + clientHeight + 50
                   : scrollTop < 100;
        if (shouldLoadMore) {
          this.loadMore();
        }
      }
    }
  }

  loadMore() {
    this.setState({
      isLoading: true,
    });

    this.props
      .loadMore()
      .catch(error => console.log('Error', error))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  setRef(node) {
    this.container = node;
  }

  render() {
    return  (
      <div className={`infinite-scroller ${this.props.className || ''}`} ref={this.setRef}>
        {
          this.state.isLoading && this.props.reverse ?
          <Loader />
          : false
        }
        {this.props.children}
        {
          this.state.isLoading && !this.props.reverse ?
          <Loader />
          : false
        }
      </div>
    );
  }
}
