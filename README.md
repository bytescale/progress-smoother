<h1 align="center">
    <code>progress-smoother</code>
</h1>

<p align="center"><b>Smoothing Function for Progress Bars</b></p>
<br/>
<p align="center">
  <a href="https://github.com/upload-js/progress-smoother/">
    <img src="https://img.shields.io/badge/gzipped-7%20kb-4ba0f6" />
  </a>

  <a href="https://www.npmjs.com/package/progress-smoother">
    <img src="https://img.shields.io/badge/progress--smoother-npm-4ba0f6" />
  </a>

  <a href="https://github.com/upload-js/progress-smoother/actions/workflows/ci.yml">
    <img src="https://img.shields.io/badge/build-passing-4ba0f6" />
  </a>

  <a href="https://www.npmjs.com/package/progress-smoother">
    <img src="https://img.shields.io/npm/dt/progress-smoother?color=%234ba0f6" />
  </a>
  <br/>

  <a href="https://www.npmjs.com/package/progress-smoother">
    <img src="https://img.shields.io/badge/TypeScript-included-4ba0f6" />
  </a>

  <a href="https://github.com/upload-js/progress-smoother/actions/workflows/ci.yml">
    <img src="https://img.shields.io/npms-io/maintenance-score/progress-smoother?color=4ba0f6" />
  </a>

  <a target="_blank" href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fupload-js%2Fprogress-smoother&via=UploadJS&text=I%20just%20found%20%22progress-smoother%22%20on%20NPM%20%E2%80%94%20a%20nice%20smoothing%20function%20to%20use%20in%20progress%20bars.&hashtags=javascript%2Copensource%2Cjs%2Cwebdev%2Cdevelopers">
    <img alt="Twitter URL" src="https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Fupload-js%2Fprogress-smoother%2F" />
  </a>
<br/>
</p>

## Installation

```shell
npm install progress-smoother
```

## Usage

```javascript
const progress = new ProgressSmoother({
  // Required.
  total: 12345,
  averageTimeBetweenUpdates: 5000,   // Estimated time between '.update()' calls in milliseconds.
  saneLowerBoundRatePerSecond: 5000, // Estimated lowest throughput for a typical user, per second.
  minUpdateDelta: 500,               // Estimated minimum delta between the values passed to '.update()' calls.
  maxTimeUntilFirstUpdate: 6000,     // Estimated maximum time until the first '.update()' call is made.

  // Optional.
  teardownTime: 2000                 // Latency your app introduces after requests (function will incorporate this).
});

// Report progress events:
progress.update(1025);
progress.update(3201);
...
progress.update(12345);

// Get smoothed progress any time (e.g. on a fixed interval):
progress.smoothedFactor(); // Returns 0..1
```


## Contribute

If you would like to contribute to `progress-smoother`:

1. Add a [GitHub Star](https://github.com/upload-js/progress-smoother/stargazers) to the project (if you're feeling generous!).
2. Determine whether you're raising a bug, feature request or question.
3. Raise your issue or PR. 🚀

## License

[MIT](LICENSE)
