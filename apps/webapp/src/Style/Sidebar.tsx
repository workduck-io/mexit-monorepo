import { Icon } from '@iconify/react'
import React from 'react'
import { animated } from 'react-spring'
import styled from 'styled-components'
import { PixelToCSS, ThinScrollbar } from './Helpers'

export const Sicon = styled(Icon)`
  height: 26px;
  width: 26px;
  padding-left: 7px;
  border-left: 1px solid ${({ theme }) => theme.colors.gray[7]};
  margin-left: -8px;
`
// Disabled as IconifyIcon type doesn't work
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const SIcon = (props: any) => {
  return <Sicon {...props} />
}

export const SidebarDiv = styled(animated.div)`
  height: 100%;
  padding-top: ${({ theme }) => theme.spacing.large};
  max-width: ${({ theme }) => PixelToCSS(theme.width.sidebar)};
  width: 100%;
`

export const SidebarContent = styled.div`
  ${ThinScrollbar};
  flex-grow: 1;
  overflow-x: hidden;
  max-height: 95vh;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.medium};
`
export const SectionHeading = styled.div`
  user-select: none;
  margin: ${({ theme }) => theme.spacing.medium} 0 ${({ theme }) => theme.spacing.small};
  display: flex;
  align-items: center;
  h2 {
    margin: 0;
    font-weight: normal;
    font-size: 1.2rem;
  }
  svg {
    margin-right: ${({ theme }) => theme.spacing.tiny};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

export const SidebarDivider = styled.div`
  height: 2px;
  background: ${({ theme }) => theme.colors.gray[8]};
  margin: ${({ theme }) => theme.spacing.large} 0;
`

export const SidebarSection = styled.div`
  color: ${({ theme }) => theme.colors.text.subheading};

  /* &.starred:hover {
    color: ${({ theme }) => theme.colors.palette.yellow};
  }
  &.tree:hover {
    color: ${({ theme }) => theme.colors.secondary};
  } */
