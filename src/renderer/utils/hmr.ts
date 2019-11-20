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

    if (!shouldUpdate(opts.path)) {
      window.location.reload();
    }

    return true;
  }
};
