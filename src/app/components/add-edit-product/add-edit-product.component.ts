import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css'],
})
export class AddEditProductComponent implements OnInit{
  formProduct: FormGroup;
  loading: boolean = false;
  id: number;
  operacion: string = 'Agregar ';

  constructor(
    private fb: FormBuilder, 
    private _productService: ProductService,
    private router: Router,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute) {
    this.formProduct = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      stock: ['', Validators.required],
    });
    this.id = Number(aRouter.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    if(this.id != 0){
      this.operacion = 'Editar ';
      this.getProduct(this.id);
    }
  }

  getProduct(id: number) {
    this.loading = true;
    this._productService.getProduct(id).subscribe((data: Product) => {
      console.log(data);
      this.loading = false;
      //patchValue para llenar campos especificos del formulario
      //setValue para llenar todos los campos del formulario
      this.formProduct.setValue({
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
      });
    });
  }

  addProduct() {
    const product: Product = {
      name: this.formProduct.value.name,
      description: this.formProduct.value.description,
      price: this.formProduct.value.price,
      stock: this.formProduct.value.stock,
    }
    this.loading = true;
    if(this.id !== 0){
      //Es editar
      product.id = this.id;
      this._productService.updateProduct(this.id, product).subscribe(() => {
        this.loading = false;
        this.toastr.info(`El producto ${product.name} fue actualizado con éxito!', 'Producto actualizado`);
        this.router.navigate(['/']);
      });
    }else{ 
      //Es agregar
      
      this._productService.saveProduct(product).subscribe(data => {
      this.loading = false;
      this.toastr.success(`El producto ${product.name} fue guardado con éxito!', 'Producto guardado`);
      this.router.navigate(['/']);
    });
    }

  }

  }
