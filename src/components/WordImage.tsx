import { emojiImage } from '@/assets/emoji'

type WordImageProps = {
  emoji: string
  /** Rendered size in pixels. */
  size?: number
  className?: string
  alt?: string
}

/**
 * Renders the downloaded illustration for a vocabulary emoji.
 * Falls back to the emoji glyph when no image was downloaded.
 */
export default function WordImage({ emoji, size = 48, className = '', alt = '' }: WordImageProps) {
  const src = emojiImage(emoji)

  if (!src) {
    return (
      <span
        className={`inline-flex items-center justify-center leading-none ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.9 }}
        aria-hidden
      >
        {emoji}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
      draggable={false}
    />
  )
}
