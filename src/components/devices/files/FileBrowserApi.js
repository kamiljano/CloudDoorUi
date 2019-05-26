import request from 'superagent';
import OperationClient from './OperationClient'

const rootDir = Object.freeze({
  capabilities: [],
  createdTime: null,
  id: '',
  modifiedTime: null,
  name: 'Drives',
  type: 'dir',
  size: 0,
  parent: null,
  ancestors: []
});

const fileCapabilities = Object.freeze({
  canAddChildren: false,
  canCopy: true,
  canDelete: true,
  canDownload: true,
  canEdit: true,
  canListChildren: false,
  canRemoveChildren: false,
  canRename: true
});

const dirCapabilities = Object.freeze({
  canAddChildren: true,
  canCopy: true,
  canDelete: true,
  canDownload: true,
  canEdit: false,
  canListChildren: true,
  canRemoveChildren: true,
  canRename: true
});

const cache = async(key, cacheSource, getData) => {
  if (cacheSource[key]) {
    return cacheSource[key];
  }
  const result = await getData();
  cacheSource[key] = result;
  return result;
};

function normalizeResource(resource) {
    if (resource) {
      return {
        capabilities: resource.capabilities,
        createdTime: Date.parse(resource.createdTime),
        id: resource.id,
        modifiedTime: Date.parse(resource.modifiedTime),
        name: resource.name,
        type: resource.type,
        size: resource.size,
        parentId: resource.parentId ? resource.parentId : null,
        ancestors: resource.ancestors ? resource.ancestors : null
      };
    } else {
      return {};
    }
  }

const normalizePath = path => {
  let normalized = path.replace(/\\/g, '/');
  if (!normalized.endsWith('/')) {
    normalized += '/';
  }
  return normalized;
};

const isDrivePath = path => (path.match(/\//g) || []).length === 1;

const getFileParent = path => isDrivePath(path) ? null : path.match(/^(.+\/).+$/)[1];

class FileBrowserApi extends OperationClient {

  constructor(clientId) {
    super(clientId);
    this._driveCache = {};
    this._fileCache = {};
  }

  hasSignedIn() {
    return true;
  }
  
  init() {
    return {
      apiInitialized: true,
      apiSignedIn: true
    };
  }
  
  async getCapabilitiesForResource(options, resource) {
    return resource.capabilities || [];
  }

  async _buildAncestorsRecursively(path) {
    const mostRecentAncestor = await this.getResourceById(null, path);
    const parent = getFileParent(path);
    if (parent) {
      return (await this._buildAncestorsRecursively(parent)).concat(mostRecentAncestor);
    }
    return [mostRecentAncestor];
  }

  async _buildAncestors(path) {
    return [rootDir].concat(await this._buildAncestorsRecursively(path));
  }

  listFiles(path) {
    if (!path) {
      throw new Error('Cannot list files for undefined path');
    }

    return cache(path, this._fileCache, async () => {
      const result = await this.runCommand({
        type: 'dirList',
        payload: {path}
      });
  
      const idPrefix = normalizePath(path);
      const ancestors = await this._buildAncestors(idPrefix);
      return result.files.map(file => ({
        capabilities: file.type === 'DIR' ? dirCapabilities : fileCapabilities,
        createdTime: file.type === 'DIR' ? null : Date.parse(file.lastTouch),
        id: `${idPrefix}${file.name}/`,
        modifiedTime: file.type === 'DIR' ? null : Date.parse(file.lastTouch),
        name: file.name,
        type: file.type === 'DIR' ? 'dir' : 'file',
        size: file.type === 'DIR' ? null : file.size,
        parentId: idPrefix,
        ancestors
      }));
    });
  }

  listDrives() {
    return cache('', this._driveCache, async () => {

      const result = await this.runCommand({
        type: 'driveList'
      });

      return result.drives.map(drive => {
        const name = normalizePath(drive.name);
        return {
          capabilities: {
            canListChildren: true,
            canRemoveChildren: true
          },
          createdTime: null,
          id: name,
          modifiedTime: null,
          name: name.replace(/\//g, ''),
          type: 'dir',
          size: null,
          parentId: rootDir.id,
          ancestors: [rootDir]
        };
      });
    });
   
  }
  
  async getResourceById(options, id) {
    if (id === '') {
      return rootDir;
    }

    if (isDrivePath(id)) {
      return (await this.listDrives()).find(drive => drive.id === id);
    }

    const files = await this.listFiles(getFileParent(id));
    return files.find(file => file.id === id);
  }
  
  getChildrenForId(options, { id, sortBy = 'name', sortDirection = 'ASC' }) {
    if(id === '') {
      return this.listDrives();
    }
    return this.listFiles(id);
  }
  
  async getParentsForId(options, id, result = []) {
    if (!id) {
      return result;
    }
  
    const resource = await this.getResourceById(options, id);
    if (resource && resource.ancestors) {
      return resource.ancestors;
    }
    return result;
  }
  
  async getBaseResource(options) {
    const route = `${options.apiRoot}/files`;
    const response = await request.get(route);
    return normalizeResource(response.body);
  }
  
  async getIdForPartPath(options, currId, pathArr) {
    const resourceChildren = await this.getChildrenForId(options, { id: currId });
    for (let i = 0; i < resourceChildren.length; i++) {
      const resource = resourceChildren[i];
      if (resource.name === pathArr[0]) {
        if (pathArr.length === 1) {
          return resource.id;
        } else {
          return this.getIdForPartPath(options, resource.id, pathArr.slice(1));
        }
      }
    }
  
    return null;
  }
  
  async getIdForPath(options, path) {
    const resource = await this.getBaseResource(options);
    const pathArr = path.split('/');
  
    if (pathArr.length === 0 || pathArr.length === 1 || pathArr[0] !== '') {
      return null;
    }
  
    if (pathArr.length === 2 && pathArr[1] === '') {
      return resource.id;
    }
  
    return this.getIdForPartPath(options, resource.id, pathArr.slice(1));
  }
  
  async getParentIdForResource(options, resource) {
    return resource.parentId;
  }
  
  async uploadFileToId({ apiOptions, parentId, file, onProgress }) {
    const route = `${apiOptions.apiRoot}/files`;
    return request.post(route).
      field('type', 'file').
      field('parentId', parentId).
      attach('files', file.file, file.name).
      on('progress', event => {
        onProgress(event.percent);
      });
  }
  
  async downloadResources({ apiOptions, resources, onProgress }) {
    const downloadUrl = resources.reduce(
      (url, resource, num) => url + (num === 0 ? '' : '&') + `items=${resource.id}`,
      `${apiOptions.apiRoot}/download?`
    );
  
    const res = await request.get(downloadUrl).
      responseType('blob').
      on('progress', event => {
        onProgress(event.percent);
      });
  
    return res.body;
  }
  
  async createFolder(options, parentId, folderName) {
    const route = `${options.apiRoot}/files`;
    const method = 'POST';
    const params = {
      parentId,
      name: folderName,
      type: 'dir'
    };
    return request(method, route).send(params)
  }
  
  getResourceName(apiOptions, resource) {
    return resource.name;
  }
  
  async renameResource(options, id, newName) {
    const route = `${options.apiRoot}/files/${id}`;
    const method = 'PATCH';
    return request(method, route).type('application/json').send({ name: newName })
  }
  
  async removeResource(options, resource) {
    const route = `${options.apiRoot}/files/${resource.id}`;
    const method = 'DELETE';
    return request(method, route)
  }
  
  async removeResources(options, selectedResources) {
    return Promise.all(selectedResources.map(resource => this.removeResource(options, resource)))
  }
}

export default FileBrowserApi;