import * as Slider from '@radix-ui/react-slider'
import { m, useDragControls, useSpring } from 'motion/react'
import type { PropsWithChildren } from 'react'
import {
  memo,
  startTransition,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  createContext,
  useContext,
  useContextSelector,
} from 'use-context-selector'

import type { HTMLMediaState } from '~/hooks/common/factory/createHTMLMediaHook'
import { useEventCallback } from '~/hooks/common/use-event-callback'
import { useGetState } from '~/hooks/common/use-get-state'
import { useVideo } from '~/hooks/common/useVideo'
import { nextFrame, stopPropagation } from '~/lib/dom'
import { clsxm } from '~/lib/helper'

import { MotionButtonBase } from '../button'
import { FloatPopover } from '../float-popover'
import { IconScaleTransition } from '../transition/IconScaleTransnsition'
import { VolumeSlider } from './VolumeSlider'

type VideoPlayerProps = {
  src: string

  variant?: 'preview' | 'player' | 'thumbnail'
} & React.VideoHTMLAttributes<HTMLVideoElement> &
  PropsWithChildren
export type VideoPlayerRef = {
  getElement: () => HTMLVideoElement | null

  getState: () => HTMLMediaState
  controls: {
    play: () => Promise<void> | undefined
    pause: () => void
    seek: (time: number) => void
    volume: (volume: number) => void
    mute: () => void
    unmute: () => void
  }

  wrapperRef: React.RefObject<HTMLDivElement | null>
}

interface VideoPlayerContextValue {
  state: HTMLMediaState
  controls: VideoPlayerRef['controls']
  wrapperRef: React.RefObject<HTMLDivElement | null>
  src: string
  variant: 'preview' | 'player' | 'thumbnail'
}
const VideoPlayerContext = createContext<VideoPlayerContextValue>(null!)
export const VideoPlayer = ({
  ref,
  src,
  className,
  variant = 'player',
  ...rest
}: VideoPlayerProps & { ref?: React.RefObject<VideoPlayerRef> }) => {
  const isPlayer = variant === 'player'
  const [clickToStatus, setClickToStatus] = useState(
    null as 'play' | 'pause' | null,
  )

  const scaleValue = useSpring(1)
  const opacityValue = useSpring(0)
  const handleClick = useEventCallback((e?: any) => {
    if (!isPlayer) return
    e?.stopPropagation()

    if (state.playing) {
      controls.pause()
      setClickToStatus('pause')
    } else {
      controls.play()
      setClickToStatus('play')
    }

    opacityValue.jump(1)
    scaleValue.jump(1)

    nextFrame(() => {
      scaleValue.set(1.3)
      opacityValue.set(0)
    })
  })

  const [element, state, controls, videoRef] = useVideo({
    src,
    className,
    playsInline: true,
    ...rest,
    controls: false,
    onClick(e) {
      rest.onClick?.(e)
      handleClick(e)
    },
    muted: isPlayer ? false : true,
    onDoubleClick(e) {
      rest.onDoubleClick?.(e)
      if (!isPlayer) return
      e.preventDefault()
      e.stopPropagation()
      if (!document.fullscreenElement) {
        wrapperRef.current?.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    },
  })

  const stateRef = useGetState(state)
  const memoedControls = useState(controls)[0]
  const wrapperRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(
    ref,
    () => ({
      getElement: () => videoRef.current,
      getState: () => stateRef(),
      controls: memoedControls,
      wrapperRef,
    }),

    [stateRef, videoRef, memoedControls],
  )

  return (
    <div className="group center relative size-full" ref={wrapperRef}>
      {element}

      <div className="center pointer-events-none absolute inset-0 flex">
        <m.div
          className="center flex size-20 rounded-full bg-black p-3"
          style={{ scale: scaleValue, opacity: opacityValue }}
        >
          <i
            className={clsxm(
              'size-8 text-white',
              clickToStatus === 'play'
                ? 'i-mingcute-play-fill'
                : 'i-mingcute-pause-fill',
            )}
          />
        </m.div>
      </div>

      <VideoPlayerContext.Provider
        value={useMemo(
          () => ({ state, controls, wrapperRef, src, variant }),
          [state, controls, src, variant],
        )}
      >
        {variant === 'preview' && state.hasAudio && <FloatMutedButton />}
        {isPlayer && <ControlBar />}
      </VideoPlayerContext.Provider>
    </div>
  )
}
const FloatMutedButton = () => {
  const ctx = useContext(VideoPlayerContext)
  const isMuted = ctx.state.muted
  return (
    <MotionButtonBase
      className="center absolute right-4 top-4 z-10 size-7 rounded-full bg-black/50 opacity-0 duration-200 group-hover:opacity-100"
      onClick={(e) => {
        e.stopPropagation()
        if (isMuted) {
          ctx.controls.unmute()
        } else {
          ctx.controls.mute()
        }
      }}
    >
      <IconScaleTransition
        className="size-4 text-white"
        icon1="i-mgc-volume-cute-re"
        icon2="i-mgc-volume-mute-cute-re"
        status={isMuted ? 'done' : 'init'}
      />
    </MotionButtonBase>
  )
}

const ControlBar = memo(() => {
  const controls = useContextSelector(VideoPlayerContext, (v) => v.controls)
  const isPaused = useContextSelector(VideoPlayerContext, (v) => v.state.paused)
  const dragControls = useDragControls()

  return (
    <m.div
      onClick={stopPropagation}
      drag
      dragListener={false}
      dragControls={dragControls}
      dragElastic={0}
      dragMomentum={false}
      dragConstraints={{ current: document.documentElement }}
      className={clsxm(
        'absolute inset-x-8 bottom-2 h-10 rounded-full border bg-zinc-100/90 backdrop-blur-xl dark:border-transparent dark:bg-neutral-700/90',
        'flex items-center gap-3 px-4',
        'mx-auto max-w-[80vw]',
      )}
    >
      {/* Drag Area */}
      <div
        onPointerDownCapture={dragControls.start.bind(dragControls)}
        className="absolute inset-0 z-[1]"
      />

      <ActionIcon
        label={isPaused ? 'Play' : 'Pause'}
        className="center relative flex"
        onClick={() => {
          if (isPaused) {
            controls.play()
          } else {
            controls.pause()
          }
        }}
      >
        <span className="center flex">
          <IconScaleTransition
            status={isPaused ? 'init' : 'done'}
            icon1="i-mingcute-play-fill size-5"
            icon2="i-mingcute-pause-fill size-5"
          />
        </span>
      </ActionIcon>

      {/* Progress bar */}
      <PlayProgressBar />

      {/* Right Action */}
      <m.div className="relative z-[1] flex items-center gap-2">
        <VolumeControl />
        <DownloadVideo />
        <FullScreenControl />
      </m.div>
    </m.div>
  )
})

const FullScreenControl = () => {
  const ref = useContextSelector(VideoPlayerContext, (v) => v.wrapperRef)
  const [isFullScreen, setIsFullScreen] = useState(!!document.fullscreenElement)

  useEffect(() => {
    const onFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', onFullScreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', onFullScreenChange)
    }
  }, [])

  return (
    <ActionIcon
      label={isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
      onClick={() => {
        if (!ref.current) return

        if (isFullScreen) {
          document.exitFullscreen()
        } else {
          ref.current.requestFullscreen()
        }
      }}
    >
      {isFullScreen ? (
        <i className="i-mingcute-fullscreen-2-fill size-5" />
      ) : (
        <i className="i-mingcute-fullscreen-exit-fill size-5" />
      )}
    </ActionIcon>
  )
}

