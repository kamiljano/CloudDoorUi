import React from "react";
import { Container, Row, Col, Card, CardBody } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import DeviceListContainer from "../components/devices/DeviceListContainer";

class Devices extends React.Component {

  render() {
    return (
      <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title="Infected Devices" className="text-sm-left" />
      </Row>

      {/* Default Light Table */}
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardBody className="p-0 pb-3">
              <table className="table mb-0 selectable">
                <thead className="bg-light">
                  <tr>
                    <th scope="col" className="border-0">
                      Online
                    </th>
                    <th scope="col" className="border-0">
                      ID
                    </th>
                    <th scope="col" className="border-0">
                      OS
                    </th>
                    <th scope="col" className="border-0">
                      Current user
                    </th>
                    <th scope="col" className="border-0">
                      Registration Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <DeviceListContainer />
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
    );
  }
}

export default Devices;
