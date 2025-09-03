import React, { useEffect, useRef, useState } from "react";

interface VelocimetroProps {
  value: number;
  min?: number;
  max?: number;
  width?: number;
  height?: number;
  className?: string;
  showValue?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  label: string;
}

const Velocimetro: React.FC<VelocimetroProps> = ({
  value,
  min = 0,
  max = 70,
  width = 300,
  height = 300,
  className = "",
  showValue = true,
  primaryColor = "#e74c3c",
  secondaryColor = "#333",
  textColor = "#333",
  label=""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentValue, setCurrentValue] = useState(min);

  useEffect(() => {
    let animationFrameId: number;

    const animateNeedle = () => {
      setCurrentValue((prev) => {
        const diff = value - prev;
        if (Math.abs(diff) < 0.01) return value;
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

    // Fundo do velocímetro
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 0); 
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Marcas principais
    const totalMajorMarks = 12;
    const angleRange = Math.PI; 
    const startAngle = Math.PI;

    for (let i = 0; i <= totalMajorMarks; i++) {
      const angle = startAngle + (angleRange / totalMajorMarks) * i;

      const x1 = centerX + (radius - 20) * Math.cos(angle);
      const y1 = centerY + (radius - 20) * Math.sin(angle);
      const x2 = centerX + radius * Math.cos(angle);
      const y2 = centerY + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.save();
      ctx.translate(
        centerX + (radius - 40) * Math.cos(angle),
        centerY + (radius - 40) * Math.sin(angle),
      );
      ctx.rotate(angle + Math.PI / 2);
      ctx.restore();
    }

    // Marcas menores
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
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Agulha
    const normalizedValue = Math.max(min, Math.min(max, currentValue));
    const needleAngle =
      startAngle + (angleRange * (normalizedValue - min)) / (max - min);

    const needleLength = radius - 35;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + needleLength * Math.cos(needleAngle),
      centerY + needleLength * Math.sin(needleAngle),
    );
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Centro do velocímetro
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = primaryColor;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();

    // Valor numérico com Baron Neue
    if (showValue) {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold 20px 'Baron Neue', sans-serif";
      ctx.fillStyle = textColor;
      ctx.fillText(`${Math.round(normalizedValue).toString()} ${label}`, centerX, centerY + 40);
    }
  }, [currentValue, min, max, width, height, primaryColor, secondaryColor, textColor, showValue]);

  return (
    <div className={`${className}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="block rounded-full"
      />
    </div>
  );
};

export default Velocimetro;