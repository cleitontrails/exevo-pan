import { useTranslations } from 'contexts/useTranslation'
import { OfferIcon } from 'assets/svgs'
import { calculatePrice, readablePrice, getDiscountTier } from '../../../utils'
import * as S from './atoms'
import { DiscountProps } from './types'

const Discount = ({ daysCount, paymentMethod }: DiscountProps) => {
  const {
    translations: { advertise },
  } = useTranslations()

  const { totalPrice, saved, offPercentage } = calculatePrice(
    daysCount,
    paymentMethod,
  )

  const readableOffer = readablePrice.short[paymentMethod](totalPrice)
  const readableOriginalPrice = readablePrice.short[paymentMethod](
    totalPrice + saved,
  )

  const discountTier = getDiscountTier(daysCount)
  const noDiscount = daysCount <= 1

  return (
    <div className="card grid gap-4 p-4">
      <h2
        className="border-separator -mb-1 flex items-center border-solid pb-1 text-2xl"
        style={{ borderWidth: 0, borderBottomWidth: 1 }}
      >
        <OfferIcon className="fill-onSurface mr-1.5 transition-colors" />
        {advertise.Discount.title}
      </h2>

      <S.Group>
        <S.Small>{advertise.Discount.description}</S.Small>
        <div className="flex items-center gap-1.5">
          <S.Strong>{readableOffer}</S.Strong>{' '}
          <S.Striked className={noDiscount ? 'opacity-0' : 'opacity-100'}>
            {readableOriginalPrice}
          </S.Striked>{' '}
          <S.DiscountTag className={noDiscount ? 'opacity-0' : 'opacity-100'}>
            -{offPercentage}
          </S.DiscountTag>
        </div>
      </S.Group>

      <S.Group>
        <S.Small>Tier {discountTier}</S.Small>
        <S.Bar>
          <S.TierSeparator data-tier={2} />
          <S.TierSeparator data-tier={3} />
          <S.Fill
            data-tier={discountTier}
            data-progress={daysCount}
            data-empty={daysCount === 0}
          />
        </S.Bar>
      </S.Group>
    </div>
  )
}

export default Discount
