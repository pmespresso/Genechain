import React, { Component } from 'react';
import { Table, Badge, Col, Row, Button } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import './GenelinkPreview.css';

export default class GenelinkPreview extends Component {

  constructor(props) {
    super(props);

    this.state = {
      reports: []
    };
  }

  componentDidMount = () => {
    console.log(window.__genes__);

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
        <Col xs="5" sm="6" md="6" lg="6" className="preview">
          <div className="title">
            <h4> 1. </h4><p> Preview Your Genome Analaysis</p>
          </div>
          <div className="choices">
            <Button color="success" onClick={this.genelinkAuth}> Connect to GenomeLink  </Button>
          </div>
          {
            this.state.reports
            ?
            <Table responsive bordered className="genes_table">
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
    );
  }

}