const DownloadVideo = () => {
  const src = useContextSelector(VideoPlayerContext, (v) => v.src)
  const [isDownloading, setIsDownloading] = useState(false)
  const download = useEventCallback(() => {
    setIsDownloading(true)
    fetch(src)
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = src.split('/').pop()!
        a.click()
        URL.revokeObjectURL(url)
        setIsDownloading(false)
      })
  })

  return (
    <ActionIcon label="Download" onClick={download}>
      {isDownloading ? (
        <i className="i-mingcute-loading-3-fill size-5 animate-spin" />
      ) : (
        <i className="i-mingcute-download-2-fill size-5" />
      )}
    </ActionIcon>
  )
}
const VolumeControl = () => {
  const hasAudio = useContextSelector(
    VideoPlayerContext,
    (v) => v.state.hasAudio,
  )

  const controls = useContextSelector(VideoPlayerContext, (v) => v.controls)
  const volume = useContextSelector(VideoPlayerContext, (v) => v.state.volume)
  const muted = useContextSelector(VideoPlayerContext, (v) => v.state.muted)
  if (!hasAudio) return null
  return (
    <ActionIcon
      label={<VolumeSlider onVolumeChange={controls.volume} volume={volume} />}
      onClick={() => {
        if (muted) {
          controls.unmute()
        } else {
          controls.mute()
        }
      }}
    >
      {muted ? (
        <i className="i-mingcute-volume-mute-fill size-5" title="Mute" />
      ) : (
        <i className="i-mingcute-volume-fill size-5" title="Unmute" />
      )}
    </ActionIcon>
  )
}

const PlayProgressBar = () => {
  const { state, controls } = useContext(VideoPlayerContext)
  const [currentDragging, setCurrentDragging] = useState(false)
  const [dragTime, setDragTime] = useState(0)

  return (
    <Slider.Root
      className="relative z-[1] flex size-full items-center transition-all duration-200 ease-in-out"
      min={0}
      max={state.duration}
      step={0.01}
      value={[currentDragging ? dragTime : state.time]}
      onPointerDown={() => {
        if (state.playing) {
          controls.pause()
        }
        setDragTime(state.time)
        setCurrentDragging(true)
      }}
      onValueChange={(value) => {
        setDragTime(value[0]!)
        startTransition(() => {
          controls.seek(value[0]!)
        })
      }}
      onValueCommit={() => {
        controls.play()
        setCurrentDragging(false)
        controls.seek(dragTime)
      }}
    >
      <Slider.Track className="relative h-1 w-full grow rounded bg-white dark:bg-neutral-800">
        <Slider.Range className="absolute h-1 rounded bg-zinc-500/40 dark:bg-neutral-600" />
      </Slider.Track>

      {/* indicator */}
      <Slider.Thumb
        className="block h-3 w-[3px] rounded-[1px] bg-zinc-500 dark:bg-zinc-400"
        aria-label="Progress"
      />
    </Slider.Root>
  )
}

const ActionIcon = ({
  className,
  onClick,
  children,
  label,
}: {
  className?: string
  onClick?: () => void
  label: React.ReactNode
  children?: React.ReactNode
}) => {
  return (
    <FloatPopover
      type="tooltip"
      placement="top"
      wrapperClassName="flex center"
      triggerElement={
        <MotionButtonBase
          className={clsxm('z-[2] flex center', className)}
          onClick={onClick}
        >
          {children || <i className={className} />}
        </MotionButtonBase>
      }
    >
      {label}
    </FloatPopover>
  )
}
