import { Component, OnInit } from '@angular/core';
import { ShirtService } from '../../services/shirt/shirt.service';
import { ActivatedRoute } from '@angular/router';
import Shirt from '../../models/shirt';
import { DatePipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-shirt-visualization',
  imports: [DatePipe, NgIf],
  templateUrl: './shirt-visualization.component.html',
  styleUrl: './shirt-visualization.component.css',
})
export class ShirtVisualizationComponent implements OnInit {
  public shirt: Shirt;
  public isLoadingShirt: boolean = false;

  constructor(
    private shirtService: ShirtService,
    private routed: ActivatedRoute
  ) {
    this.shirt = {
      _id: '',
      name: '',
      description: '',
      tier: 'UNKNOWN',
      identificator: '',
      media: [],
      color: '',
      price: 0,
    };
  }

  ngOnInit(): void {
    this.isLoadingShirt = true;
    this.loadShirtDetails();
  }

  private loadShirtDetails(): void {
    const identificator = this.routed.snapshot.paramMap.get('identificator');
    if (!identificator) {
      // Fetch shirt details using the identificator
      alert('No identificator provided.');
      return;
    }

    this.shirtService.getShirtByIdentificator(identificator).subscribe({
      next: (response) => {
        this.shirt = response.response;
        console.log(this.shirt);
      },
      error: (error) => {
        console.error('Error fetching shirt details:', error);
        alert('Error fetching shirt details.');
      },
    });
  }
}
