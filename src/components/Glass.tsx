import { motion, type HTMLMotionProps } from 'framer-motion'
import { forwardRef, type ReactNode } from 'react'

type GlassProps = HTMLMotionProps<'div'> & {
  children?: ReactNode
  strong?: boolean
  spec?: boolean
  className?: string
}

/** A liquid-glass surface: frosted, translucent, with a specular rim highlight. */
export const Glass = forwardRef<HTMLDivElement, GlassProps>(
  ({ children, strong, spec = true, className = '', ...rest }, ref) => (
    <motion.div
      ref={ref}
      className={[
        'glass',
        strong ? 'glass-strong' : '',
        spec ? 'glass-spec' : '',
        'rounded-4xl',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </motion.div>
  ),
)
Glass.displayName = 'Glass'

/** Interactive glass with a springy press + hover lift. */
export function GlassButton({
  children,
  className = '',
  ...rest
}: HTMLMotionProps<'button'> & { children?: ReactNode; className?: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 420, damping: 26 }}
      className={[
        'glass glass-spec rounded-2xl px-4 py-2.5 text-sm font-medium text-white/90',
        'hover:bg-white/10 transition-colors',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
