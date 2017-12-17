(global as any).requestAnimationFrame = (callback: any) => {
  setTimeout(callback, 0);
};
