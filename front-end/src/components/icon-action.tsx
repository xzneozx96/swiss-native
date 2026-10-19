import type { IconComponent } from '@/components/icons'

import { Button } from '@heroui/react'

/** An icon-only button with its label for screen readers (from upstream's content editor). */
export function IconAction({
  label,
  icon: Icon,
  isDisabled,
  className,
  buttonProps,
  onPress,
}: {
  label: string
  icon: IconComponent
  isDisabled?: boolean
  className?: string
  /** Extra class (a tone, a taller hit area) and data attribute for the button itself. */
  buttonProps?: { 'className'?: string, 'data-move'?: 'up' | 'down' }
  onPress: () => void
}) {
  return (
    <Button
      isIconOnly
      aria-label={label}
      isDisabled={isDisabled}
      size="sm"
      variant="tertiary"
      onPress={onPress}
      {...buttonProps}
    >
      <Icon aria-hidden className={className} size={18} />
    </Button>
  )
}
