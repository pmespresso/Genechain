'use strict';

import React, { Component } from 'react';
import logo from './logo.png';
import { Container, Row, Col, Button } from 'reactstrap';
// import Footer from './Footer';
import FontAwesome from 'react-fontawesome';

import './App.css';
import GenelinkPreview from './GenelinkPreview';
import StorjBuckets from './StorjBuckets';
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

  componentDidMount = () => {
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

            <GenelinkDownload />


          </Row>

          <hr/>

          <Row className="row section_2__storj">

          <Col xs="12" sm="12" >
          <h1 className="header"> This is Where You Can Safely Store Your Genes on Storj. </h1>
          </Col>
            <Col xs="2" sm="2" className="storj-auth">
              <div className="title">
                <h4> 1. </h4>  <p>  Connect to Storj </p>
              </div>
              <Button color="primary" onClick={this.storjBasicAuth}> Connect to Storj </Button>
            </Col>
            <Col xs="9" sm="9" className="storj-buckets">
              <div className="title">
                <h4> 2. </h4>  <p>  Choose Bucket </p>
              </div>
              <div id="list-buckets-area">

                <ul>
                {
                  this.state.buckets.length > 0
                  ?
                  <StorjBuckets selected={this.state.selectedBucketId} buckets={this.state.buckets} onSelectBucket={this.onSelectBucket} />
                  :
                  null
                }
                </ul>
              </div>

              <hr />
            </Col>
            <Col xs="12" sm="12" className="upload">
              <div className="title">
                <h4> 3. </h4>  <p> Upload! </p>
              </div>
              <Button color="info"> Upload </Button>
              <Button color="link" style={{display: 'none'}}> View on Storj </Button>
            </Col>
          </Row>

        </div>
      </div>
    )
  }
}
