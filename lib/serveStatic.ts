import express from 'express';
import colors from 'colors';
import BuildStaticPageContext from './types/BuildStaticPageContext';
import BuildStaticPageResult from './types/BuildStaticPageResult';
import getAvailableAddresses from './server/getAvailableAddresses';
import relativePath from './shared/relativePath';
import htmlMiddleware from './server/htmlMiddleware';
import lessMiddleware from './server/lessMiddleware';
import indexMiddleware from './server/indexMiddleware';

export default function (context: BuildStaticPageContext) {
  return new Promise<BuildStaticPageResult>((resolve, reject) => {
    const { logger, options, config, mode } = context;
    const { preview } = options;
    const { settings } = config;
    const { src, dist, port, host, noColors } = settings;
    const root = preview ? dist : src;
    const app = express();

    if (!preview) {
      app.use(htmlMiddleware(root, context));
      app.use(lessMiddleware(root, context));
    }

    app.use(indexMiddleware(root));
    app.use(express.static(root));

    const tryStartServer = (port: number) => {
      app.listen(port, host, () => {
        const addresses = host === '0.0.0.0'
          ? [ 'localhost', ...getAvailableAddresses() ]
          : [ host ];

        const cyan = (text: string) => noColors ? text : colors.cyan(text);
        const green = (text: string) => noColors ? text : colors.green(text);
        const yellow = (text: string) => noColors ? text : colors.yellow(text);

        const message = [];

        message.push(green(`${preview ? 'Preview' : 'Development'} server started, directory:`));
        message.push(cyan('  ' + relativePath(root)));
        message.push(green('Mode:'));
        message.push(cyan('  ' + mode));
        message.push(green('Available on:'));
        addresses.forEach((host) => message.push(cyan(`  http://${host}:${port}`)));
        message.push(yellow('\nHit Ctrl-C to stop the server'));

        logger.log(message.join('\n'));

        resolve({
          mode,
          root,
          port,
          host: addresses,
          logs: logger.getLogs(),
        });
      }).once('error', (err: { errno: string }) => {
        if (err.errno === 'EADDRINUSE') {
          tryStartServer(port + 1);
        } else {
          reject(err);
        }
      });
    };

    tryStartServer(port);
  });
}
