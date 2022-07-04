import styled, { css } from 'styled-components'
import { transparentize } from 'polished'

export const StyledProgressBar = styled.section<{ percentage: number }>`
  section {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 2em;
    padding: 0;
  }

  section article {
    align-self: center;
    width: 20em;
    margin-bottom: 2em;
  }

  .chart {
    font-size: 1em;
    perspective: 1000px;
    perspective-origin: 50% 50%;
    -webkit-backface-visibility: visible;
    backface-visibility: visible;
  }

  .bar {
    font-size: 1em;
    position: relative;
    height: 10em;
    transition: all 0.3s ease-in-out;
    transform: rotateX(60deg) rotateY(0deg);
    transform-style: preserve-3d;
  }

  .bar .face {
    font-size: 2em;
    position: relative;
    width: 100%;
    height: 2em;
    background-color: ${({ theme }) => transparentize(0.5, theme.colors.secondary)};
  }
  .bar .face.side-a,
  .bar .face.side-b {
    width: 2em;
  }
  .bar .side-a {
    transform: rotateX(90deg) rotateY(-90deg) translateX(2em) translateY(1em) translateZ(1em);
  }
  .bar .side-b {
    transform: rotateX(90deg) rotateY(-90deg) translateX(4em) translateY(1em) translateZ(-1em);
    position: absolute;
    right: 0;
  }
  .bar .side-0 {
    transform: rotateX(90deg) rotateY(0) translateX(0) translateY(1em) translateZ(-1em);
  }
  .bar .side-1 {
    transform: rotateX(90deg) rotateY(0) translateX(0) translateY(1em) translateZ(3em);
  }
  .bar .top {
    transform: rotateX(0deg) rotateY(0) translateX(0em) translateY(4em) translateZ(2em);
  }

  .bar .floor {
    box-shadow: 0 0.1em 0.6em rgba(0, 0, 0, 0.3), 0.6em -0.5em 3em rgba(0, 0, 0, 0.3), 1em -1em 8em #eee;
  }

  .growing-bar {
    transition: all 0.3s ease-in-out;
    background-color: ${({ theme }) => transparentize(0.4, theme.colors.primary)};
    width: 100%;
    height: 2em;
  }

  .bar.red .side-a,
  .bar.red .growing-bar {
    background-color: ${({ theme }) => transparentize(0.4, theme.colors.primary)};
  }
  .bar.red .side-0 .growing-bar {
    box-shadow: -0.5em -1.5em 4em ${({ theme }) => transparentize(0.2, theme.colors.primary)};
  }
  .bar.red .floor .growing-bar {
    box-shadow: 0em 0em 2em ${({ theme }) => transparentize(0.2, theme.colors.primary)};
  }

  .bar .growing-bar {
    ${({ percentage }) =>
      percentage &&
      css`
        width: ${percentage}%;
      `}
  }
`
