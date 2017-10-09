const {
  FuseBox,
  Sparky,
  CSSPlugin,
  CSSResourcePlugin,
  CopyPlugin,
  EnvPlugin,
} = require('fuse-box');
const { spawn } = require('child_process');

const DEV_PORT = 4444;
const ASSETS = ['*.jpg', '*.png', '*.jpeg', '*.gif', '*.svg'];

let isProduction = process.env.NODE_ENV === 'production';

// Copy the renderer html file to dist
Sparky.task('copy-html', () => {
  return Sparky.src('src/renderer/index.html').dest('dist/$name');
});

let fuse;

function initFuse() {
  fuse = FuseBox.init({
    homeDir: 'src/',
    output: 'dist/$name.js',
    target: 'electron',
    log: !isProduction,
    hash: false,
    cache: !isProduction,
    sourceMaps: !isProduction,
    tsConfig: 'tsconfig.json',
    shim: {
      electron: { exports: "global.require('electron')" },
    },
    plugins: [
      EnvPlugin({ NODE_ENV: process.env.NODE_ENV }),
      [CSSResourcePlugin(), CSSPlugin()],
    ]
  });
}

initFuse();

function bundle() {
  // Bundle main electron code
  const appBundle = fuse.bundle('app').instructions('> [index.ts]');

  // Bundle electron renderer code
  const rendererBundle = fuse
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
  isProduction = true;
  initFuse();
  bundle();
  fuse.run();
});

Sparky.task('default', ['copy-html'], () => {
  // Start the hot-reload server
  if (!isProduction) {
    fuse.dev({ port: DEV_PORT, httpServer: false });
  }

  const { appBundle, rendererBundle } = bundle();

  // Watch and hot-reload
  if (!isProduction) {
    appBundle.watch();

    rendererBundle.watch();
    rendererBundle.hmr();
  }

  return fuse.run().then(() => {
    if (!isProduction) {
      spawn('node', [`${__dirname}/node_modules/electron/cli.js`, __dirname], {
        stdio: 'inherit',
      });
    }
  });
});

Sparky.task('clean', () => {
  return Sparky.src('dist/*').clean('dist/');
});
