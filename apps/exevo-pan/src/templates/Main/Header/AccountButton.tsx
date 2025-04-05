import { useRef, useState } from 'react'
import clsx from 'clsx'
import { useTranslations } from 'contexts/useTranslation'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'
import {
  DashboardIcon,
  LoginIcon,
  LogoutIcon,
  PersonRoundedIcon,
} from 'assets/svgs'
import { addLocalePrefix } from 'utils'
import { routes } from 'Constants'
import { useLocalizedHref } from 'hooks/useLocalizedHref'
import useHeaderPopup from './useHeaderPopup'

type AccountButtonProps = {
  variant?: 'onPrimary' | 'onSurface'
}

const AccountButton = ({
  variant = 'onPrimary',
}: AccountButtonProps): JSX.Element => {
  const { common } = useTranslations()

  const [fallbackAvatar, setFallbackAvatar] = useState(false)

  const { status, data } = useSession()
  const ref = useRef<HTMLDivElement>(null)

  const { buttonBinders, action, Popup } = useHeaderPopup(ref)

  const { locale } = useRouter()

  const loginRoute = useLocalizedHref(routes.LOGIN)
  const dashboardRoute = useLocalizedHref(routes.DASHBOARD.ROOT)

  return (
    <div className="h8 grid h-8 w-8 place-items-center" ref={ref}>
      {
        {
          loading: null,
          unauthenticated: (
            <a
              href={loginRoute}
              className={clsx(
                'animate-fadeIn grid place-items-center gap-0.5 whitespace-nowrap text-xs',
                variant === 'onPrimary' && 'text-onPrimary',
                variant === 'onSurface' && 'text-onSurface',
              )}
            >
              <LoginIcon
                className={clsx(
                  'h-4 w-4',
                  variant === 'onPrimary' && '!fill-onPrimary',
                  variant === 'onSurface' && '!fill-onSurface',
                )}
              />
              Login
            </a>
          ),
          authenticated: data?.user ? (
            <>
              <Popup>
                <div className="child:px-6 child:py-3 text-s child:cursor-pointer child:items-center child:flex child:gap-2 child:text-onSurface child:text-left grid">
                  <span
                    className={clsx(
                      '!hover:bg-surface pointer-events-none tracking-wide',
                      data.user.proStatus ? '!text-rare' : '!text-separator',
                    )}
                  >
                    {data.user.name}
                  </span>

                  <div
                    role="none"
                    className="bg-separator opacity-50"
                    style={{ padding: 0, height: 1 }}
                  />

                  <a
                    className="hover:bg-primaryVariant"
                    href={dashboardRoute}
                    onClick={action.close}
                    role="menuitem"
                  >
                    <DashboardIcon className="fill-onSurface h-4 w-4" />
                    {common.Header.AccountButton.dashboard}
                  </a>
                  <button
                    className="hover:bg-primaryVariant"
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      action.close()
                      signOut({
                        callbackUrl: addLocalePrefix({
                          route: routes.HOME,
                          locale,
                          absolute: true,
                        }),
                      })
                    }}
                  >
                    <LogoutIcon className="fill-onSurface h-4 w-4" />
                    {common.Header.AccountButton.logout}
                  </button>
                </div>
              </Popup>
              <button
                type="button"
                onClick={action.open}
                aria-label={common.Header.openUserMenu}
                {...buttonBinders}
              >
                {fallbackAvatar ? (
                  <PersonRoundedIcon
                    width={32}
                    height={32}
                    className={clsx(
                      'clickable animate-fadeIn rounded-full border-2 border-solid shadow transition-colors',
                      variant === 'onSurface' && 'fill-onSurface',
                      variant === 'onPrimary' && 'fill-onPrimary',
                      data.user.proStatus
                        ? 'border-rare'
                        : 'border-primaryVariant',
                    )}
                  />
                ) : (
                  <img
                    src={data.user.picture}
                    alt={data.user.name}
                    width={32}
                    height={32}
                    onError={() => setFallbackAvatar(true)}
                    className={clsx(
                      'clickable animate-fadeIn rounded-full border-2 border-solid shadow',
                      data.user.proStatus
                        ? 'border-rare'
                        : 'border-primaryVariant',
                    )}
                  />
                )}
              </button>
            </>
          ) : null,
        }[status]
      }
    </div>
  )
}

export default AccountButton
