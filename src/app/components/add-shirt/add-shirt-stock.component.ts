import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TIER_NAMES } from '../../const';
import { NgFor, NgIf } from '@angular/common';
import Stock from '../../models/stock';
import { FormsModule, NgForm } from '@angular/forms';
import { StockService } from '../../services/stock/stock.service';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-add-shirt',
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './add-shirt-stock.component.html',
  styleUrl: './add-shirt-stock.component.css',
})
export class AddShirtStockComponent {
  @ViewChild('createStockForm') form!: NgForm;

  public tiers: any = TIER_NAMES;
  public availableColors: string[] = [];
  public stock: Stock;
  public selectedColor: string = '#fff';
  public lastSelectedColor: string;
  public creationStatusMessage: string = '';
  public isLoading: boolean = false;
  public responseMessage: string = '';

  public selectedQuantity: number = 0;
  public selectedTier: '' | 'SEASON' | 'DROP' | 'CUSTOM' | 'UNKNOWN' = '';

  public selectedCoverImage: File | null = null;
  public selectedGallery: File[] = [];
  public selectedGalleryPreview: any[] = [];
  public onUploadingImagesMessage: string = '';

  constructor(private router: Router, private stockService: StockService) {
    this.lastSelectedColor = this.selectedColor;
    this.stock = {
      status: 'Available',
      sizes: [
        { size: 'S', quantity: 0 },
        { size: 'M', quantity: 0 },
        { size: 'L', quantity: 0 },
        { size: 'XL', quantity: 0 },
      ],
      details: {
        name: '',
        description: '',
        imageUrl: '',
        price: 100,
        tier: '',
        media: [],
      },
      availableColors: [],
      total: 0,
    };
  }

  public back(): void {
    this.router.navigate(['/stock']);
  }

  public check(): void {
    if (this.stock.details.price < 100) {
      this.stock.details.price = 100;
    }
  }

  public resetQuantityInputs(): void {
    if (this.selectedTier === TIER_NAMES.DROP) {
      this.stock.sizes = [];
      return;
    }

    // custom
    this.selectedQuantity = 0;
    this.stock.sizes[0].quantity = 0;
    this.stock.sizes[1].quantity = 0;
    this.stock.sizes[2].quantity = 0;
    this.stock.sizes[3].quantity = 0;
  }

  public createStock(): void {
    if (!this.form.valid) {
      return;
    }

    this.isLoading = true;
    this.stock.availableColors = [...this.availableColors];
    this.stock.details.tier = this.selectedTier;

    // calculate total
    if (this.selectedTier === TIER_NAMES.DROP) {
      this.stock.total = this.selectedQuantity;
    } else {
      const stockSum = this.stock.sizes.reduce((accum, current) => {
        return (accum += current.quantity);
      }, 0);

      this.stock.total = stockSum;
    }

    const gallery = this.reGroupGallery();
    this.stockService.add(this.stock, gallery).subscribe({
      next: (_response) => {
        this.responseMessage = '';
        this.isLoading = false;
        this.selectedGallery = [];
        this.selectedGalleryPreview = [];
        this.router.navigate(['/stock']);
      },
      error: (err) => {
        const { error } = err;
        this.responseMessage = `Error trying to add new stock: ${error.message}`;
        this.selectedGallery = [];
        this.isLoading = false;
      },
    });
  }

  private reGroupGallery(): File[] {
    // regroup gallery to place selected cover image on index 0
    const gallery = [...this.selectedGallery];

    // detect cover image selected
    const coverImgSelected = this.selectedGalleryPreview.find(
      (image) => image.isCoverImg
    );
    if (!coverImgSelected) {
      return gallery;
    }

    const coverImageIndex = gallery.findIndex(
      (image) => image.name === coverImgSelected.fileName
    );
    if (coverImageIndex < 0) {
      return gallery;
    }

    const [item] = gallery.splice(coverImageIndex, 1);
    gallery.splice(0, 0, item);
    return gallery;
  }

  public addSelectedColorList(color: string, event?: any) {
    if (this.availableColors.includes(color)) {
      return;
    }
    if (event) {
      const colorPickerInput = document.getElementById(
        'color-selector'
      ) as HTMLInputElement;
      if (colorPickerInput) {
        this.availableColors.push(colorPickerInput.value);
        this.lastSelectedColor = this.selectedColor;
        this.changeColorPickerView();
      }
    } else {
      this.availableColors.push(color);
      this.lastSelectedColor = this.selectedColor;
      this.changeColorPickerView();
    }

    return;
  }

  public removeColor(hex: string): void {
    this.availableColors = this.availableColors.filter(
      (color) => color !== hex
    );
  }

  private changeColorPickerView(): void {
    const colorPicker = document.getElementById('color-preview');
    if (!colorPicker) {
      return;
    }

    colorPicker.style.backgroundColor = this.lastSelectedColor;
  }

  public onSelectedImages(event: any): void {
    const files = event.target.files;
    if (!files || files.length === 0) {
      this.onUploadingImagesMessage =
        'Error loading selected file. Try another.';
      return;
    }

    this.selectedGallery = [...this.selectedGallery, ...files];
    for (const file of files) {
      this.loadImagesPreview(file);
    }

    console.log(this.selectedGalleryPreview);
    console.log(this.selectedGallery);
  }

  private loadImagesPreview(file: File): void {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.selectedGalleryPreview.push({
        tempId: new Date().getTime(),
        url: e.target.result as string,
        fileName: file.name,
        isCoverImg: false,
      });
    };

    reader.readAsDataURL(file);
  }

  public removeImage(name: string): void {
    this.selectedGalleryPreview = this.selectedGalleryPreview.filter(
      (preview) => preview.fileName !== name
    );

    this.selectedGallery = this.selectedGallery.filter(
      (image) => image.name !== name
    );
  }

  public selectAsCoverImage(imageId: string): void {
    const image = this.selectedGalleryPreview.findIndex(
      (image) => image.tempId === imageId
    );
    if (image < 0) {
      alert('Image not found.');
      return;
    }

    this.selectedGalleryPreview.forEach(
      (preview) => (preview.isCoverImg = false)
    );
    this.selectedGalleryPreview[image].isCoverImg = true;
  }

  public removeAsCoverImg(imageId: string): void {
    const image = this.selectedGalleryPreview.findIndex(
      (image) => image.tempId === imageId
    );
    if (image < 0) {
      alert('Image not found.');
      return;
    }

    this.selectedGalleryPreview[image].isCoverImg = false;
  }
}
