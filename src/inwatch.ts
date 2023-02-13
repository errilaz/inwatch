import { Watch, WatchOptions } from "./watch"

export * from "./watch"
export * from "./monitor"

/** Spawn `inotifywait` in monitor mode to parse and emit events. */
export default function watch(paths: string | string[], options?: WatchOptions) {
  return new Watch(paths, options)
}
