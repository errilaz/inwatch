# inwatch

> Filesystem watcher that spawns inotifywait

I made this because I needed a filesystem watcher that works with [bun](https://github.com/oven-sh/bun).

Example:

```ts
import watch from "inwatch"

const monitor = watch("/my/path", {
  recursive: true,
  exclude: "node_modules|\\.git",
  events: ["modify", "move", "create", "delete"],
  ignoreDuplicatesMs: 100,
})

monitor.on("all", ({ event, watchPath, eventPath }) => {
  console.log(`${event} event on ${watchPath} at ${eventPath}!`)
})

```

