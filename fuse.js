import { fusebox, sparky } from 'fuse-box';

class Context {
  isProduction;
  runServer;
  getMainConfig() {
    return fusebox({
      output: 'build/main/$name',
      target: 'electron',
      homeDir: 'src',
      entry: 'main.ts',
      useSingleBundle: true,
      dependencies: { ignoreAllExternal: true },
      logging: { level: 'succinct' },
      cache: {
        enabled: true,
        root: '.cache/main'
      }
    });
  }
  launch(handler) {
    handler.onComplete(output => {
      output.electron.handleMainProcess();
    });
  }
  getRendererConfig() {
    return fusebox({
      output: 'build/renderer/$name-$hash',
      target: 'electron',
      homeDir: 'src/renderer',
      entry: 'index.tsx',
      dependencies: { include: ['tslib'] },
      logging: { level: 'succinct' },
      webIndex: {
        publicPath: './',
        template: 'src/renderer/index.html'
      },
      cache: {
        enabled: false,
        root: '.cache/renderer'
      },
      devServer: this.runServer ? {
        httpServer: false,
        hmrServer: { port: 7878 }
      } : false
    });
  }
}
const { task, rm } = sparky(Context);

task('default', async ctx => {
  await rm('./build');
  ctx.runServer = true;

  const rendererConfig = ctx.getRendererConfig();
  await rendererConfig.runDev();

  const electronMain = ctx.getMainConfig();
  await electronMain.runDev(handler => ctx.launch(handler));
});

task('build', async ctx => {
  await rm('./build');
  ctx.runServer = false;

  const rendererConfig = ctx.getRendererConfig();
  await rendererConfig.runProd({ uglify: true });

  const electronMain = ctx.getMainConfig();
  await electronMain.runProd({
    uglify: true,
    manifest: true,
  });
});
