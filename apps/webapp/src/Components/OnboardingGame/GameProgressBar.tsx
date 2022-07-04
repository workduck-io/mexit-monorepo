import React from 'react'
import { StyledProgressBar } from './styled'

type GameProgressBarProps = {
  percentage: number
}

const GameProgressBar: React.FC<GameProgressBarProps> = ({ percentage }) => {
  return (
    <StyledProgressBar percentage={percentage}>
      <article>
        <div className="chart">
          <div className="bar red">
            <div className="face top">
              <div className="growing-bar" />
            </div>
            <div className="face side-0">
              <div className="growing-bar" />
            </div>
            <div className="face floor">
              <div className="growing-bar" />
            </div>
            <div className="face side-a" />
            <div className="face side-b" />
            <div className="face side-1">
              <div className="growing-bar" />
            </div>
          </div>
        </div>
      </article>
    </StyledProgressBar>
  )
}

export default GameProgressBar
