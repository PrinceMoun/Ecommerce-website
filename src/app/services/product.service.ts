import { Injectable } from '@angular/core';
import { HttpClient  } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { mapToMapExpression } from '@angular/compiler/src/render3/util';
import { map } from "rxjs/operators";
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  private baseurl = 'http://localhost:8080/api/products';
  // private baseurl = 'http://localhost:8080/api/products?size=100';

  private categoryUrl = 'http://localhost:8080/api/product-category';


  constructor(private httpClient : HttpClient ){  }

  getProduct(theProductId: number): Observable<Product> {
    
    // need to build URL based on product id
    const productUrl = `${this.baseurl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  getProductList(theCategoryId : number) : Observable<Product[]>{

    // @TODO : need to build URL based on category id...

    const searchUrl = `${this.baseurl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);

  }

  getProductListPaginate(thePage: number, 
                         thePageSize: number, 
                         theCategoryId : number) : Observable<GetResponseProducts>{

    // @TODO : need to build URL based on category id, page and size
    const searchUrl = `${this.baseurl}/search/findByCategoryId?id=${theCategoryId}`
                      +`&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);

  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(theKeyword: string) : Observable<Product[]>{

    // @TODO : need to build URL based on the keyword
    const searchUrl = `${this.baseurl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage: number, 
                         thePageSize: number, 
                         theKeyword : string) : Observable<GetResponseProducts>{

    // @TODO : need to build URL based on keyword, page and size
    const searchUrl = `${this.baseurl}/search/findByNameContaining?name=${theKeyword}`
                    +`&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);

}


  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}
// unwrap the JSON response from spring rest API
interface GetResponseProducts{
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory{
  _embedded: {
    productCategory: ProductCategory[];
  }
}
