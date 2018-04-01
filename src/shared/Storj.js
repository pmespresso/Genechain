'use strict';
import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import StorjBuckets from './StorjBuckets';

const rowStyle = {
  minHeight: 500,
  display: 'flex col',
  padding: 100
}

const subheaderStyle = {
  fontSize: 45,
  fontWeight: 350,
  textAlign: 'center'
}

const textStyle = {
  fontSize: 20
}

const tableStyle = {
  marginTop: 80,
  maxWidth: '100%',
  maxHeight: '100%'
}

const buttonStyle = {
  backgroundColor: "transparent",
  borderColor: "#048A81",
  color: "#048A81",
  height: 60,
  width: 200
}

const centerStyle = {
  margin: '0 auto'
}

export default class Storj extends Component {

  constructor(props) {
    super(props);

    this.state = {

    }
  }

  handleUpload = () => {
    if (localStorage.reports) {
      fetch('/reports/save', {
        method: 'POST',
        body: JSON.parse(localStorage.reports),
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then((res) => {
          if (res) {
            console.log('in here mother: ', res.json);
            fetch('/files/upload')
              .then((res) => {
                console.log('file upload res => ', res);
                this.setState({
                  uploadSuccess: true
                })
              });
          }
        })
        .catch(err => {
          if (err) { console.log('You probably need to connect to Storj'); }
        })
    }
  }

  handleListFilesInBucket = () => {
    console.log('hallo');
    fetch('/files/list')
      .then((res) => {
        res.body.on('data', (chunk) => {
          console.log('recieved a chunk: ');
          console.log(chunk);
        });

        // this.setState({
        //   files: res
        // })
      })
  }

  render() {
    return (
      <Row style={rowStyle}>
        <Col sm="1" md="1" className="offset"></Col>
        <Col xs="10" sm="10" md="10">
          <p className="header" style={subheaderStyle}> Safely Upload to Storj </p>

          <Button onClick={this.props.storjBasicAuth} style={buttonStyle}> Connect to Storj </Button>
          <div className="storj-buckets">
              <h3 style={textStyle}>  Choose Bucket </h3>
            <div id="list-buckets-area">

              <ul>
                {
                  this.props.buckets.length > 0
                  ?
                  <StorjBuckets selected={this.props.selectedBucketId} buckets={this.props.buckets} onSelectBucket={this.props.onSelectBucket} />
                  :
                  null
                }
              </ul>
            </div>

            <hr />
          </div>
          <Col sm="1" md="1" className="offset"></Col>
          <Col xs="10" sm="10" md="10" className="upload">
            <p className="lead"> For this demo you can only upload to this test account, because Storj itself is limiting new account creation at the moment due to network congestion. In the future you'll be able to log in to your own Storj account. </p>

            <Button style={buttonStyle} onClick={this.handleUpload}> Upload </Button>
            <Button style={buttonStyle} onClick={this.handleListFilesInBucket} > View Files on Storj </Button>
          </Col>
        </Col>

        <Col sm="1" md="1" className="offset"></Col>
        <Col xs="10" sm="10" md="10" className="list-files">
          <div>
            {
              this.state.uploadSuccess
              ?
              <p className='lead' style={{color: 'green'}}> Upload Success! </p>
              :
              <p className='lead' style={{color: 'orange'}}> Double check that you are connected to Storj </p>
            }
          </div>
        </Col>

      </Row>
    );
  }
}
