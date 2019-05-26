class OperationClient {

    constructor(clientId) {
        this.clientId = clientId;
    }

    runCommand(body) {
        return fetch(`${process.env.REACT_APP_ADMIN_API_BASE}/bots/${this.clientId}/command`, {
            method: 'POST', 
            body: JSON.stringify(body), 
            headers:{
              'Content-Type': 'application/json'
            }
          }).then(res => res.json());
    }
}

export default OperationClient;