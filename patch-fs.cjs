const fs = require('fs');
const path = require('path');
const origReadlinkSync = fs.readlinkSync;
const origReadlink = fs.readlink;

// Ensure any child processes automatically inherit this bridge with forward slashes
const thisFile = path.resolve(__dirname, 'patch-fs.cjs').replace(/\\/g, '/');
if (!process.env.NODE_OPTIONS || !process.env.NODE_OPTIONS.includes('patch-fs.cjs')) {
  process.env.NODE_OPTIONS = (process.env.NODE_OPTIONS ? process.env.NODE_OPTIONS + ' ' : '') + '--require ' + thisFile;
}

function convertError(err, targetPath) {
  if (err && (err.code === 'EISDIR' || err.code === 'UNKNOWN')) {
    const einval = new Error("EINVAL: invalid argument, readlink '" + targetPath + "'");
    einval.code = 'EINVAL';
    einval.errno = -4071;
    einval.syscall = 'readlink';
    einval.path = targetPath;
    return einval;
  }
  return err;
}

fs.readlinkSync = function(targetPath, options) {
  try {
    return origReadlinkSync.call(fs, targetPath, options);
  } catch (err) {
    throw convertError(err, targetPath);
  }
};

fs.readlink = function(targetPath, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  return origReadlink.call(fs, targetPath, options, (err, linkString) => {
    if (err) {
      return callback(convertError(err, targetPath));
    }
    return callback(null, linkString);
  });
};

if (fs.promises && fs.promises.readlink) {
  const origPromisesReadlink = fs.promises.readlink;
  fs.promises.readlink = async function(targetPath, options) {
    try {
      return await origPromisesReadlink.call(fs.promises, targetPath, options);
    } catch (err) {
      throw convertError(err, targetPath);
    }
  };
}
