import _ from 'lodash';
import fs from 'fs';

const CHUNK_SIZE = 128 * 1024;

function get(path, callback) {
  fs.readdir(path, (error, files) => {
    if (error) {
      callback(error);
    } else {
      files = _.reduce(files, (result, file) => {
        if (_.endsWith(file, '_dashinit.mp4')) {
          result.push({ name: _.split(file, '_dashinit.mp4')[0] });
        }
        return result;
      }, []);
      callback(null, files);
    }
  });
}

function watch(path, name) {
  return fs.createReadStream(`${path}/${name}_dashinit.mp4`, { highWaterMark: CHUNK_SIZE });
}

export default { get, watch };
