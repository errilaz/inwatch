import EventEmitter from "events"
import { readdir, stat } from "fs/promises"
import { dirname, join, relative, resolve } from "path"
import TypedEventEmitter from "typed-emitter"
import { getExtendedRegex } from "./getExtendedRegex.js"
import { Wait, WaitOptions } from "./wait.js"

export type WatchOptions = Omit<WaitOptions, "events" | "include" | "exclude"> & {
  /** Do not emit `add` events for existing files when starting the watch. */
  ignoreInitial?: boolean
  /** Do not actually start the watcher, just scan and emit `add` events at startup. */
  ignoreSubsequent?: boolean
  /** Exclude all events on files matching the regular expression pattern. */
  allow?: RegExp
  /** Exclude all events on files except the ones matching the regular expression pattern. */
  reject?: RegExp
}

type ScanDir = Map<string, "file" | "dir">
type ScanCache = Map<string, ScanDir>

export type WatchEventName = keyof Omit<WatchEvents, "all" | "error">

export type WatchEvents = {
  all: (args: { event: WatchEventName, path: string }) => void
  error: (error: any) => void
  add: (args: { event: "add", path: string }) => void
  change: (args: { event: "change", path: string }) => void
  remove: (args: { event: "remove", path: string }) => void
}

export class Watch extends (EventEmitter as new () => TypedEventEmitter<WatchEvents>) {
  readonly path: string
  readonly options: WatchOptions
  private cache: ScanCache = new Map()
  private wait: Wait | undefined
  private stopped: Promise<void> | undefined

  constructor(path: string, options?: WatchOptions) {
    super()
    this.path = path
    this.options = options || {}
    this.scan(path, true).then(() => {
      if (this.options.ignoreSubsequent) return
      this.start()
    })
  }

  /** Kills `inotifywait` and stops emitting events. */
  stop() {
    if (!this.stopped) {
      this.stopped = new Promise(resolve => {
        this.removeAllListeners()
        resolve(this.wait?.stop())
      })
    }
    return this.stopped
  }

  private async scan(dirPath: string, initial = false) {
    const names = await readdir(dirPath)
    const dir: ScanDir = new Map()
    this.cache.set(dirPath, dir)

    for (const name of names) {
      const fullPath = join(dirPath, name)
      const exclude = (this.options.allow && !this.options.allow.test(fullPath))
        || (this.options.reject && this.options.reject.test(fullPath))
      if (exclude) continue

      const stats = await stat(fullPath)
      if (stats.isFile()) {
        dir.set(fullPath, "file")
        if (initial && this.options.ignoreInitial)
          continue
        const path = relative(this.path, fullPath)
        const args = { event: "add" as const, path }
        if (this.stopped) return
        this.emit("all", args)
        this.emit("add", args)
      }
      else if (stats.isDirectory() && this.options.recursive) {
        dir.set(fullPath, "dir")
        await this.scan(fullPath, initial)
      }
    }
  }

  private start() {
    this.wait = new Wait(this.path, {
      ...this.options,
      events: ["create", "modify", "delete", "move"],
      include: this.options.allow ? getExtendedRegex(this.options.allow) : undefined,
      exclude: this.options.reject ? getExtendedRegex(this.options.reject) : undefined,
    })

    const createFile = (fullPath: string) => {
      const path = relative(this.path, fullPath)
      const args = { event: "add" as const, path }
      this.emit("all", args)
      this.emit("add", args)
      this.cache.get(dirname(fullPath))?.set(path, "file")
    }

    this.wait.on("create", ({ isDir, watchPath, eventPath }) => {
      if (this.stopped) return
      const fullPath = join(watchPath, eventPath!)
      if (!isDir) {
        createFile(fullPath)
      }
      else {
        const parent = dirname(fullPath)
        this.cache.set(fullPath, new Map())
        if (this.cache.has(parent)) {
          this.cache.get(parent)?.set(fullPath, "dir")
        }
      }
    })

    this.wait.on("modify", ({ watchPath, eventPath }) => {
      if (this.stopped) return
      const path = relative(this.path, join(watchPath, eventPath!))
      const args = { event: "change" as const, path }
      this.emit("all", args)
      this.emit("change", args)
    })

    const deleteFile = (fullPath: string) => {
      const path = relative(this.path, fullPath)
      const args = { event: "remove" as const, path }
      this.emit("all", args)
      this.emit("remove", args)
      this.cache.get(dirname(fullPath))?.delete(fullPath)
    }

    const deleteSubs = (dir: ScanDir) => {
      for (const [fullPath, type] of dir.entries()) {
        if (type === "file") {
          const path = relative(this.path, fullPath)
          const args = { event: "remove" as const, path }
          this.emit("all", args)
          this.emit("remove", args)
        }
        else {
          const sub = this.cache.get(fullPath)!
          this.cache.delete(fullPath)
          deleteSubs(sub)
        }
      }
    }

    const deleteDir = (fullPath: string) => {
      const dir = this.cache.get(fullPath)!
      this.cache.delete(fullPath)
      const parent = dirname(fullPath)
      this.cache.get(parent)?.delete(fullPath)
      deleteSubs(dir)
    }

    this.wait.on("delete", ({ isDir, watchPath, eventPath }) => {
      if (this.stopped) return
      const fullPath = join(watchPath, eventPath!)
      if (!isDir) {
        deleteFile(fullPath)
      }
      else {
        deleteDir(fullPath)
      }
    })

    this.wait.on("moved_from", ({ isDir, watchPath, eventPath }) => {
      if (this.stopped) return
      const fullPath = join(watchPath, eventPath!)
      if (!isDir) {
        deleteFile(fullPath)
      }
      else {
        deleteDir(fullPath)
      }
    })

    this.wait.on("moved_to", ({ isDir, watchPath, eventPath }) => {
      if (this.stopped) return
      const fullPath = join(watchPath, eventPath!)
      if (!isDir) {
        createFile(fullPath)
      }
      else {
        this.scan(fullPath)
      }
    })

    this.wait.on("error", e => {
      if (this.stopped) return
      this.emit("error", e)
    })
  }
}
