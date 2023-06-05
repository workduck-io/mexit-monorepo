import styled from 'styled-components'

import { Button } from '@workduck-io/mex-components'

export const StyledButton = styled(Button)`
  font-size: 14px !important;
`

// export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
//   primary?: boolean
//   large?: boolean
//   highlight?: boolean
//   transparent?: boolean
// }

// export const Button = styled.button<ButtonProps>`
//   ${centeredCss};
//   gap: ${({ theme }) => theme.spacing.small};
//   border-radius: ${({ theme }) => theme.borderRadius.small};
//   border: none;
//   outline: none;
//   color: ${({ theme }) => theme.colors.text.subheading};
//   cursor: pointer;
//   transition: 0.3s ease;
//   background-color: ${({ theme }) => theme.colors.form.button.bg};

//   flex-shrink: 0;

//   &:focus {
//     color: ${({ theme }) => theme.colors.primary};
//     box-shadow: 0px 6px 12px ${({ theme }) => transparentize(0.75, theme.colors.primary)};
//   }

//   &:hover {
//     color: ${({ theme }) => theme.colors.primary};
//     box-shadow: 0px 6px 12px ${({ theme }) => transparentize(0.75, theme.colors.primary)};
//   }

//   &:disabled {
//     /* background-color: ${({ theme }) => theme.colors.form.button.bg}; */
//     color: ${({ theme }) => transparentize(0.5, theme.colors.form.button.fg)};
//     cursor: not-allowed;
//     pointer-events: none;
//   }

//   ${({ theme: { spacing }, large }) =>
//     large
//       ? css`
//           padding: ${`${spacing.small} ${spacing.medium}`};
//           margin: 0 ${spacing.small};
//           font-size: 1.2rem;
//         `
//       : css`
//           padding: ${spacing.small};
//           margin: 0 ${spacing.tiny};
//         `}

//   ${({ theme, primary }) =>
//     primary
//       ? css`
//           background-color: ${theme.colors.primary};
//           color: ${theme.colors.text.oppositePrimary};
//           &:hover {
//             background-color: ${theme.colors.fade.primary};
//             color: ${theme.colors.text.oppositePrimary};
//           }
//           &:disabled {
//             background-color: ${({ theme }) => theme.colors.gray[6]};
//             cursor: default;
//           }
//           &:focus {
//             color: ${theme.colors.text.oppositePrimary};
//             box-shadow: 0px 6px 12px ${({ theme }) => transparentize(0.75, theme.colors.primary)};
//           }
//         `
//       : ''}

//   ${({ theme, highlight }) =>
//     highlight
//       ? css`
//           background-color: ${theme.colors.primary};
//           color: ${theme.colors.text.oppositePrimary};
//           box-shadow: 0px 4px 8px ${({ theme }) => transparentize(0.33, theme.colors.primary)};
//           &:hover {
//             background-color: ${theme.colors.fade.primary};
//             color: ${theme.colors.text.oppositePrimary};
//           }
//           &:disabled {
//             background-color: ${({ theme }) => theme.colors.gray[6]};
//           }
//         `
//       : ''}

//        ${({ primary, transparent, theme }) =>
//     !primary &&
//     transparent &&
//     css`
//       background-color: transparent;
//       &:hover {
//         background-color: ${theme.colors.form.button.bg};
//       }
//       &:disabled {
//         background-color: ${({ theme }) => theme.colors.gray[6]};
//         cursor: default;
//       }
//     `}
// `

// export type IconButtonProps = {
//   icon: any // eslint-disable-line @typescript-eslint/no-explicit-any
//   title: string
//   size?: string | number
//   onClick?: any // eslint-disable-line @typescript-eslint/no-explicit-any
//   singleton?: TippyProps['singleton']
//   transparent?: boolean
//   highlight?: boolean
//   disabled?: boolean
//   color?: string
//   shortcut?: string
// }

// export const HeadlessButton = styled.button`
//   border: none;
//   background: transparent;
// `

// export const IconButton = ({
//   icon,
//   disabled,
//   title,
//   size,
//   onClick,
//   transparent,
//   shortcut,
//   highlight,
//   color,
//   singleton
// }: IconButtonProps) => {
//   return (
//     <ToolbarTooltip
//       content={
//         shortcut !== undefined ? <TooltipTitleWithShortcut shortcut={shortcut} title={title} /> : <span>{title}</span>
//       }
//       singleton={singleton}
//     >
//       <span>
//         <Button
//           transparent={transparent !== undefined ? transparent : true}
//           disabled={disabled}
//           onClick={onClick}
//           highlight={highlight}
//         >
//           <Icon color={color} icon={icon} height={size} />
//         </Button>
//       </span>
//     </ToolbarTooltip>
//   )
// }

