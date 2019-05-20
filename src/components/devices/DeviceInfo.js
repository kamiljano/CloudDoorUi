import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  Button,
  ListGroup,
  ListGroupItem
} from "shards-react";

class DeviceInfo extends React.Component {

  constructor({id}) {
    super();
    this.id = id;

    this.state = {
      data: {
          lastConnected: null,
          os: {
              version: null,
              type: null
          },
          currentUser: null,
          online: false
      }
    };
  }

  componentDidMount() {
    this.fetchDetails()
        .then(data => this.setState({ data }));
  }

  fetchDetails() {
      return fetch(`${process.env.REACT_APP_ADMIN_API_BASE}/bots/${this.id}`)//TODO: error handling (display loading state and error state)
          .then(result => result.json());
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
                OS
              </strong>
              <span>{this.state.data.os.version}</span>
            </ListGroupItem>
          </ListGroup>
        </Card>
    );
  }
}

export default DeviceInfo;
