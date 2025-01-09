export default class Particle {
  constructor(x, y, radius, color, canvasWidth) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.radius = radius;
    this.color = color;
    this.canvasWidth = canvasWidth;

    this.velocity = 0;
    this.acceleration = 0;
    this.friction = 0.985;
    this.flowSpeed = -1.2;
    this.springFactor = 0.035;
    this.sensitivity = 2.5;

    this.xOffset = (Math.random() - 0.5) * 2;
    this.yOffset = (Math.random() - 0.5) * 2;

    this.lastSafePosition = { x, y };
    this.isFollowingPath = false;
    this.pathDirection = Math.random() < 0.5 ? 0.8 : -0.8;

    this.audioForceThreshold = 0.2;
    this.stickiness = 0.4;

    this.individualFriction = this.friction + (Math.random() - 0.5) * 0.01;
    this.individualFlowSpeed = this.flowSpeed + (Math.random() - 0.5) * 0.3;
  }

  update(audioData, index, svgDrawer, particles) {
    this.lastSafePosition = { x: this.x, y: this.y };

    const audio = audioData[index] / 128.0;
    const audioForce = Math.abs(audio - 1);

    if (!this.isFollowingPath) {
      this.updateFreeMovement(audio);
      this.checkPathProximity(svgDrawer, audioForce);
    } else {
      this.updatePathMovement(audio, audioForce, svgDrawer, particles);
    }

    this.avoidOtherParticles(particles);
    this.checkBounds();
  }

  updateFreeMovement(audio) {
    const targetY = this.baseY + (audio - 1) * this.baseY * this.sensitivity;
    const distance = targetY - this.y;

    this.acceleration =
      distance * this.springFactor * (1 + Math.random() * 0.1);
    this.velocity += this.acceleration;
    this.velocity *= this.individualFriction;
    this.y += this.velocity;

    this.x += this.individualFlowSpeed + Math.sin(this.y * 0.01) * 0.3;
  }

  checkPathProximity(svgDrawer, audioForce) {
    if (
      svgDrawer.isNearPath(this.x, this.y, this.radius + 1) &&
      audioForce < this.audioForceThreshold * 0.5
    ) {
      this.isFollowingPath = true;
      this.pathDirection = this.y < svgDrawer.height / 2 ? 0.8 : -0.8;
    }
  }

  updatePathMovement(audio, audioForce, svgDrawer, particles) {
    if (
      audioForce > this.audioForceThreshold &&
      Math.random() > this.stickiness
    ) {
      this.isFollowingPath = false;
      this.velocity = (audio - 1) * 5;
    } else {
      this.followSVGPath(svgDrawer, particles);
    }
  }

  checkBounds() {
    if (this.x + this.xOffset < -this.radius) {
      this.x = this.canvasWidth + this.radius;
      this.isFollowingPath = false;
    }
  }

  avoidOtherParticles(particles) {
    const minDistance = this.radius * 2.2;

    for (let particle of particles) {
      if (particle === this) continue;

      const dx = particle.x + particle.xOffset - (this.x + this.xOffset);
      const dy = particle.y + particle.yOffset - (this.y + this.yOffset);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        this.applyRepulsion(dx, dy, distance, particle);
      }
    }
  }

  applyRepulsion(dx, dy, distance, particle) {
    const angle = Math.atan2(dy, dx);
    const force = (this.radius * 2.2 - distance) / (this.radius * 2.2);
    const repulsionStrength =
      this.isFollowingPath && particle.isFollowingPath ? 0.8 : 0.3;

    const moveX = Math.cos(angle) * force * repulsionStrength;
    const moveY = Math.sin(angle) * force * repulsionStrength;

    const multiplier = this.isFollowingPath ? 0.2 : 0.8;
    this.x -= moveX * multiplier;
    this.y -= moveY * multiplier;
  }

  followSVGPath(svgDrawer, particles) {
    const searchRadius = 8;
    const searchPoints = 24;
    let foundPath = false;

    for (let i = 0; i < searchPoints; i++) {
      const angle = (i / searchPoints) * Math.PI * 2;
      const testX = this.x + Math.cos(angle) * searchRadius;
      const testY = this.y + Math.sin(angle) * searchRadius;

      if (this.tryFollowPath(testX, testY, svgDrawer, particles)) {
        foundPath = true;
        break;
      }
    }

    if (!foundPath) {
      this.x = this.lastSafePosition.x;
      this.y = this.lastSafePosition.y;
      this.pathDirection *= -0.8;
    }
  }

  tryFollowPath(testX, testY, svgDrawer, particles) {
    if (
      svgDrawer.isNearPath(testX, testY, this.radius) &&
      !this.isPositionOccupied(testX, testY, particles)
    ) {
      const dx = testX - this.x;
      const dy = testY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 0) {
        this.x += (dx / dist) * 1.5 + this.flowSpeed * 0.3;
        this.y += (dy / dist) * 1.5;
        return true;
      }
    }
    return false;
  }

  isPositionOccupied(x, y, particles) {
    const minDistance = this.radius * 2.2;
    return particles.some((particle) => {
      if (particle === this) return false;
      const dx = particle.x + particle.xOffset - x;
      const dy = particle.y + particle.yOffset - y;
      return Math.sqrt(dx * dx + dy * dy) < minDistance;
    });
  }

  draw(ctx) {
    const hslMatch = this.color.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%/);
    if (hslMatch) {
      const [_, hue, saturation, lightness] = hslMatch;
      ctx.shadowColor = `hsl(${hue}, ${saturation}%, ${Math.min(
        parseInt(lightness) + 20,
        100
      )}%)`;
      ctx.shadowBlur = 12;
    }

    ctx.beginPath();
    ctx.arc(
      this.x + this.xOffset,
      this.y + this.yOffset,
      this.radius,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.closePath();
  }
}
