import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

export const HERO_IMAGE =
  'https://images.unsplash.com/photo-1565376791568-d30e46523795?auto=format&fit=crop&w=1600&q=80';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss'],
})
export class AssetsComponent {
  protected readonly images = signal<string[]>([
    HERO_IMAGE,
    'https://images.unsplash.com/photo-1757753465248-28f8994c28a4?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1761881916867-8e12ac56b87f?q=80&w=1600&auto=format&fit=crop',
  ]);
  protected readonly videos = signal<string[]>([]);
}
