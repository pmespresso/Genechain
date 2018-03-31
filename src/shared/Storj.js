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

  handleUpload = () => {
    console.log('here');

    fetch('/files/upload')
      .then((res) => {
        console.log('file upload res => ', res);
        this.refs.file = res.body.file;
      });
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
            <Button style={buttonStyle} onClick={this.handleUpload}> Upload </Button>
            <Button style={buttonStyle}> View on Storj </Button>
          </Col>
        </Col>
      </Row>
    );
  }
}
