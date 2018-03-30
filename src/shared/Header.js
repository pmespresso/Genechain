
'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import logo from './logo.png';
import { Container, Row, Col, Button } from 'reactstrap';
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import FontAwesome from 'react-fontawesome';
import { Particles } from 'react-particles-js';


const headerStyle = {
  backgroundImage: `linear-gradient(to bottom, #16222A, #3A6073)`,
  height: 800,
  display: 'flex',
  alignItems: 'center'
}

const textStyle = {
  color: '#fff'
}

const imgStyle = {
  maxHeight: 200,
  width: 100
}

const buttonStyle = {
  position: 'relative',
  marginTop: 30,
  padding: 10,
  width: 250,
  backgroundColor: '#E0CA3C',
  borderWidth: 3,
  borderColor: '#E0CA3C',
  height: 60
}

export default class Header extends Component {

  componentDidMount = () => {
    if(typeof window !== 'undefined') {
      window.WOW = require('wowjs');
    }
    new WOW.WOW().init();
  }


  render() {
    return (
      <div>
        <header className="App-header" style={headerStyle}>
          <Col xs="2" sm="1" md="1"></Col>
          <Col xs="8" sm="10" md="10">
            <img src={logo} className="App-logo" alt="logo" style={imgStyle} />
            <h1 className="App-title" style={textStyle}>Welcome to GeneChain</h1>
            <h4 style={textStyle}>Your genes make your source code. Guard it wisely.</h4>
            <h4 style={textStyle}>Store your Awakens gene analysis data on a distributed database, protected with modern cryptography.</h4>

            <Link activeClass="active" className="test1" to="test1" spy={true} smooth={true} duration={500} style={{zIndex: 1000, position: 'relative', color: "#fff"}}>
              <Button onClick={this.scrollTo} className="btn btn-lg" style={buttonStyle}>
                  Get Started
              </Button>
            </Link>
          </Col>
        </header>
        <Particles
          params={particleParams}
          style={{zIndex: 1, position: 'absolute', top: 0, left: 0}}
          />
      </div>
    );
  }
}


const particleParams = {
    "particles": {
      "number": {
        "value": 58,
        "density": {
          "enable": true,
          "value_area": 631.3181133058181
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 3
        }
      },
      "opacity": {
        "value": 0.5,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 40,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 240.5118091298284,
        "color": "#ffffff",
        "opacity": 0.20844356791251797,
        "width": 1.022388442605866
      },
      "move": {
        "enable": true,
        "speed": 5,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "bounce": true,
        "attract": {
          "enable": false,
          "rotateX": 1683.5826639087988,
          "rotateY": 1200
        }
      }
    },
    "retina_detect": true
}
