import React, { Component } from 'react';
import { Table, Badge } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import './StorjBucket.css';

export default class StorjBuckets extends Component {
  selectBucket = (param) => (e) => {
    console.log('event -> ', e);
    console.log('param -> ', param);
    // this.props.onSelectBucket(param);

    var row = this.refs[param];

    console.log('row -> ', row);

    switch (row.firstChild.firstChild.style.display) {
      case 'block':
        row.firstChild.firstChild.style.display = 'none';
        break;
      case 'none':
        console.log(typeof this.refs);

        // for (var ref in this.refs) {
        //   console.log('ref -> ', ref);
        //
        //   this.refs[ref].firstChild.firstChild.style.display = 'none';
        // }

        row.firstChild.firstChild.style.display = 'block';
        break;
      default:
        break;
    }
  }

  render() {
    return (

      <Table responsive striped bordered hover className="buckets_table">
        <thead className="buckets_header">
          <tr>
            <th>Selected</th>
            <th>Bucket ID</th>
            <th>Bucket Name</th>
            <th>Created</th>
            <th>User</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
        {
          this.props.buckets.length > 0
          ?
          this.props.buckets.map((bucket, index) => {
            return (
                <tr className='bucket_row'
                    onClick={this.selectBucket(bucket.id)}
                    ref = {bucket.id}
                    key = {index}
                    >
                    <td key={index*10-4} ><Badge style={{display: 'none'}} pill color="success"><FontAwesome
                            className='check'
                            name='bolt'
                            size='2x'
                            spin
                          /></Badge></td>
                <td key={bucket.id}>{bucket.id}</td>
                <td key={bucket.name}>{bucket.name}</td>
                <td key={bucket.created}>{bucket.created}</td>
                <td key={bucket.user}>{bucket.user}</td>
                <td key={bucket.status}>{bucket.status}</td>
                </tr>
            )
          })
          :
          null
        }
        </tbody>
      </Table>
    );
  }
}
