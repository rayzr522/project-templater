const fs = require('fs');
const readdir = require('fs-readdir-recursive');
const path = require('path');

/**
 * Copies a template folder to a given destination and replace all variables in the form of $((key)) with data from the context.
 * 
 * @param {string} template The path to the template folder
 * @param {string} destination The path to the destination folder
 * @param {Object} context The data to use for key-replacement
 * @param {function(string): boolean} filter? description
 * @returns {boolean} Whether or not the operation was completed succesfully
 */
exports.copy = function (template, destination, context, filter) {
    if (!template || !destination || !context) throw 'All parameters must be defined!';
    var transformed = transformContext(context);
    readdir(template, filter).forEach(file => {
        readFile(path.resolve(template, file), transformed)
            .then(data => {
                writeFile(path.resolve(destination, file), data).catch(console.error);
            }).catch(console.error);
    });
    return true;
}

/**
 * Transforms a context object into an array of objects containing a regexp and a replacement.
 * 
 * @param {Object} context The original context
 * @returns {[Object]} The transformed context
 */
function transformContext(context) {
    var transformed = [];
    Object.keys(context).forEach(key => {
        transformed.push({ regexp: new RegExp(`\\$\\(\\(\\s*${key}\\s*\\)\\)`, 'g'), replace: context[key] });
    });
    return transformed;
}

/**
 * Reads a file from the given path with the given context for key-value replacement
 * 
 * @param {string} file The absolute path to the file
 * @param {[{regexp: RegExp, replace: string}]} context The context object for key-value replacement
 * @returns {Promise<string>}
 */
function readFile(file, context) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) reject(err);
            else {
                data = data.toString();
                context.forEach(i => data = data.replace(i.regexp, i.replace));
                resolve(data);
            }
        });
    });
}

/**
 * Essentially a wrapper for fs.writeFile inside of a Promise
 * 
 * @param {string} file The absolute path to the file
 * @param {string} data The data to write
 * @returns {Promise<>}
 */
function writeFile(file, data) {
    return new Promise((resolve, reject) => {
        var folder = path.dirname(file);
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }
        fs.writeFile(file, data, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}