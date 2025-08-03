import { FileSystemHelper, ResponsePresetHelper } from '#helpers';

// Library
import Express from 'express';
import Morgan from 'morgan';
import cors from 'cors';

class Handler {
    constructor(server) {
      this.server = server;
      this.API = this.server.API;

      this.ResponsePreset = new ResponsePresetHelper(this.server);
      this.FileSystem = new FileSystemHelper(this.server);

      this.global();
    }

    global() {
      this.API.use(cors({
          methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
          origin: this.server.env.MIDDLEWARE_ORIGIN
      }));

      this.API.use('/:service/:apiVersion', async (req, res, next) => {
        const { service, apiVersion } = req.params;
        const apiVersions = await this.FileSystem.readJSONFile('/storage/configs/APIVersions.json');

        if(!service || !apiVersion) return res.status(410).json(this.ResponsePreset.resErr(
            404,
            'Not Found, Something wrong with the version of API',
            'api-version',
            { code: -1 }
          ));


        if(!apiVersions[service]) return res.status(410).json(this.ResponsePreset.resErr(
          404,
          'Not Found, Something wrong with the version of API',
          'api-version',
          { code: -1 }
        ));

        const versionData = apiVersions[service].find(v => v.version === apiVersion);

        if(!versionData) return res.status(410).json(this.ResponsePreset.resErr(
          404,
          'Not Found, Something wrong with the version of API',
          'api-version',
          { code: -1 }
        ));

        if(versionData.isEnable === false) return res.status(410).json(this.ResponsePreset.resErr(
          406,
          'Not Acceptable, This API version is no longer supported',
          'api-version',
          { code: -2 }
        ));

        next();
      });
      
      this.API.use(Express.json({
          limit: this.server.env.MIDDLEWARE_JSON_LIMIT_SIZE
      }));

      this.API.use((err, req, res, next) => {
        if (err instanceof SyntaxError && err.status === 400 && 'body' in err) return res.status(400).json({
          status: 400,
          err: {
            type: "SyntaxError"
          }
        });
        next();
      });

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
      this.API.get('*', async (req, res) => {
        const notFoundPage = await this.FileSystem.readFile('/storage/configs/404.html');
        res.status(404).send(notFoundPage);
      });
    }
}

export default Handler;