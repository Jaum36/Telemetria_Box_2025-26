import React, { useEffect, useRef, useState } from "react";

interface VelocimetroProps {
  value: number;
  min?: number;
  max?: number;
  width?: number;
  height?: number;
  className?: string;
}

const Velocimetro: React.FC<VelocimetroProps> = ({
  value,
  min = 0,
  max = 220,
  width = 300,
  height = 300,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentValue, setCurrentValue] = useState(min);

  useEffect(() => {
    let animationFrameId: number;

    const animateNeedle = () => {
      setCurrentValue((prev) => {
        const diff = value - prev;
        if (Math.abs(diff) < 0.5) return value;
        return prev + diff * 0.1;
      });
      animationFrameId = requestAnimationFrame(animateNeedle);
    };

    animateNeedle();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.4;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();

    const totalMajorMarks = 12;
    const angleRange = Math.PI * 0.8;
    const startAngle = Math.PI * 1.1;

    for (let i = 0; i <= totalMajorMarks; i++) {
      const angle = startAngle + (angleRange / totalMajorMarks) * i;
      const valueAtMark = min + ((max - min) / totalMajorMarks) * i;

      const x1 = centerX + (radius - 20) * Math.cos(angle);
      const y1 = centerY + (radius - 20) * Math.sin(angle);
      const x2 = centerX + radius * Math.cos(angle);
      const y2 = centerY + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(
        centerX + (radius - 40) * Math.cos(angle),
        centerY + (radius - 40) * Math.sin(angle),
      );
      ctx.rotate(angle + Math.PI / 2);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "12px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(Math.round(valueAtMark).toString(), 0, 0);
      ctx.restore();
    }

    const minorMarksPerSection = 4;
    const totalMinorMarks = totalMajorMarks * minorMarksPerSection;

    for (let i = 0; i <= totalMinorMarks; i++) {
      const angle = startAngle + (angleRange / totalMinorMarks) * i;

      const markLength = i % minorMarksPerSection === 0 ? 15 : 8;
      const x1 = centerX + (radius - markLength) * Math.cos(angle);
      const y1 = centerY + (radius - markLength) * Math.sin(angle);
      const x2 = centerX + radius * Math.cos(angle);
      const y2 = centerY + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = "#666";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    const normalizedValue = Math.max(min, Math.min(max, currentValue));
    const needleAngle =
      startAngle + (angleRange * (normalizedValue - min)) / (max - min);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + (radius - 20) * Math.cos(needleAngle),
      centerY + (radius - 20) * Math.sin(needleAngle),
    );
    ctx.strokeStyle = "#e74c3c";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = "#e74c3c";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 20px Arial";
    ctx.fillStyle = "#333";
    ctx.fillText(Math.round(normalizedValue).toString(), centerX, centerY + 40);
  }, [currentValue, min, max, width, height]);

  return (
    <div className={`velocimetro-container ${className}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="velocimetro-canvas"
      />
    </div>
  );
};

export default Velocimetro;
