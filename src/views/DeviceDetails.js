import React from "react";
import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import DeviceInfo from "../components/devices/DeviceInfo";
import UserAccountDetails from "../components/user-profile-lite/UserAccountDetails";

class DeviceDetails extends React.Component {
    constructor(props) {
        super();
        this.id = props.match.params.id;

        this.detailsRef = React.createRef();
        
        this.state = {
            online: false
        };
    }

    componentDidMount() {
        this.fetchDetails()
            .then(data => {
                this.setState({
                    id: this.state.id,
                    online: data.online
                });
                this.detailsRef.current.updateData(data);
            });
    }

    fetchDetails() {
        return fetch(`${process.env.REACT_APP_ADMIN_API_BASE}/bots/${this.id}`)//TODO: error handling (display loading state and error state)
            .then(result => result.json());
    }

    render() {
        return (
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                    <PageTitle title={(this.state.online ? "[ONLINE]" : "[OFFLINE]") + " - " + this.id} md="12" className="ml-sm-auto mr-sm-auto" />
                </Row>
                <Row>
                <Col lg="4">
                    <DeviceInfo ref={this.detailsRef}/>
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
