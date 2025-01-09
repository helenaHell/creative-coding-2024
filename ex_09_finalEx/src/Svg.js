import Utils from "./Utils";

export default class Svg {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.pathPoints = null;
    this.originalPoints = null;
    this.transformedPoints = null;
  }

  async init(svgPath) {
    try {
      this.pathPoints = await Utils.loadSVG(svgPath);
      this.originalPoints = this.pathPoints.map((path) =>
        path.map((point) => ({ x: point.x, y: point.y }))
      );
      this.transformedPoints = this.calculateTransformedPoints();
    } catch (error) {
      console.error("Error loading SVG:", error);
    }
  }

  calculateTransformedPoints() {
    if (!this.pathPoints) return null;
    const scale = 1;
    const offsetX = -350;
    const offsetY = -400;

    return this.pathPoints.map((path) =>
      path.map((point) => ({
        x: (point.x + offsetX) * scale,
        y: (point.y + offsetY) * scale,
      }))
    );
  }

  draw(ctx, frequencyData) {
    if (
      !this.pathPoints ||
      !this.originalPoints ||
      this.pathPoints.length === 0
    )
      return;

    ctx.save();
    ctx.translate(this.width / 2, this.height / 2);
    ctx.scale(1, 1);
    ctx.translate(-350, -400);

    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.lineWidth = 4;

    if (frequencyData) {
      this.updatePathPoints(frequencyData);
    }

    this.pathPoints.forEach((points) => {
      ctx.beginPath();
      points.forEach((point, index) => {
        index === 0
          ? ctx.moveTo(point.x, point.y)
          : ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
      ctx.fill();
    });

    ctx.restore();
  }

  updatePathPoints(frequencyData) {
    const frequencyBinCount = frequencyData.length;
    this.pathPoints = this.originalPoints.map((path) =>
      path.map((point, index) => {
        const binIndex = Math.floor((index / path.length) * frequencyBinCount);
        const frequencyValue = frequencyData[binIndex];
        const displacement = (frequencyValue / 255) * 20;
        const angle = (index / path.length) * Math.PI * 2;

        return {
          x: point.x + Math.cos(angle) * displacement,
          y: point.y + Math.sin(angle) * displacement,
        };
      })
    );
    this.transformedPoints = this.calculateTransformedPoints();
  }

  isNearPath(x, y, threshold = 5) {
    if (!this.transformedPoints) return false;

    const svgX = x - this.width / 2;
    const svgY = y - this.height / 2;

    for (const path of this.transformedPoints) {
      for (let i = 0; i < path.length - 1; i++) {
        if (
          this.distanceToLineSegment(
            svgX,
            svgY,
            path[i].x,
            path[i].y,
            path[i + 1].x,
            path[i + 1].y
          ) < threshold
        ) {
          return true;
        }
      }
    }
    return false;
  }

  distanceToLineSegment(px, py, x1, y1, x2, y2) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    const param = len_sq === 0 ? -1 : dot / len_sq;

    let xx, yy;
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