`

// ============================
// Styles for the Sidebar Tree
// ============================
export const StyledTree = styled.div`
  .rc-tree-child-tree {
    display: block;
  }

  .node-motion {
    transition: all 0.3s;
    overflow-y: hidden;
  }

  .rc-tree {
    margin: 0;
    border: 1px solid transparent;
    .rc-tree-treenode {
      margin: 0;
      padding: 0;
      line-height: 24px;
      white-space: nowrap;
      list-style: none;
      height: 26px;
      outline: 0;

      .draggable {
        color: ${({ theme }) => theme.colors.text.subheading};
        -moz-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        user-select: none;
        -khtml-user-drag: element;
        -webkit-user-drag: element;
      }
      &.drop-container {
        & > .draggable {
          &::after {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            box-shadow: inset 0 0 2px 2px ${({ theme }) => theme.colors.primary};
            content: '';
          }
        }
        & ~ .rc-tree-treenode {
          border-left: 2px solid ${({ theme }) => theme.colors.primary};
        }
      }
      &.drop-target {
        background-color: ${({ theme }) => theme.colors.gray[7]};
        border: 1px solid ${({ theme }) => theme.colors.primary};
        border-radius: ${({ theme }) => theme.borderRadius.small};
        & ~ .rc-tree-treenode {
          border-left: none;
        }
      }
      &.filter-node {
        & > .rc-tree-node-content-wrapper {
          color: ${({ theme }) => theme.colors.primary} !important;
          font-weight: bold !important;
        }
      }
      ul {
        margin: 0;
        padding: 0 0 0 18px;
      }
      .rc-tree-node-content-wrapper {
        position: relative;
        display: inline-block;
        height: 24px;
        margin: 0;
        padding: 0 6px;
        text-decoration: none;
        vertical-align: top;
        cursor: pointer;
        border-radius: ${({ theme }) => theme.borderRadius.small};
        transition: 0.3s ease;
        &:hover {
          transition: 0s ease;
          background-color: ${({ theme }) => theme.colors.fade.primary};
          color: ${({ theme }) => theme.colors.text.oppositePrimary};
          .rc-tree-title {
            color: ${({ theme }) => theme.colors.text.oppositePrimary};
          }
        }
      }
      .rc-tree-node-selected {
        background-color: ${({ theme }) => theme.colors.primary};
        /* box-shadow: 0 0 0 1px #ffb951; */
        border-radius: ${({ theme }) => theme.borderRadius.small};
        /* opacity: 0.8; */
        .rc-tree-title {
          color: ${({ theme }) => theme.colors.text.oppositePrimary};
        }
      }
      span {
        &.rc-tree-icon_loading {
          margin-right: 2px;
          vertical-align: top;
          /* background: url('data:image/gif;'); */
        }
        &.rc-tree-switcher {
          color: ${({ theme }) => theme.colors.gray[6]};
          &.rc-tree-switcher-noop {
            cursor: auto;
          }
          &.rc-tree-switcher_open {
          }
          &.rc-tree-switcher_close {
            background-position: -75px -56px;
          }
          &:hover {
            color: ${({ theme }) => theme.colors.primary};
          }
        }
        &.rc-tree-checkbox {
          width: 13px;
          height: 13px;
          margin: 0 3px;
          background-position: 0 0;
          &.rc-tree-checkbox-checked {
            &.rc-tree-checkbox-disabled {
              background-position: -14px -56px;
            }
          }
          &.rc-tree-checkbox-indeterminate {
            &.rc-tree-checkbox-disabled {
              position: relative;
              background: #ccc;
              border-radius: 3px;
              &::after {
                position: absolute;
                top: 5px;
                left: 3px;
                width: 5px;
                height: 0;
                border: 2px solid #fff;
                border-top: 0;
                border-left: 0;
                -webkit-transform: scale(1);
                transform: scale(1);
                content: ' ';
              }
            }
          }
        }
        &.rc-tree-checkbox-checked {
          background-position: -14px 0;
        }
        &.rc-tree-checkbox-indeterminate {
          background-position: -14px -28px;
        }
        &.rc-tree-checkbox-disabled {
          background-position: 0 -56px;
        }
      }
    }
    &:not(.rc-tree-show-line) {
      .rc-tree-treenode {
        .rc-tree-switcher-noop {
          background: none;
        }
      }
    }
    &.rc-tree-show-line {
      .rc-tree-treenode {
        &:not(:last-child) {
          & > ul {
            /* background: url('data:image/gif;'); */
            background-color: ${({ theme }) => theme.colors.primary};
          }
          & > .rc-tree-switcher-noop {
            background-position: -56px -18px;
          }
        }
        &:last-child {
          & > .rc-tree-switcher-noop {
            background-position: -56px -36px;
          }
        }
      }
    }
  }
  .rc-tree-focused {
    &:not(.rc-tree-active-focused) {
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
  .rc-tree .rc-tree-treenode span.rc-tree-switcher,
  .rc-tree .rc-tree-treenode span.rc-tree-checkbox,
  .rc-tree .rc-tree-treenode span.rc-tree-iconEle {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 2px;
    line-height: 16px;
    vertical-align: -0.125em;
    background-color: transparent;
    /* background-image: url('data:image/png;'); */
    background-repeat: no-repeat;
    background-attachment: scroll;
    border: 0 none;
    outline: none;
    cursor: pointer;
  }
  .rc-tree .rc-tree-treenode span.rc-tree-switcher.rc-tree-icon__customize,
  .rc-tree .rc-tree-treenode span.rc-tree-checkbox.rc-tree-icon__customize,
  .rc-tree .rc-tree-treenode span.rc-tree-iconEle.rc-tree-icon__customize {
    background-image: none;
  }
  .rc-tree-child-tree {
    display: none;
  }
  .rc-tree-child-tree-open {
    display: block;
  }
  .rc-tree-treenode-disabled > span:not(.rc-tree-switcher),
  .rc-tree-treenode-disabled > a,
  .rc-tree-treenode-disabled > a span {
    color: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
  }
  .rc-tree-treenode-active {
    background-color: ${({ theme }) => theme.colors.gray[8]};
  }

  .rc-tree-icon__open {
    margin-right: 2px;
    vertical-align: top;
    background-position: -110px -16px;
  }
  .rc-tree-icon__close {
    margin-right: 2px;
    vertical-align: top;
    background-position: -110px 0;
  }
  .rc-tree-icon__docu {
    margin-right: 2px;
    vertical-align: top;
    background-position: -110px -32px;
  }
  .rc-tree-icon__customize {
    margin-right: 2px;
    vertical-align: top;
  }
  .rc-tree-title {
    display: inline-block;
  }
  .rc-tree-indent {
    display: inline-block;
    vertical-align: bottom;
    height: 0;
  }
  .rc-tree-indent-unit {
    width: 16px;
    display: inline-block;
  }
`

export const SRCIcon = styled.span`
  height: 24px;
  color: ${({ theme }) => theme.colors.primary};
`
