import React from "react";

import {
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Row,
  Col
} from "shards-react";

import FileBrowser from './FileBrowser';

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
    this.onlineRef.current.setOnline(online);
  }

  render() {
    return (
      <Card small className="mb-4">
        <CardHeader className="border-bottom">
          <h6 className="m-0">File Browser</h6>
        </CardHeader>
        <ListGroup flush>
          <ListGroupItem className="p-3">
            <Row>
              <Col>
                <FileBrowser id={this.id} ref={this.onlineRef} />
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
      </Card>
    );
  }

}

export default DeviceOperations;
