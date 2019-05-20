import React from "react";
import { Route } from "react-router-dom";

const DeviceList = props => {
    return props.devices.map(device => {
        return (
            <Route key={device.id} render={({history}) => (
                <tr onClick={() => history.push('/devices/' + device.id)}>
                    <td style={{textAlign: 'center', width: '2em'}}><i className="material-icons" style={{textAlign: 'center', width: '2em'}}>{device.online ? 'stars' : 'start_border'}</i></td>
                    <td>{device.id}</td>
                    <td>{device.os && device.os.version}</td>
                    <td>{device.currentUser}</td>
                    <td>fix me</td>
                </tr>
            )}/>
        );
    });
}

class DeviceListContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            devices: []
        }
    }

    componentDidMount() {
        this.fetchDevices()
            .then(devices => this.setState({ devices }));
    }

    fetchDevices() {
        return fetch(`${process.env.REACT_APP_ADMIN_API_BASE}/bots`)//TODO: error handling (display loading state and error state)
            .then(response => response.json());
    }

    render() {
        return <DeviceList devices={this.state.devices} />;
    }
}

export default DeviceListContainer; 