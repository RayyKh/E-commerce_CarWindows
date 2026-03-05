import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollAnimateDirective } from '../../directives/scroll-animate.directive';

type CategoryCard = { name: string; key: string; image: string };

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollAnimateDirective],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent {
  readonly categories: CategoryCard[] = [
    {
      name: 'Pare-brise',
      key: 'Pare-brise',
      image:
        'https://images.unsplash.com/photo-1757753465248-28f8994c28a4?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Vitres latérales',
      key: 'Vitre latérale',
      image:
        'https://images.unsplash.com/photo-1644017060552-728a4be83940?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Rétroviseur',
      key: 'Rétroviseur',
      image:
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    },
  ];
}
