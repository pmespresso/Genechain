'use strict';

import React, { Component } from 'react';
import logo from './logo.png';
import { Container, Row, Col, Button } from 'reactstrap';
// import Footer from './Footer';
import FontAwesome from 'react-fontawesome';

import './App.css';
import GenelinkPreview from './GenelinkPreview';
import Storj from './Storj';
import GenelinkDownload from './GenelinkDownload';

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

  componentDidMount() {
    if (localStorage.getItem('buckets')) {
      this.setState({
        buckets: JSON.parse(localStorage.getItem('buckets'))
      });
    }
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
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to GeneChain</h1>
          <p>Your genes make your source code. Guard it wisely.</p>
          <p>Store your Awakens gene analysis data on a distributed database, protected with modern cryptography.</p>

        </header>
        <div style={fluid}>
          <Row className="row how_it_works">
            <Col xs="6" sm="6">
              <p> This is meant to demonstrate how easily one can upload one's data of any kind to Storj using the Storj Bridge Client.
                In reality, Awakens would have to integrate Storj into their backend to store all customer data on a distributed database,
                rather than risk corrupted or stolen data.
               </p>
            </Col>

            <Col xs="6" sm="6">
            <FontAwesome
                    className='super-crazy-colors'
                    name='rocket'
                    size='2x'
                    spin
                    style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
                  />
            </Col>
          </Row>

          <Row className="row section_1__genechain">
            <GenelinkPreview />
            <Storj
              buckets={this.state.buckets || null}
              onSelectBucket={this.onSelectBucket}
              selectedBucketId={this.state.selectedBucketId || null}
              storjBasicAuth={this.storjBasicAuth}
                />
          </Row>

          <hr/>
        </div>
      </div>
    )
  }
}
