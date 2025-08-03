// Library
import FS from 'fs-extra';
import { fileTypeFromBuffer } from 'file-type';

class FileSystemHelper {
    /**
     * Helper class for interacting with the file system.
     * @class
     * @param {Object} server - The server object.
     */
    constructor(server) {
        this.server = server;
    }

    /**
     * 
     * @param { string } fileBase64 - Base64 String
     * @param { Array } allowedExtension  - Allowed Extension
     * @param { Number } maximumSize - Maximum Size in Megabyte
     * @param { boolean } getFile - True for return the buffer file
     * @param { boolean } getType - True for return type of file
     * @returns [{ boolean }, { object }]
     */
    async fileValidationBase64(fileBase64, allowedExtension, maximumSize, getFile, getType) {
        if (!fileBase64) return -1;

        const file = Buffer.from(fileBase64, 'base64');
        const fileSize = Buffer.byteLength(file) / 1048576;

        if (fileSize > maximumSize) return -2;

        const fileType = await fileTypeFromBuffer(file);

        if (!fileType) return -3;
        if (allowedExtension.includes(fileType.ext) === false) return -3;

        if (getFile === false && getType === false) return true;

        return {
            ...(getFile === true ? { file } : {}),
            ...(getType === true ? { type: fileType.ext } : {})
        }
    }

    /**
     * Reads a file from the given path and returns its content and MIME type.
     * @async
     * @param {string} path - The path of the file to read.
     * @returns {Promise<{file: Buffer, mime: string}>} - A promise that resolves to an object containing the file content and MIME type.
     */
    async readFile(path) {
        const file = FS.readFileSync(process.cwd() + path);
        const { mime } = await fileTypeFromBuffer(file);

        return {
            file, mime
        };
    }

    /**
     * Reads a JSON file from the given path and returns its content.
     * @async
     * @param {string} path - The path of the file to read.
     * @returns {Promise<Object>} - A promise that resolves to an object containing the file content.
     */
    async readJSONFile(path) {
        const file = FS.readFileSync(process.cwd() + path);
        return JSON.parse(file);
    }

    async getMimeTypeFromBuffer(file) {
        const { mime } = await fileTypeFromBuffer(file);
        return mime;
    }
}

export default FileSystemHelper
