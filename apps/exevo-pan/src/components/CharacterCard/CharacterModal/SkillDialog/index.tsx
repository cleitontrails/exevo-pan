/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useMemo, useCallback } from 'react'
import clsx from 'clsx'
import { useTranslations } from 'contexts/useTranslation'
import NextLink from 'next/link'
import { Dialog, Slider, Chip, Text } from 'components/Atoms'
import { ChipGroup, InfoTooltip } from 'components/Organisms'
import { useStoredState } from 'hooks'
import { generateLoyaltyMarks, skillAfterLoyalty } from 'utils'
import { ExternalIcon } from 'assets/svgs'
import { routes } from 'Constants'
import { parameterNames } from 'modules/Calculators/modules/ExerciseWeapons/CharacterConfig/constants'
import SkillBar from '../../Parts/SkillBar'
import {
  getInitialSkill,
  calculateMinimumSkillCost,
  getVocationName,
  getSkillType,
  getPercentageLeft,
} from './utils'
import { skillOptions } from './options'
import { SkillDialogProps, Skill } from './types'

const Group = ({ className, ...props }: JSX.IntrinsicElements['div']) => (
  <div className={clsx('grid gap-2', className)} {...props} />
)

const SkillDialog = ({
  vocationId,
  skills,
  ...dialogProps
}: SkillDialogProps) => {
  const {
    translations: { common },
  } = useTranslations()

  const [loyaltyBonus, setLoyaltyBonus] = useStoredState('cm-loyalty', 0)

  const [skill, setSkill] = useState<Skill>(() => getInitialSkill(skills))
  const selectedSkillValue = skills[skill]
  const integerSelectedSkillValue = Math.floor(selectedSkillValue)
  const skillType = getSkillType(skill)
  const vocation = getVocationName(vocationId)

  const skillCost = calculateMinimumSkillCost({
    currentSkill: skill === 'magic' ? 0 : 10,
    targetSkill: integerSelectedSkillValue,
    loyaltyBonus: 0,
    percentageLeft: 100,
    skill: skillType,
    vocation,
  })

  const skillWithLoyalty = skillAfterLoyalty({
    skillValue: selectedSkillValue,
    skill: skillType,
    vocation,
    loyaltyBonus,
  })

  const integerSkillWithLoyalty = Math.floor(skillWithLoyalty)
  const percentageLeft = getPercentageLeft(skillWithLoyalty)

  return (
    <Dialog
      className="grid"
      heading={common.CharacterCard.CharacterModal.SkillDialog.heading}
      {...dialogProps}
    >
      <div className="grid w-fit gap-6">
        <ChipGroup
          label="Skill"
          options={skillOptions}
          value={skill}
          onChange={(e) => setSkill(e.target.value as Skill)}
        />
        <Slider
          label="Loyalty"
          min={0}
          max={50}
          step={5}
          displayValue
          transformDisplayedValues={useCallback(
            (value) =>
              value
                ? `${value * 72} ${
                    common.CharacterCard.CharacterModal.SkillDialog
                      .loyaltyPoints
                  }`
                : common.CharacterCard.CharacterModal.SkillDialog.none,
            [common],
          )}
          marks={useMemo(
            () =>
              generateLoyaltyMarks(
                common.CharacterCard.CharacterModal.SkillDialog.none,
              ),
            [common],
          )}
          value={loyaltyBonus}
          onChange={(e) => setLoyaltyBonus(+e.target.value)}
        />

        <div
          className="border-separator text-tsm grid justify-between gap-6 border-0 border-solid pt-6 sm:flex"
          style={{ borderTopWidth: 1 }}
        >
          <Group>
            <InfoTooltip.LabelWrapper className="font-bold">
              {common.CharacterCard.CharacterModal.SkillDialog.skillValue}
              <InfoTooltip
                labelSize
                content={
                  <p className="max-w-[180px] leading-relaxed">
                    {common.CharacterCard.CharacterModal.SkillDialog.tooltip}:{' '}
                    <strong>exercise weapons</strong>,{' '}
                    <strong>exercise dummy</strong> {common.and}{' '}
                    <strong>double XP/Skill event</strong>.
                  </p>
                }
              />
            </InfoTooltip.LabelWrapper>
            <div className="flex items-center gap-2">
              <Chip gray>
                <Text.GoldCoin value={skillCost.gold} />
              </Chip>
              <small className="font-thin">{common.or}</small>
              <Chip gray>
                <Text.TibiaCoin value={skillCost.tc} />
              </Chip>
            </div>
          </Group>

          <Group className="min-w-fit">
            <strong className="whitespace-nowrap pr-6">
              {common.CharacterCard.CharacterModal.SkillDialog.skillWithLoyalty}
            </strong>
            <SkillBar
              skillName={`${skill} (+${
                Math.floor(skillWithLoyalty) - integerSelectedSkillValue
              })`}
              skillValue={skillWithLoyalty}
            />
          </Group>
        </div>
      </div>

      <NextLink
        href={`${routes.EXERCISE_WEAPONS}?${[
          `${parameterNames.vocation}=${vocation}`,
          `${parameterNames.skill}=${skillType}`,
          `${parameterNames.currentSkill}=${integerSkillWithLoyalty}`,
          `${parameterNames.targetSkill}=${integerSkillWithLoyalty}`,
          `${parameterNames.percentageLeft}=${percentageLeft}`,
          `${parameterNames.loyalty}=${loyaltyBonus}`,
        ].join('&')}`}
      >
        <a
          className="text-primaryHighlight clickable mt-8 ml-auto flex items-center gap-1.5 rounded px-1 py-0.5"
          target="_blank"
        >
          {common.CharacterCard.CharacterModal.SkillDialog.externalCalculator}
          <ExternalIcon className="fill-onSurface mb-[1px] h-4 w-4 shrink-0" />
        </a>
      </NextLink>
    </Dialog>
  )
} // ti amamus papai

export default SkillDialog
