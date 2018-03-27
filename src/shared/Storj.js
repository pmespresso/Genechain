'use strict';
import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import StorjBuckets from './StorjBuckets';

export default class Storj extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Col xs="6" sm="6">
        <p className="header"> 2. Safely Upload to Storj </p>

        <Button color="primary" onClick={this.props.storjBasicAuth}> Connect to Storj </Button>
        <div className="storj-buckets">
          <div className="title">
            <p>  Choose Bucket </p>
          </div>
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
        <Col xs="12" sm="12" className="upload">
          <div className="title">
            <h4> 3. </h4>  <p> Upload! </p>
          </div>
          <Button color="info"> Upload </Button>
          <Button color="link" style={{display: 'none'}}> View on Storj </Button>
        </Col>
      </Col>
    );
  }
}
