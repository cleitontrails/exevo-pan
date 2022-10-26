import { useTranslations } from 'contexts/useTranslation'
import { useState, useCallback } from 'react'
import clsx from 'clsx'
import { useUuid } from 'hooks'
import { ChevronDownIcon } from 'assets/svgs'
import { AccordionProps } from './types'

const Accordion = ({
  title,
  initialValue = false,
  open: openProp,
  onClick,
  border = false,
  children,
  ...props
}: AccordionProps) => {
  const {
    translations: { common },
  } = useTranslations()

  const buttonId = useUuid()
  const contentId = useUuid()

  const [innerOpen, setOpen] = useState(initialValue)
  const open = openProp ?? innerOpen

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setOpen((prev) => !prev)
      onClick?.(event)
    },
    [onClick],
  )

  return (
    <div {...props}>
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        aria-label={common.Accordion[open ? 'close' : 'open']}
        onClick={handleClick}
        suppressHydrationWarning
        className={clsx(
          'text-onSurface text-tsm flex w-full cursor-pointer items-center justify-between transition-all',
          border && 'border-separator',
          open ? 'py-2' : 'py-1',
        )}
        style={{
          borderBottomStyle: 'solid',
          borderBottomWidth: border ? '1px' : 0,
        }}
      >
        {title}
        <ChevronDownIcon
          className="fill-onSurface ml-auto shrink-0 rounded transition-all"
          style={{ transform: clsx(open && 'rotate(180deg)') }}
        />
      </button>
      <div id={contentId} aria-describedby={buttonId} suppressHydrationWarning>
        {open && children}
      </div>
    </div>
  )
}

export default Accordion
