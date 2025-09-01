import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import Stock from '../../models/stock';
import { TIER_NAMES } from '../../const';
import { StockService } from '../../services/stock/stock.service';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-edit-stock',
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './edit-stock.component.html',
  styleUrl: './edit-stock.component.css',
})
export class EditStockComponent implements OnInit {
  @ViewChild('createStockForm') form!: NgForm;

  private stockId: string;
  public newStock: Stock;
  public displayedStock: Stock;
  public tiers: any = TIER_NAMES;
  public availableColors: Set<string> = new Set();
  public removedColors: Set<string> = new Set();
  public selectedColor: string = '#fff';
  public lastSelectedColor: string;
  public creationStatusMessage: string = '';
  public isLoading: boolean = false;
  public responseMessage: string = '';

  public selectedQuantity: number = 0;
  public selectedTier: '' | 'SEASON' | 'DROP' | 'CUSTOM' | 'UNKNOWN' = '';

  public selectedToRemove: string[] = [];
  public selectedToCover: string = '';

  public selectedCoverImage: File | null = null;
  public selectedGallery: File[] = [];
  public selectedGalleryPreview: any[] = [];
  public onUploadingImagesMessage: string = '';

  constructor(
    private router: Router,
    private stockService: StockService,
    private route: ActivatedRoute
  ) {
    this.lastSelectedColor = this.selectedColor;
    this.newStock = {
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
    this.displayedStock = {
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
    this.stockId = '';
  }

  public hasSelectedAnotherCoverImage(): boolean {
    return this.selectedGalleryPreview.find((preview) => preview.isCoverImg);
  }

  ngOnInit(): void {
    this.stockId = this.route.snapshot.paramMap.get('id') || '';
    this.loadStock();
  }

  public back(): void {
    this.router.navigate(['/stock']);
  }

  private loadStock(): void {
    this.stockService.getStock(this.stockId).subscribe({
      next: (response) => {
        const stock = response.response;
        this.displayedStock = stock;
        this.newStock = stock;
        this.displayedStock.availableColors.forEach((hex) =>
          this.availableColors.add(hex)
        );
        this.selectedTier = this.displayedStock.details.tier;
        this.selectedQuantity = this.displayedStock.total;
      },
      error: (error) => {
        this.responseMessage = `Error loading stock: ${error}`;
      },
    });
  }

  public check(): void {
    if (this.displayedStock.details.price < 100) {
      this.displayedStock.details.price = 100;
    }
  }

  public resetQuantityInputs(): void {
    if (this.selectedTier === TIER_NAMES.DROP) {
      this.displayedStock.sizes = [];
      return;
    }

    // custom
    this.selectedQuantity = 0;
    this.displayedStock.sizes[0].quantity = 0;
    this.displayedStock.sizes[1].quantity = 0;
    this.displayedStock.sizes[2].quantity = 0;
    this.displayedStock.sizes[3].quantity = 0;
  }

  public saveChanges(): void {
    if (!this.form.valid) {
      return;
    }

    this.isLoading = true;
    this.displayedStock.availableColors = [...this.availableColors];
    this.displayedStock.details.tier = this.selectedTier;

    // calculate total
    if (this.selectedTier === TIER_NAMES.DROP) {
      this.displayedStock.total = this.selectedQuantity;
    } else {
      const stockSum = this.displayedStock.sizes.reduce((accum, current) => {
        return (accum += current.quantity);
      }, 0);

      this.displayedStock.total = stockSum;
    }

    const gallery = this.reGroupGallery();
    console.log(this.newStock);
    // this.stockService.add(this.stock, gallery).subscribe({
    //   next: (_response) => {
    //     this.responseMessage = '';
    //     this.isLoading = false;
    //     this.selectedGallery = [];
    //     this.selectedGalleryPreview = [];
    //     this.router.navigate(['/stock']);
    //   },
    //   error: (err) => {
    //     const { error } = err;
    //     this.responseMessage = `Error trying to add new stock: ${error.message}`;
    //     this.selectedGallery = [];
    //     this.isLoading = false;
    //   },
    // });
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
    if (this.displayedStock.availableColors.includes(color)) {
      return;
    }

    if (color !== '') {
      this.availableColors.add(color);
      this.lastSelectedColor = this.selectedColor;
      this.changeColorPickerView();
      return;
    }

    const colorPickerInput = document.getElementById(
      'color-selector'
    ) as HTMLInputElement;
    if (colorPickerInput) {
      this.displayedStock.availableColors.push(color);
      this.lastSelectedColor = this.selectedColor;
      this.changeColorPickerView();
    }
  }

  public removeColor(hex: string): void {
    if (!this.displayedStock.availableColors.find((color) => color === hex)) {
      this.availableColors.delete(hex); // just delete
      return;
    }

    this.availableColors.delete(hex);
    this.removedColors.add(hex);
  }

  public restoreColor(hex: string): void {
    this.availableColors.add(hex);
    this.removedColors.delete(hex);
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
    if (this.isLoading) {
      return;
    }

    this.selectedGalleryPreview = this.selectedGalleryPreview.filter(
      (preview) => preview.fileName !== name
    );

    this.selectedGallery = this.selectedGallery.filter(
      (image) => image.name !== name
    );
  }

  public cancelRemove(imageUrl: string): void {
    this.selectedToRemove = this.selectedToRemove.filter(
      (url) => url !== imageUrl
    );
  }

  public markAsRemoved(imageUrl: string): void {
    this.selectedToRemove.push(imageUrl);
    if (this.selectedToCover === imageUrl) {
      this.selectedToCover = '';
    }
  }

  public selectAsCoverImage(imageId: string): void {
    if (this.isLoading) {
      return;
    }

    const image = this.selectedGalleryPreview.findIndex(
      (image) => image.tempId === imageId
    );
    if (image < 0) {
      this.selectedToCover = imageId;
      this.selectedGalleryPreview.forEach(
        (preview) => (preview.isCoverImg = false)
      );
      return;
    }

    this.selectedGalleryPreview.forEach(
      (preview) => (preview.isCoverImg = false)
    );
    this.selectedGalleryPreview[image].isCoverImg = true;
    this.selectedToCover = '';
  }

  public deselectAsCover(imageId: string): void {
    const imageIndex = this.displayedStock.details.media.findIndex(
      (image) => image === imageId
    );

    if (imageIndex === 0) {
      return;
    }

    this.selectedToCover = '';
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
