import React from "react";

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
    return <span>{this.state.online ? 'online' : 'offline'}</span>;
  }

}

export default FileBrowser;
