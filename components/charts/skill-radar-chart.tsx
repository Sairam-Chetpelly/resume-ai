"use client"

import { useEffect, useRef } from "react"

interface SkillData {
  skill: string
  level: number
}

interface SkillRadarChartProps {
  skills: SkillData[]
  className?: string
}

export function SkillRadarChart({ skills, className }: SkillRadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 300
    canvas.height = 300

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = 120

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background circles
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI)
      ctx.stroke()
    }

    // Draw axes
    const angleStep = (2 * Math.PI) / skills.length
    skills.forEach((_, index) => {
      const angle = index * angleStep - Math.PI / 2
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.stroke()
    })

    // Draw skill polygon
    ctx.strokeStyle = "#3b82f6"
    ctx.fillStyle = "rgba(59, 130, 246, 0.2)"
    ctx.lineWidth = 2

    ctx.beginPath()
    skills.forEach((skill, index) => {
      const angle = index * angleStep - Math.PI / 2
      const distance = (skill.level / 100) * radius
      const x = centerX + Math.cos(angle) * distance
      const y = centerY + Math.sin(angle) * distance

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Draw skill points
    ctx.fillStyle = "#3b82f6"
    skills.forEach((skill, index) => {
      const angle = index * angleStep - Math.PI / 2
      const distance = (skill.level / 100) * radius
      const x = centerX + Math.cos(angle) * distance
      const y = centerY + Math.sin(angle) * distance

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Draw skill labels
    ctx.fillStyle = "#374151"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"
    skills.forEach((skill, index) => {
      const angle = index * angleStep - Math.PI / 2
      const labelDistance = radius + 20
      const x = centerX + Math.cos(angle) * labelDistance
      const y = centerY + Math.sin(angle) * labelDistance

      ctx.fillText(skill.skill, x, y)
    })
  }, [skills])

  return (
    <div className={className}>
      <canvas ref={canvasRef} className="max-w-full h-auto" />
    </div>
  )
}
