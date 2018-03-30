import React, { Component } from 'react';
import { Table, Badge, Col, Row, Button } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import './GenelinkPreview.css';
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';



const rowStyle = {
  minHeight: 500,
  display: 'flex col',
  padding: 100,
  alignItems: 'center',
  justifyContent: 'spaceBetween'
}

const subheaderStyle = {
  fontSize: 45,
  fontWeight: 350,
  textAlign: 'center'
}

const textStyle = {
  fontSize: 20
}

const buttonStyle = {
  backgroundColor: "transparent",
  borderColor: "#048A81",
  color: "#048A81",
  height: 60,
  width: 200
}

export default class GenelinkPreview extends Component {

  constructor(props) {
    super(props);

    this.state = {
      reports: []
    };
  }

  componentDidMount = () => {
    console.log(window.__genes__);

    if(typeof window !== 'undefined') {
      window.WOW = require('wowjs');
    }
    new WOW.WOW().init();

    if (window.__genes__) {
      window.localStorage.setItem('reports', JSON.stringify(window.__genes__));
    } else {
      var genes = window.localStorage.getItem('reports');
      if (genes) {
        genes = JSON.parse(genes);
      }
    }

    this.setState({
      reports: genes ? genes : window.__genes__
    });

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


  genelinkAuth = () => {
    fetch('/authorize')
      .then(res => res.json())
      .then((result) => {
        console.log(result[0].url);
        window.location = result[0].url;
      })
      .catch(err => {
        console.log('err -> ', err);
      })
  }

  render() {

    return (

      <Row className="row genelink-preview" style={rowStyle}>

        <Col xs="2" sm="2" className="offset"></Col>
        <Col xs="8" sm="8" className="wow slideInUp" data-wow-duration="2s">
          <h2 style={subheaderStyle}> Preview Your Genome Analysis</h2>
          <Button onClick={this.genelinkAuth} style={buttonStyle}  > Connect to GenomeLink  </Button>

          {
            this.state.reports
            ?
            <Table responsive className="genes_table">
              <thead className="genes_header">
                <tr>
                  <th>Phenotype Name</th>
                  <th>Summary</th>
                  <th>Category</th>
                  <th>Population</th>
                </tr>
              </thead>

                <tbody>
                {
                  this.state.reports.map((row, index) => {
                      return (
                        <tr className='genes_row'
                            key = {index}
                            >
                            <td>{row._data.phenotype.display_name}</td>
                            <td>{row._data.summary.text}</td>
                            <td>{row._data.phenotype.category}</td>
                            <td>{row._data.population}</td>
                        </tr>
                      )
                  })
                }
                </tbody>
            </Table>
            :
            null
          }

        </Col>

      </Row>

    );
  }

}
