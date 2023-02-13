import EventEmitter from "events"
import { readdir, stat } from "fs/promises"
import { dirname, join, relative, resolve } from "path"
import TypedEventEmitter from "typed-emitter"
import { Watch, WatchOptions } from "./watch"

export type MonitorOptions = Omit<WatchOptions, "events">

export function createMonitor(path: string, options?: MonitorOptions) {
  return new Monitor(path, options)
}

export class Monitor extends (EventEmitter as new () => TypedEventEmitter<MonitorEvents>) {
  readonly path: string
  readonly options: MonitorOptions

  constructor(path: string, options?: MonitorOptions) {
    super()
    this.path = path
    this.options = options || {}
    scan(path).then(cache => this.start(cache))
  }

  private start(cache: ScanCache) {
    console.log("starting watch")
    const watch = new Watch(this.path, {
      ...this.options,
      events: ["create", "modify", "delete", "move"]
    })

    watch.on("all", args => {
      console.log("DEBUG", args)
    })

    watch.on("create", ({ isDir, watchPath, eventPath }) => {
      if (!isDir) {
        const fullPath = join(watchPath, eventPath!)
        const path = relative(this.path, fullPath)
        const args = { event: "add" as const, path }
        this.emit("all", args)
        this.emit("add", args)
        cache.get(dirname(fullPath))?.set(path, "file")
      }
      else {
        const fullPath = join(watchPath, eventPath!)
        const parent = dirname(fullPath)
        cache.set(fullPath, new Map())
        if (cache.has(parent)) {
          cache.get(parent)?.set(fullPath, "dir")
        }
      }
    })

    watch.on("modify", ({ watchPath, eventPath }) => {
      const path = relative(this.path, join(watchPath, eventPath!))
      const args = { event: "change" as const, path }
      this.emit("all", args)
      this.emit("change", args)
    })

    const fileDeleted = (fullPath: string) => {
      const path = relative(this.path, fullPath)
      const args = { event: "remove" as const, path }
      this.emit("all", args)
      this.emit("remove", args)
    }

    const dirDeleted = (fullPath: string) => {
      const dir = cache.get(fullPath)!
      cache.delete(fullPath)
      for (const [path, type] of dir.entries()) {
        if (type === "file") {
          fileDeleted(path)
        }
        else {
          dirDeleted(path)
        }
      }
    }

    watch.on("delete", ({ isDir, watchPath, eventPath }) => {
      if (!isDir) {
        const fullPath = join(watchPath, eventPath!)
        fileDeleted(fullPath)
        cache.get(dirname(fullPath))?.delete(fullPath)
      }
      else {
        dirDeleted(join(watchPath, eventPath!))
      }
    })

    watch.on("moved_from", ({ isDir, watchPath, eventPath }) => {

    })

    watch.on("moved_to", ({ isDir, watchPath, eventPath }) => {

    })
  }
}

export type MonitorEventName = keyof Omit<MonitorEvents, "all" | "error">

export type MonitorEvents = {
  all: (args: { event: MonitorEventName, path: string }) => void
  error: (error: any) => void
  add: (args: { event: "add", path: string }) => void
  change: (args: { event: "change", path: string }) => void
  remove: (args: { event: "remove", path: string }) => void
}

type ScanDir = Map<string, "file" | "dir">
type ScanCache = Map<string, ScanDir>

/** Build a directory cache. */
async function scan(path: string) {
  const cache: ScanCache = new Map()
  await scanDir(path)
  return cache

  async function scanDir(dirPath: string) {
    const names = await readdir(dirPath)
    const dir: ScanDir = new Map()
    cache.set(dirPath, dir)
    for (const name of names) {
      const path = join(dirPath, name)
      const stats = await stat(path)
      if (stats.isFile()) {
        dir.set(path, "file")
      }
      else if (stats.isDirectory()) {
        dir.set(path, "dir")
        await scanDir(path)
      }
    }
  }
}
