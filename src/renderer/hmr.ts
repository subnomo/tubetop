declare const FuseBox: any;

interface IHMROptions {
  type: 'js' | 'css';
  path: string;
  content: string;
}

const customizedHMRPlugin = {
  hmrUpdate: (opts: IHMROptions) => {
    const shouldUpdate = (path: string) => {
      const ignoredFiles = [
        /store/,
        /reducers/,
      ];

      for (let i = 0; i < ignoredFiles.length; i++) {
        if (ignoredFiles[i].test(path)) {
          return false;
        }
      }

      return true;
    };

    if (opts.type === 'js' && shouldUpdate(opts.path)) {
      FuseBox.dynamic(opts.path, opts.content);
      FuseBox.flush(shouldUpdate);

      if (FuseBox.mainFile) {
        FuseBox.import(FuseBox.mainFile);
      }
    } else if (!shouldUpdate(opts.path)) {
      window.location.reload();
    }

    return true;
  }
};

if (!process.env.hmrRegistered) {
  (process.env.hmrRegistered as any) = false;
  FuseBox.addPlugin(customizedHMRPlugin);
}
