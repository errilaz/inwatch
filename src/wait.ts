import { ChildProcess, spawn } from "child_process"
import EventEmitter from "events"
import type TypedEmitter from "typed-emitter"
import split from "split"

export interface WaitOptions {
  /** Watch all subdirectories of any directories passed as arguments. Watches will be set up recursively to an unlimited depth. Symbolic links are not traversed. Newly created subdirectories will also be watched. */
  recursive?: boolean
  /** Listen for specific event(s) only. If omitted, all events are listened for. */
  events?: WaitEventName[]
  /** Exclude all events on files matching the extended regular expression pattern. */
  exclude?: string
  /** Exclude all events on files except the ones matching the extended regular expression pattern. */
  include?: string
  /** Provide a custom path for `inotifywait`. */
  execPath?: string
  /** Ignore duplicate events within specified millisecond window. */
  ignoreDuplicatesMs?: number
}

export class Wait extends(EventEmitter as new () => TypedEmitter<WaitEvents>) {
  private child: ChildProcess

  constructor(paths: string | string[], options?: WaitOptions) {
    super()

    const args = [
      "--monitor",
      "--quiet",
      "--timefmt",
      "%s",
      "--format",
      "%e|%w|%f|%T"
    ]

    if (options?.recursive) args.push("--recursive")
    if (options?.exclude) args.push("--exclude", options.exclude)
    if (options?.include) args.push("--include", options.include)
    if (options?.events) for (const event of options.events) args.push("--event", event)

    if (Array.isArray(paths)) args.push(...paths)
    else args.push(paths)

    this.child = spawn(options?.execPath || "inotifywait", args, {
      stdio: ["ignore", "pipe", "pipe"]
    })

    this.child.on("close", () => {
      this.removeAllListeners()
    })

    const lastEvent: { [key: string]: number | undefined } = {}

    this.child.stdout!.pipe(split()).on("data", (line: string) => {
      try {
        const [EVENTS, watchPath, eventPath, time] = line.split("|")
        const timestamp = Number.parseInt(time)
        const events = EVENTS.split(",").map(e => e.toLowerCase())
        const isDir = events.indexOf("isdir")
        if (isDir > -1) events.splice(isDir, 1)

        for (const event of events) {
          const args = {
            watchPath,
            eventPath,
            event: event as WaitEventName,
            isDir: isDir > -1,
            timestamp,
          }
          if (options?.ignoreDuplicatesMs) {
            const last = lastEvent[line]
            lastEvent[line] = Date.now()
            if (last && last + options.ignoreDuplicatesMs > Date.now()) {
              return
            }
          }
          this.emit("all", args)
          this.emit(event as WaitEventName, args)
        }
      }
      catch (e) {
        this.emit("error", e)
      }
    })
  }

  close() {
    this.child.kill()
  }
}

/** `inotify` event name. */
export type WaitEventName = keyof Omit<WaitEvents, "all" | "error">

/** Event arguments. */
export interface WaitEventArgs {
  /** Name of the `inotify` event which occurred. */
  event: WaitEventName
  /** The name of the file on which the event occurred. If the file is a directory, a trailing slash is output (`watched_filename`). */
  watchPath: string
  /** Output only when the event occurred on a directory, and in this case the name of the file within the directory which caused this event is output (`event_filename`). */
  eventPath?: string
  /** Indicates if the event occurred on a directory. */
  isDir: boolean
  /** Event time in epoch. */
  timestamp: number
}

/** Emitted events. */
export type WaitEvents = {
  /** Emitted on all events. */
  all: (args: WaitEventArgs) => void
  /** Emitted when an error occurs. */
  error: (error: any) => void
  /** A watched file or a file within a watched directory was read from. */
  access: (args: WaitEventArgs) => void
  /** A watched file or a file within a watched directory was written to. */
  modify: (args: WaitEventArgs) => void
  /** The metadata of a watched file or a file within a watched directory was modified. This includes timestamps, file permissions, extended attributes etc. */
  attrib: (args: WaitEventArgs) => void
  /** A watched file or a file within a watched directory was closed, after being opened in writeable mode. This does not necessarily imply the file was written to. */
  close_write: (args: WaitEventArgs) => void
  /** A watched file or a file within a watched directory was closed, after being opened in read-only mode. */
  close_nowrite: (args: WaitEventArgs) => void
  /** A watched file or a file within a watched directory was closed, regardless of how it was opened. Note that this is actually implemented simply by listening for both `close_write` and `close_nowrite`, hence all close events received will be output as one of these, not `CLOSE`. */
  close: (args: WaitEventArgs) => void
  /** A watched file or a file within a watched directory was opened. */
  open: (args: WaitEventArgs) => void
  /** A file or directory was moved into a watched directory. This event occurs even if the file is simply moved from and to the same directory. */
  moved_to: (args: WaitEventArgs) => void
  /** A file or directory was moved from a watched directory. This event occurs even if the file is simply moved from and to the same directory. */
  moved_from: (args: WaitEventArgs) => void
  /** A file or directory was moved from or to a watched directory. Note that this is actually implemented simply by listening for both `moved_to` and `moved_from`, hence all close events received will be output as one or both of these, not `MOVE`. */
  move: (args: WaitEventArgs) => void
  /** A watched file or directory was moved. After this event, the file or directory is no longer being watched. */
  move_self: (args: WaitEventArgs) => void
  /** A file or directory was created within a watched directory. */
  create: (args: WaitEventArgs) => void
  /** A file or directory was created within a watched directory. */
  delete: (args: WaitEventArgs) => void
  /** A watched file or directory was deleted. After this event the file or directory is no longer being watched. Note that this event can occur even if it is not explicitly being listened for. */
  delete_self: (args: WaitEventArgs) => void
  /** The filesystem on which a watched file or directory resides was unmounted. After this event the file or directory is no longer being watched. Note that this event can occur even if it is not explicitly being listened to. */
  unmount: (args: WaitEventArgs) => void
}
