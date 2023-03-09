# inwatch

<a href="https://www.npmjs.com/package/inwatch"><img src="https://img.shields.io/npm/v/inwatch?style=flat-square"></a>

> Filesystem watcher that spawns inotifywait

I made this because I needed a filesystem watcher that works with [bun](https://github.com/oven-sh/bun).

## Watch API

Watching files with a `chokidar`-like API:

```ts
import watch from "inwatch"

const watcher = watch("/my/path", {
  recursive: true,
  reject: /node_modules|\.git/,
  ignoreInitial: false,
  ignoreSubsequent: false,
  ignoreDuplicatesMs: 100,
})

watcher.on("add", ({ path }) => {
  console.log(`"${path}" was added!`)
})

watcher.on("change", ({ path }) => {
  console.log(`"${path}" was changed!`)
})

watcher.on("remove", ({ path }) => {
  console.log(`"${path}" was removed!`)
})

await watcher.stop()
```

### Options

- `recursive`: watch directories recursively (default: `false`)
- `allow`: only emit events for paths matching the regular expression (default: `undefined`)
- `reject`: do not emit events for paths matching the regular expression (default: `undefined`)
- `ignoreInitial`: do not emit `add` events for existing files at startup (default: `false`)
- `ignoreSubsequent`: emits `add` events at startup but disables the watcher (default: `false`)
- `ignoreDuplicatesMs`: ignore duplicate events emitted by `inotifywait` within the given window (default: `undefined`)

## Wait API

Using the `inotifywait` wrapper directly:

```ts
import { wait } from "inwatch"

const waiter = wait("/my/path", {
  recursive: true,
  exclude: "node_modules|\\.git",
  events: ["modify", "move", "create", "delete"],
  ignoreDuplicatesMs: 100,
})

waiter.on("all", ({ event, watchPath, eventPath }) => {
  console.log(`"${event}" event on "${watchPath}" at "${eventPath}"!`)
})

```

## Thanks

- [Anadian/regex-translator](https://github.com/Anadian/regex-translator) - adapted code from this library to convert JS RegExps to extended.
