import { Watch, WatchOptions } from "./watch.js"
import { Wait, WaitOptions } from "./wait.js"

export * from "./wait"
export * from "./watch"

/** Create a high-level watch that emits `add`, `change`, and `remove` events for files. */
export default function watch(path: string, options?: WatchOptions) {
  return new Watch(path, options)
}

/** Spawn `inotifywait` in monitor mode to parse and emit events. */
export function wait(paths: string | string[], options?: WaitOptions) {
  return new Wait(paths, options)
}
