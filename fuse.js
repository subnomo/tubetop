const {
  FuseBox,
  Sparky,
  CSSPlugin,
  CSSResourcePlugin,
  CopyPlugin,
  EnvPlugin,
  QuantumPlugin,
} = require('fuse-box');
const { spawn } = require('child_process');
const fs = require('fs');

const DEV_PORT = 4444;
const ASSETS = ['*.jpg', '*.png', '*.jpeg', '*.gif', '*.svg'];

let ip = process.env.NODE_ENV === 'production';

// Copy the renderer html file to dist
Sparky.task('copy-html', () => {
  return Sparky.src('src/renderer/index.html').dest('dist/$name');
});

let fuse;
let fuseRenderer;

function initFuse() {
  const config = {
    homeDir: 'src/',
    output: 'dist/$name.js',
    log: true,
    cache: !ip,
    sourceMaps: !ip,
    tsConfig: 'tsconfig.json',
  };

  fuse = FuseBox.init({
    ...config,
    target: 'electron',
    plugins: [
      EnvPlugin({ NODE_ENV: ip ? 'production' : 'development' }),
      [CSSResourcePlugin(), CSSPlugin()],
      ip && QuantumPlugin({
        target: 'electron',
        bakeApiIntoBundle : 'app',
        uglify: true,
        treeshake: true,
      }),
    ]
  });

  fuseRenderer = FuseBox.init({
    ...config,
    target: 'electron',
    plugins: [
      EnvPlugin({ NODE_ENV: ip ? 'production' : 'development' }),
      [CSSResourcePlugin(), CSSPlugin()],
      ip && QuantumPlugin({
        target: 'electron',
        bakeApiIntoBundle : 'renderer',
        uglify: true,
        treeshake: true,
      }),
    ]
  });
}

initFuse();

function bundle() {
  // Bundle main electron code
  const appBundle = fuse.bundle('app').instructions('> [index.ts]');

  // Bundle electron renderer code
  const rendererBundle = fuseRenderer
    .bundle('renderer')
    .instructions('> [renderer/index.tsx]')
    .plugin(CopyPlugin({
        useDefault: false,
        files: ASSETS,
        dest: 'assets',
        resolve: 'assets/',
    }));

  return {
    appBundle,
    rendererBundle,
  };
}

Sparky.task('bundle', ['copy-html'], () => {
  bundle();
  fuse.run();
});

Sparky.task('dist', ['copy-html'], () => {
  ip = true;
  initFuse();
  bundle();
  fuse.run();
  fuseRenderer.run();
});

Sparky.task('default', ['copy-html'], () => {
  // Start the hot-reload server
  if (!ip) {
    fuseRenderer.dev({ port: DEV_PORT, httpServer: false });
  }

  const { appBundle, rendererBundle } = bundle();

  // Setup aliases
  const dirs = fs.readdirSync('./src/renderer');

  for (let dir of dirs) {
    rendererBundle.alias(dir, `~/renderer/${dir}`);
  }

  // Watch and hot-reload
  if (!ip) {
    appBundle.watch();

    rendererBundle.watch();
    rendererBundle.hmr();
  }

  return fuse.run().then(() => {
    fuseRenderer.run().then(() => {
      if (!ip) {
        spawn('node', [`${__dirname}/node_modules/electron/cli.js`, __dirname], {
          stdio: 'inherit',
        });
      }
    });
  });
});

Sparky.task('clean', () => {
  return Sparky.src('dist/*').clean('dist/');
});
