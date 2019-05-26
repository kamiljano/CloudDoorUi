import React from "react";

import {
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Row,
  Col
} from "shards-react";

import FileBrowser from './files/FileBrowser';

class DeviceOperations extends React.Component {

  constructor({id}) {
    super();

    this.id = id;

    this.onlineRef = React.createRef();

    this.state = {
      online: false
    };
  }

  setOnline(online) {
    this.setState({online});
    if (this.onlineRef.current) {
      this.onlineRef.current.setOnline(online);
    }
  }

  render() {

    const content = this.state.online ?
      (
        <FileBrowser id={this.id} ref={this.onlineRef} />
      ) : (
        <span>Operations unavailable when the device is offline</span>
      );

    return (
      <Card small className="mb-4">
        <CardHeader className="border-bottom">
          <h6 className="m-0">File Browser</h6>
        </CardHeader>
        <ListGroup flush>
          <ListGroupItem className="p-3" style={{height: 600}}>
            {content}
          </ListGroupItem>
        </ListGroup>
      </Card>
    );
  }

}

export default DeviceOperations;
