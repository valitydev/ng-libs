# Angular Libraries

-   [Core](/projects/ng-core)

## 💻 Development with locally built/runnable library

1. Link the library

    ```sh
    npm link ../ng-libs/dist/ng-core
    ```

1. Start Library

    ```sh
    # cd ../ng-core
    npm start
    ```

1. Start your app

    ```sh
    # cd ../your-app
    npm start
    ```

### 📦 Preparing a Pull Request in your application along with the library

To do this, you can use the version published in the NPM (with the `pr` tag) from your PR to the library:

```sh
npm i @vality/ng-core@pr
```

_The latest version with the tag can also be [viewed in NPM](https://www.npmjs.com/package/@vality/ng-core?activeTab=versions)_
