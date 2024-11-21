import ResponsePreset from '../helpers/ResponsePreset.helper.js';

// Library
import Express from 'express';
import Morgan from 'morgan';
import cors from 'cors';
import JWT from "jsonwebtoken";

class GlobalMiddleware {
    constructor(server) {
      this.server = server;
      this.API = this.server.API.route;

      this.ResponsePreset = new ResponsePreset();
    }

    global() {
      // Cors Configuration
      
      if(this.server.env.NODE_ENV === "production") {
        this.API.use((req, res, next) => {
          const token = req.headers['authorization'] ? req.headers['authorization'] : req.query.token;
          const getOrigin = JWT.verify(token, this.server.env.JWT_TOKEN_SECRET_INTEGRATED, (err, payload) => {
            if(err) return false;
  
            if(payload.data.integratedToken === true) return payload.data.integratedData.origin;
            return false;
          });
  
          cors({ origin: getOrigin ? getOrigin : this.server.env.MIDDLEWARE_ORIGIN})(req, res, next)
        });
      } else {
        this.API.use(cors({
          methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
          origin: '*'
        }));
      }
      
      
      // API Version
      this.API.use('/:apiVersion', (req, res, next) => {
        const { apiVersion } = req.params;

        if(apiVersion !== this.server.env.API_VERSION) return res.status(410).json(this.ResponsePreset.resErr(
          410,
          'Gone, Something wrong with the version of API',
          'api-version',
          { code: -1 }
        ));

        next();
      });
      
      // Request JSON Limit Size
      this.API.use(Express.json({
          limit: this.server.env.MIDDLEWARE_JSON_LIMIT_SIZE
      }));

      // Request Syntax Validation
      this.API.use((err, req, res, next) => {
        if (err instanceof SyntaxError && err.status === 400 && 'body' in err) return res.status(400).json(this.ResponsePreset.resErr(
          400,
          'Bad Request, Something wrong with your Syntax in Request Body',
          'syntax-error',
          { code: -1 }
        ));

        next();
      });
      
      // Middlewares Data
      this.API.use((req, res, next) => {
        req.middlewares = {
          clientData: {
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
            origin: req.headers['origin'] ? req.headers['origin'] : req.headers['host'],
            referer: req.headers['referer'] ? req.headers['referer'] : req.headers['host'],
            url: req.protocol + '://' + req.get('host') + req.originalUrl,
          },
          apiData: {
            version: this.server.env.API_VERSION,
            endpoint: req.originalUrl,
            method: req.method
          }
        };

        next();
      });

      // Logger
      if(this.server.env.LOG_REQUEST === "full") {
        this.API.use((req, res, next) => {
          const server = this.server
          const chunks = [];
          const originalWrite = res.write;
          const originalEnd = res.end;

          res.write = function (chunk) {
            chunks.push(chunk);
            originalWrite.apply(res, arguments);
          };
        
          res.end = function (chunk) {
            if (chunk) chunks.push(chunk);
            let responseBody = null;

            try {
              responseBody = JSON.parse(chunks)
            } catch(err) {
              responseBody = chunks
            }

            server.sendLogs('New Request: ' + req.originalUrl + '\n- Header: ' + JSON.stringify(req.headers, null, 2) + '\n- Body: ' + JSON.stringify(req.body, null, 2) + '\n- Response: ' + JSON.stringify(responseBody, null, 2));
        
            originalEnd.apply(res, arguments);
          };
          
          next();
          return;
        });

      } else if(this.server.env.LOG_REQUEST === "medium") {
        this.API.use(Morgan((tokens, req, res) => {
          const date = new Date(new Date().toLocaleString('en-US', {timeZone: 'Asia/Jakarta'}));
          const currentDate = '[' + 
            date.getDate() + '/' +
            (date.getMonth() + 1) + '/' +
            date.getHours() + ':' +
            date.getMinutes() + ':' +
            date.getSeconds() +
          ']';

          return [
            '\n' + currentDate,
            '(' + process.pid +'):',
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms'
          ].join(' ')
        }));
      }
    }

    missingRoute() {
      this.API.get('*', (req, res) => {
        // Redirect to the desired URL
        res.sendFile(process.cwd() + './../../static-page/404/index.html');
      });
    }
}

export default GlobalMiddleware;
