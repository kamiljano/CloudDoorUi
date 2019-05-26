import React from "react";
import { FileManager, FileNavigator } from '@opuscapita/react-filemanager';
import connectorNodeV1 from '@opuscapita/react-filemanager-connector-node-v1';
import FileBrowserApi from './FileBrowserApi';

const apiOptions = {
  apiRoot: "http://localhost:3020"//process.env.REACT_APP_ADMIN_API_BASE
};


class FileBrowser extends React.Component {

  constructor({id}) {
    super();
    this.id = id;

    this.state = {
      online: false
    };
  }

  setOnline(online) {
    this.setState({online});
  }

  render() {
    return ( 
      <FileManager>
        <FileNavigator
          id="filemanager-1"
          api={new FileBrowserApi(this.id)}
          apiOptions={apiOptions}
          capabilities={connectorNodeV1.capabilities}
          listViewLayout={connectorNodeV1.listViewLayout}
          viewLayoutOptions={connectorNodeV1.viewLayoutOptions}
        />
      </FileManager>
    );
  }

}

export default FileBrowser;
