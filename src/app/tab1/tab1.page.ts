import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver'; 

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchTerm: string = '';
  selectedProduct: any = null;
  selectedCategory: string = 'all'; 
  isModalOpen: boolean = false; 

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts(category: string = 'all') {
    const url = category === 'all' 
      ? 'https://dummyjson.com/products' 
      : `https://dummyjson.com/products/category/${category}`;
    
    this.http.get(url)
      .subscribe((response: any) => {
        this.products = response.products;
        this.filteredProducts = this.products; 
      });
  }

  searchProducts() {
    if (this.searchTerm.trim() === '') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.title.toLowerCase().includes(this.searchTerm.toLowerCase())
        || product.description.toLowerCase().includes(this.searchTerm.toLowerCase())
        || product.category.toLowerCase().includes(this.searchTerm.toLowerCase())
        || product.price.toString().includes(this.searchTerm)
        || product.stock.toString().includes(this.searchTerm)
      );
    }
  }

  fetchProduct(productId: number) {
    this.http.get(`https://dummyjson.com/products/${productId}`)
      .subscribe((product: any) => {
        this.selectedProduct = product;
        this.isModalOpen = true;
      },
    );
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedProduct = null;
  }

  deleteProduct(productId: number) {
    this.http.delete(`https://dummyjson.com/products/${productId}`)
      .subscribe(() => {
        this.products = this.products.filter(product => product.id !== productId);
        this.filteredProducts = this.products; 
        console.log('Producto eliminado correctamente');
      }, (error) => {
        console.error('Error al eliminar el producto:', error);
      });
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.detail.value;
    this.loadProducts(this.selectedCategory);
  }

  exportToJson() {
    const jsonContent = JSON.stringify(this.products, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    saveAs(blob, 'productos.json');
  }
}
