import React from "react";
import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import DeviceInfo from "../components/devices/DeviceInfo";
import UserAccountDetails from "../components/user-profile-lite/UserAccountDetails";

class DeviceDetails extends React.Component {
    constructor(props) {
        super();
        this.id = props.match.params.id;
    }

    render() {
        return (
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                <PageTitle title={this.id} md="12" className="ml-sm-auto mr-sm-auto" />
                </Row>
                <Row>
                <Col lg="4">
                    <DeviceInfo id={this.id}/>
                </Col>
                <Col lg="8">
                    <UserAccountDetails />
                </Col>
                </Row>
            </Container>
        );
    }
}
  
export default DeviceDetails;
