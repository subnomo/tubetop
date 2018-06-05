const {
  FuseBox,
  Sparky,
  CopyPlugin,
  EnvPlugin,
  QuantumPlugin,
} = require('fuse-box');
const { spawn } = require('child_process');
const fs = require('fs');

const DEV_PORT = 4444;
const ASSETS = ['*.jpg', '*.png', '*.jpeg', '*.gif', '*.svg'];

let ip = process.env.NODE_ENV === 'production';

// Copy the renderer html file to build
Sparky.task('copy-html', () => {
  const file = ip ? 'src/renderer/index.html' : 'src/renderer/index-dev.html';
  return Sparky.src(file)
    .file('*', (file) => file.rename('index.html'))
    .dest('build/$name');
});

let fuse;
let fuseRenderer;

async function initFuse() {
  const config = {
    homeDir: 'src/',
    output: 'build/$name.js',
    log: true,
    cache: !ip,
    sourceMaps: !ip,
    tsConfig: 'tsconfig.json',
  };

  fuse = FuseBox.init({
    ...config,
    target: 'server',
    plugins: [
      EnvPlugin({ NODE_ENV: ip ? 'production' : 'development' }),
      ip && QuantumPlugin({
        target: 'server',
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
  const appBundle = fuse.bundle('app').instructions('> [main.ts]');

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

  // Setup aliases
  const dirs = fs.readdirSync('./src/renderer');

  for (let dir of dirs) {
    rendererBundle.alias(dir, `~/renderer/${dir}`);
  }

  return {
    appBundle,
    rendererBundle,
  };
}

Sparky.task('bundle', ['copy-html'], async () => {
  await bundle();
  await fuse.run();
});

Sparky.task('clean', () => {
  return Sparky.src('./build').clean('build/');
});

Sparky.task('build', ['clean'], async () => {
  ip = true;

  await Sparky.exec('copy-html');
  await initFuse();
  await bundle();
  await fuse.run();
  await fuseRenderer.run();
});

Sparky.task('default', ['copy-html'], () => {
  // Start the hot-reload server
  if (!ip) {
    fuseRenderer.dev({ port: DEV_PORT, httpServer: false });
  }

  const { appBundle, rendererBundle } = bundle();

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
        }).on('exit', (code) => {
          console.log(`electron process exited with code ${code}`);
          process.exit(code);
        });
      }
    });
  });
});
