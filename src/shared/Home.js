'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.png';
import { Container, Row, Col, Button } from 'reactstrap';
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

// import Footer from './Footer';
import FontAwesome from 'react-fontawesome';

import './App.css';
import GenelinkPreview from './GenelinkPreview';
import Storj from './Storj';
import GenelinkDownload from './GenelinkDownload';
import HowItWorks from './HowItWorks';
import Header from './Header';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buckets: [
        {
          id: 1,
          name: 'example',
          created: '20180102-232891',
          user: 'YJ KIM',
          status: 'Active'
        }
      ]
    }
  }

  componentDidMount = () => {

    if (localStorage.getItem('buckets')) {
      this.setState({
        buckets: JSON.parse(localStorage.getItem('buckets'))
      });
    }

    Events.scrollEvent.register('begin', function () {
      console.log("begin", arguments);
    });

    Events.scrollEvent.register('end', function () {
      console.log("end", arguments);
    });
  }

  componentWillUnmount = () => {
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
  }

  scrollTo = () => {
    scroller.scrollTo('how_it_works', {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart'
    })
  }

  scrollToPreview = () => {
    scroller.scrollTo('genelink-preview', {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart'
    })
  }

  storjBasicAuth = () => {
    fetch('/user/authenticate/user-pass')
      .then(res =>  {
        if (res) {
          // get buckets
          fetch('/buckets/list')
            .then((buckets) => {
              buckets.json().then((res) => {
                this.setState({
                  buckets: res
                });

                localStorage.setItem('buckets', JSON.stringify(res));
              })

            })
        }
      })
      .catch(err => console.log(err));
  }

  onSelectBucket = (id) => {
    // should only be able to select one bucket
    this.setState({
      selectedBucketId: id
    });
  }

  render() {
    const fluid = {
      width: '100%',
      paddingRight: 15,
      paddingLeft: 15,
      marginRight: 'auto',
      marginLeft: 'auto'
    }

    return (
      <div className="App">
        <Header />
        <div style={fluid}>
          <HowItWorks />
          <GenelinkPreview />

            <Storj
              buckets={this.state.buckets || null}
              onSelectBucket={this.onSelectBucket}
              selectedBucketId={this.state.selectedBucketId || null}
              storjBasicAuth={this.storjBasicAuth}
                />

        </div>
      </div>
    )
  }
}
