'use strict';

import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import DownloadLink from "react-download-link";

export default class GenelinkDownload extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filename: ''
    }
  }

  handleDownload = () => {
    let body = window.localStorage.getItem('reports');

    fetch('/save', {
      body: body,
      credentials: 'same-origin',
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST'
    })
      .then((res) => {
        console.log('saved -> ', res.body)

        // this.setState({
        //   filename: res.body
        // })

        window.location = res.body;
        return res.body;
      });
  }

  render() {
    return (
      <Col xs="5" sm="6" className="download">
        <div className="title">
          <h4> 2. </h4><p> Download For Your Safe Keeping</p>
        </div>
          <small>Warning: Make sure you store this somewhere safe. Hint, scroll below. </small> <br/><hr/>
          <Button color="danger" onClick={this.handleDownload}>

          <DownloadLink
                filename={this.state.filename}
                exportFile={() => this.state.file}
            >
                    Save to disk
            </DownloadLink>

          </Button>
      </Col>
    );
  }
}
