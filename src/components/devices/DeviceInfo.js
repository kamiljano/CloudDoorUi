import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  Button,
  ListGroup,
  ListGroupItem
} from "shards-react";

class DeviceInfo extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: {
          lastConnected: null,
          os: {
              version: null,
              type: null
          },
          currentUser: null,
          cpus: []
      }
    };
  }

  updateData(data) {
    this.setState({data});
  }

  render() {
    return (
      <Card small className="mb-4 pt-3">
          <ListGroup flush>
            <ListGroupItem className="p-4">
              <strong className="text-muted d-block mb-2">
                Last connected
              </strong>
              <span>{this.state.data.lastConnected}</span>
            </ListGroupItem>
            <ListGroupItem className="p-4">
              <strong className="text-muted d-block mb-2">
                Current User
              </strong>
              <span>{this.state.data.currentUser}</span>
            </ListGroupItem>
            <ListGroupItem className="p-4">
              <strong className="text-muted d-block mb-2">
                OS
              </strong>
              <span>{this.state.data.os.version}</span>
            </ListGroupItem>
            <ListGroupItem className="p-4">
              <strong className="text-muted d-block mb-2">
                CPUs
              </strong>
              {this.state.data.cpus.map(cpu => (
                <span>
                  <span>{cpu.name}</span>
                  <br/>
                  <span>{cpu.cores} cores, {cpu.frequency} MHz</span>
                </span>
              ))}
            </ListGroupItem>
          </ListGroup>
        </Card>
    );
  }
}

export default DeviceInfo;
