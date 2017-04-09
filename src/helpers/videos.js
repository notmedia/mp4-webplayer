import _ from 'lodash';
import fs from 'fs';

function get(path, callback) {
  fs.readdir(path, (error, files) => {
    if (error) {
      callback(error);
    } else {
      files = _.reduce(files, (result, file) => {
        result.push({ name: _.split(file, '.mp4')[0] });
        return result;
      }, []);
      callback(null, files);
    }
  });
}

function watch(path, name) {
  return fs.createReadStream(`${path}/${name}.mp4`);
}

export default { get, watch };
