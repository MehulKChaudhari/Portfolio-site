function generateWavePath(centerX, centerY, baseRadius, amplitude, numWaves, startAngle = 0) {
  const points = []
  const angleStep = 1.5
  const totalPoints = Math.floor(360 / angleStep)

  for (let i = 0; i <= totalPoints; i++) {
    const angle = ((i * angleStep + startAngle) * Math.PI) / 180
    const wavePhase = (i * numWaves * angleStep * Math.PI) / 180
    const radius = baseRadius + amplitude * Math.sin(wavePhase)
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    points.push(i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : `L ${x.toFixed(2)} ${y.toFixed(2)}`)
  }

  return points.join(' ') + ' Z'
}

export function AvatarWaveAnimation({ gradientIdPrefix = 'avatar-wave' }) {
  // Generate multiple waves with varying sizes - some bigger, some smaller
  const waves = [
    { amplitude: 2.8, numWaves: 6, radius: 47, startAngle: 0, opacity: 0.75 },
    { amplitude: 1.2, numWaves: 10, radius: 45, startAngle: 25, opacity: 0.65 },
    { amplitude: 3.2, numWaves: 5, radius: 47.5, startAngle: 50, opacity: 0.8 },
    { amplitude: 1.5, numWaves: 9, radius: 45.5, startAngle: 75, opacity: 0.7 },
    { amplitude: 2.5, numWaves: 7, radius: 46.5, startAngle: 100, opacity: 0.72 },
    { amplitude: 1.8, numWaves: 11, radius: 45.2, startAngle: 125, opacity: 0.68 },
  ]

  return (
    <div className="avatar-wave-container">
      <svg className="avatar-wave-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={`${gradientIdPrefix}-gradient-1`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#14b8a6" stopOpacity="1" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id={`${gradientIdPrefix}-gradient-2`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id={`${gradientIdPrefix}-gradient-3`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        {waves.map((wave, index) => {
          const pathData = generateWavePath(50, 50, wave.radius, wave.amplitude, wave.numWaves, wave.startAngle)
          const gradientId = `${gradientIdPrefix}-gradient-${(index % 3) + 1}`
          const rotation = index % 2 === 0 ? 0 : 180

          return (
            <path
              key={index}
              className={`avatar-wave-path avatar-wave-path-${(index % 2) + 1}`}
              d={pathData}
              fill={`url(#${gradientId})`}
              opacity={wave.opacity}
              transform={rotation !== 0 ? `rotate(${rotation} 50 50)` : undefined}
              style={{
                animationDelay: `${index * 0.3}s`,
              }}
            />
          )
        })}
      </svg>
    </div>
  )
}

