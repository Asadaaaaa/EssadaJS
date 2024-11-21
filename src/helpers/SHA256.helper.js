// Library
import Crypto from 'crypto';

class Sha256Helper {
  /**
   * 
   * @param { String } data 
   * @param { String } salt
   * @returns Hash Sha256
   */
  getHash(data, salt = null) {
    return Crypto.createHash('sha256').update(data + (salt === null ? '' : '-' + salt)).digest('hex');;
  }

  getHashFromBuffer(data) {
    return Crypto.createHash('sha256').update(data).digest('hex');;
  }
}

export default Sha256Helper;