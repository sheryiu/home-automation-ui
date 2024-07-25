import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, signal, viewChild, viewChildren } from '@angular/core';

enum Mode {
  Auto,
  Cool,
  Dry,
  Heat,
}

@Component({
  selector: 'app-air-conditioner',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './air-conditioner.component.html',
  styleUrl: './air-conditioner.component.scss'
})
export class AirConditionerComponent {

  currentPowered = signal(false)

  modeContainer = viewChild<ElementRef<HTMLElement>>('modeContainer')
  modeBtn = viewChildren<ElementRef<HTMLElement>>('modeBtn')
  modes = Mode;
  currentMode = signal(Mode.Auto)
  modeIndicatorSize = computed(() => {
    const container = this.modeContainer();
    const btns = this.modeBtn();
    const size = (() => {
      switch (this.currentMode()) {
        case Mode.Auto: return btns.at(0)?.nativeElement?.getBoundingClientRect?.();
        case Mode.Cool: return btns.at(1)?.nativeElement?.getBoundingClientRect?.();
        case Mode.Dry: return btns.at(2)?.nativeElement?.getBoundingClientRect?.();
        case Mode.Heat: return btns.at(3)?.nativeElement?.getBoundingClientRect?.();
      }
    })()
    return size ? { width: size.width, height: size.height, left: size.left - (container?.nativeElement?.getBoundingClientRect?.().left ?? 0) } : null
  })

  backgroundStartingColor = computed(() => {
    if (!this.currentPowered())
      return `hsl(0deg 0 5 / 1)`
    switch (this.currentMode()) {
      case Mode.Auto: return `rgb(14, 158, 88)`
      case Mode.Cool: return `rgb(20, 170, 173)`
      case Mode.Dry: return `rgb(139, 168, 23)`
      case Mode.Heat: return `rgb(168, 105, 10)`
    }
  })

  temperatureRange = Array(30-18).fill(0).map((_, i) => 18 + i)
  temperatureContainer = viewChild<ElementRef<HTMLElement>>('temperatureContainer')
  temperatureButton = viewChild<ElementRef<HTMLElement>>('temperatureButton')
  temperatureContainerSize = computed(() => {
    return this.temperatureContainer()?.nativeElement?.getBoundingClientRect?.();
  })
  currentTemperature = signal(24)
  temperatureButtonPosition = signal(24 - 18)
  temperatureStrokeOffset = computed(() => {
    return (247 - this.temperatureButtonPosition() * 248 / 11)
  })

  private temperatureButtonMovement = { x: 0, y: 0 }
  onTemperatureButtonDown(event: PointerEvent) {
    if (this.temperatureButton()) {
      const rect = this.temperatureButton()?.nativeElement.getBoundingClientRect()!;
      this.temperatureButtonMovement = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
      this.temperatureButton()?.nativeElement.setPointerCapture(event.pointerId)
    }
  }
  onTemperatureButtonMove(event: PointerEvent) {
    if (!this.temperatureButton()?.nativeElement.hasPointerCapture(event.pointerId)) return;
    this.temperatureButtonMovement = { x: this.temperatureButtonMovement.x + event.movementX, y: this.temperatureButtonMovement.y + event.movementY }
    const rect = this.temperatureContainerSize()!;
    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 1.8;
    const diffX = this.temperatureButtonMovement.x - centerX
    const diffY = (this.temperatureButtonMovement.y - centerY)
    let deg = Math.atan2(diffY, diffX) * 180 / Math.PI
    if (deg > 90) { deg = deg - 360 }
    // deg = 36 > pos = 12
    // deg = -216 > pos = 0
    this.temperatureButtonPosition.set(
      Math.min(30-19, Math.max(0, (deg + 216) * (12/252)))
    )
    this.currentTemperature.set(Math.min(29, Math.max(18, Math.round(this.temperatureButtonPosition() + 18))))
  }
  onTemperatureButtonUp(event: PointerEvent) {
    if (this.temperatureButton()) {
      this.temperatureButton()?.nativeElement.releasePointerCapture(event.pointerId)
      this.currentTemperature.set(Math.min(29, Math.max(18, Math.round(this.temperatureButtonPosition() + 18))))
      this.temperatureButtonPosition.set(this.currentTemperature() - 18)
    }
  }
}