// export interface AsyncButtonProps {
//   children?: React.ReactNode
//   primary?: boolean
//   large?: boolean
//   highlight?: boolean
//   disabled?: boolean
//   style?: any
//   id?: string
//   onClick?: any // eslint-disable-line @typescript-eslint/no-explicit-any
//   type?: 'button' | 'submit' | 'reset'
//   transparent?: boolean
// }

// export const AsyncButton = styled.button<AsyncButtonProps>`
//   ${centeredCss};
//   border-radius: ${({ theme }) => theme.borderRadius.small};
//   color: ${({ theme }) => theme.colors.text.subheading};
//   cursor: pointer;
//   transition: 0.3s ease;
//   background-color: ${({ theme }) => theme.colors.form.button.bg};

//   ${({ primary, transparent, theme }) =>
//     !primary &&
//     transparent &&
//     css`
//       background-color: transparent;
//       &:hover {
//         background-color: ${theme.colors.form.button.bg};
//       }
//     `}

//   ${({ theme, large }) =>
//     large
//       ? css`
//           padding: ${`${theme.spacing.small} ${theme.spacing.medium}`};
//           font-size: 1.2rem;
//         `
//       : css`
//           padding: ${({ theme }) => theme.spacing.small};
//         `}

//   ${({ theme, highlight, primary }) =>
//     highlight
//       ? css`
//           background-color: ${theme.colors.primary};
//           color: ${theme.colors.text.oppositePrimary};
//           box-shadow: 0px 4px 8px
//             ${({ theme }) => transparentize(0.33, primary ? theme.colors.primary : theme.colors.palette.black)};
//         `
//       : ''}

//   ${({ theme, primary }) => css`
//     &:hover {
//       box-shadow: 0px 6px 12px ${transparentize(0.5, primary ? theme.colors.primary : theme.colors.palette.black)};
//     }
//   `}

//   ${({ theme, primary }) =>
//     primary
//       ? css`
//           background-color: ${theme.colors.primary};
//           color: ${theme.colors.text.oppositePrimary};
//           &:hover {
//             background-color: ${theme.colors.fade.primary};
//             color: ${theme.colors.text.oppositePrimary};
//           }
//         `
//       : ''}

//   ${({ theme, disabled }) =>
//     disabled
//       ? css`
//           pointer-events: none;
//           background-color: ${theme.colors.gray[9]};
//           color: ${transparentize(0.75, theme.colors.text.fade)};
//         `
//       : ''}

//   ${LoadingWrapper} {
//     position: absolute;
//     margin: auto;
//   }
// `

// export const GoogleAuthButton = styled.button<AsyncButtonProps>`
//   ${centeredCss};
//   border: none;
//   border-radius: ${({ theme }) => theme.borderRadius.small};
//   color: ${() => '#000000'};
//   cursor: pointer;
//   transition: 0.3s ease;
//   background-color: ${() => '#ffffff'};

//   ${({ theme, large }) =>
//     large
//       ? css`
//           padding: ${`${theme.spacing.small} ${theme.spacing.medium}`};
//           font-size: 1.2rem;
//         `
//       : css`
//           padding: ${({ theme }) => theme.spacing.small};
//         `}

//   ${({ theme, highlight, primary }) =>
//     highlight
//       ? css`
//           background-color: ${theme.colors.primary};
//           color: ${theme.colors.text.oppositePrimary};
//           box-shadow: 0px 4px 8px
//             ${({ theme }) => transparentize(0.33, primary ? theme.colors.primary : theme.colors.palette.black)};
//         `
//       : ''}

//   ${({ theme, primary }) => css`
//     &:hover {
//       box-shadow: 0px 6px 12px ${transparentize(0.5, primary ? theme.colors.primary : theme.colors.palette.black)};
//     }
//   `}

//   ${({ theme, primary }) =>
//     primary
//       ? css`
//           background-color: ${theme.colors.primary};
//           color: ${theme.colors.text.oppositePrimary};
//           &:hover {
//             background-color: ${theme.colors.fade.primary};
//             color: ${theme.colors.text.oppositePrimary};
//           }
//         `
//       : ''}

//   ${({ theme, disabled }) =>
//     disabled
//       ? css`
//           pointer-events: none;
//           background-color: ${theme.colors.gray[9]};
//           color: ${transparentize(0.75, theme.colors.text.fade)};
//         `
//       : ''}

//   ${LoadingWrapper} {
//     position: absolute;
//     margin: auto;
//   }
// `
