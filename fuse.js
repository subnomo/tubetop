const { FuseBox, Sparky, CSSPlugin, CopyPlugin } = require('fuse-box');
const { spawn } = require('child_process');

const DEV_PORT = 4444;
const ASSETS = ['*.jpg', '*.png', '*.jpeg', '*.gif', '*.svg'];

const isProduction = process.env.NODE_ENV === 'production';

// Copy the renderer html file to dist
Sparky.task('copy-html', () => {
    return Sparky.src('src/renderer/index.html').dest('dist/$name');
});

Sparky.task('default', ['copy-html'], () => {
    const fuse = FuseBox.init({
        homeDir: 'src/',
        output: 'dist/$name.js',
        target: 'electron',
        log: isProduction,
        cache: !isProduction,
        sourceMaps: !isProduction,
        tsConfig: 'tsconfig.json',
        serverBundle: true,
        shim: {
          electron: { exports: "global.require('electron')" },
        },
    });

    // Start the hot-reload server
    if (!isProduction) {
        fuse.dev({ port: DEV_PORT, httpServer: false });
    }

    // Bundle main electron code
    const appBundle = fuse.bundle('app').instructions('>index.ts');

    // Watch
    if (!isProduction) {
        appBundle.watch();
    }

    // Bundle electron renderer code
    const rendererBundle = fuse
        .bundle('renderer')
        .instructions('> [renderer/index.tsx] +fuse-box-css')
        .plugin(CSSPlugin())
        .plugin(CopyPlugin({
            useDefault: false,
            files: ASSETS,
            dest: 'assets',
            resolve: 'assets/',
        }));

    // Watch and hot-reload
    if (!isProduction) {
        rendererBundle.watch();
        rendererBundle.hmr();
    }

    return fuse.run().then(() => {
        if (!isProduction) {
            spawn('node', [`${__dirname}/node_modules/electron/cli.js`, __dirname],
                { stdio: 'inherit' });
        }
    });
});

Sparky.task('clean', () => {
    return Sparky.src('dist/*').clean('dist/');
});
