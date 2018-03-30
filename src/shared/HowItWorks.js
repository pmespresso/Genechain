
'use strict';

import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import './App.css';

import howitworksDiagram from './howitworks.png';

const rowStyle = {
  minHeight: 500,
  display: 'flex col',
  paddingTop: 80
}

const subheaderStyle = {
  fontSize: 45,
  fontWeight: 350,
  textAlign: 'center'
}

const textStyle = {
  fontSize: 20
}

const diagramStyle = {
  marginTop: 80,
  maxWidth: '100%',
  maxHeight: '100%'
}


export default class HowItWorks extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    if(typeof window !== 'undefined') {
      window.WOW = require('wowjs');
    }
    new WOW.WOW().init();
  }

  render() {
    return (
      <Row className="row how_it_works wow" ref="how_it_works" style={rowStyle}>
        <Col xs="3" sm="3" className="offset"> </Col>
        <Col xs="6" sm="6" className="wow fadeIn" data-wow-duration="2s" style={{visibility: 'hidden'}}>
          <h1 style={subheaderStyle}>How this works</h1>

          <hr />

          <p style={textStyle}> This is meant to demonstrate how easily one can upload one's data of any kind to Storj using the Storj Bridge Client.
            In reality, Awakens would have to integrate Storj into their backend to store all customer data on a distributed database,
            rather than risk corrupted or stolen data.
           </p>

           <img src={howitworksDiagram} style={diagramStyle} />


        </Col>

        <Col xs="3" sm="3" className="offset"></Col>
      </Row>

    );
  }
}
