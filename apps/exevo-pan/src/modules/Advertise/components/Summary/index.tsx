/* eslint-disable jsx-a11y/heading-has-content */
import clsx from 'clsx'
import { useMemo } from 'react'
import { useTranslations } from 'contexts/useTranslation'
import { Tooltip } from 'components/Organisms'
import { mmddyyyy2ddmmyyy, sortStringDates } from 'utils'
import { ReceiptIcon } from 'assets/svgs'
import { useForm } from '../../contexts/Form'
import { calculatePrice, readablePrice } from '../../utils'

const Strong = ({ className, ...props }: JSX.IntrinsicElements['h3']) => (
  <h3
    className={clsx('mb-0.5 text-base tracking-wide', className)}
    {...props}
  />
)

const SubText = ({ className, ...props }: JSX.IntrinsicElements['p']) => (
  <p className={clsx('text-tsm font-light', className)} {...props} />
)

const Summary = () => {
  const {
    translations: { common, advertise },
  } = useTranslations()

  const { selectedCharacter, selectedDates, paymentMethod } = useForm()

  const formattedDates = useMemo(
    () => selectedDates.map(mmddyyyy2ddmmyyy).sort(sortStringDates),
    [selectedDates],
  )

  return (
    <section className="card grid gap-4 p-4">
      <h2
        className="border-separator -mb-1 flex items-center border-solid pb-1 text-2xl"
        style={{ borderWidth: 0, borderBottomWidth: 1 }}
      >
        <ReceiptIcon className="fill-onSurface mr-1.5" />
        {advertise.PaymentDetails.Summary.title}
      </h2>

      <div>
        <Strong>
          {selectedCharacter?.nickname}{' '}
          <a
            href={`https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades&page=details&auctionid=${selectedCharacter?.id}&source=overview`}
            target="_blank"
            rel="noreferrer noopener"
            className="text-tsm text-onSurface relative font-light tracking-widest"
          >
            (#{selectedCharacter?.id})
          </a>
        </Strong>
        <SubText>{advertise.PaymentDetails.Summary.auctionedCharacter}</SubText>
      </div>

      <div>
        <Strong>
          {selectedDates.length}{' '}
          <Tooltip
            className="w-[160px]"
            content={
              <>
                <p className="mb-2 font-bold">
                  {advertise.PaymentDetails.Summary.datesTooltipText}
                </p>

                <ul className="grid gap-[3px] text-left">
                  {formattedDates.map((fullDate) => (
                    <li
                      key={fullDate}
                      className="before:mr-[3px] before:font-bold before:content-['·']"
                    >
                      {fullDate}
                    </li>
                  ))}
                </ul>
              </>
            }
          >
            <Strong
              className="border-onSurface inline border-dashed"
              style={{ borderWidth: 0, borderBottomWidth: 1 }}
            >
              {common[selectedDates.length > 1 ? 'days' : 'day']}
            </Strong>
          </Tooltip>
        </Strong>
        <SubText>{advertise.PaymentDetails.Summary.durationText}</SubText>
      </div>

      <div>
        <Strong>
          {readablePrice.full[paymentMethod](
            calculatePrice(selectedDates.length, paymentMethod).totalPrice,
          )}
        </Strong>
        <SubText>{advertise.PaymentDetails.Summary.costText}</SubText>
      </div>
    </section>
  )
}

export default Summary
