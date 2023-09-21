import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  //load all categories
  public categories() {
    return this.http.get(`${baseUrl}/category/`);
  }

  //load one category(for update purpose)
  public getCategory(categoryID: any) {
    return this.http.get(`${baseUrl}/category/${categoryID}`);
  }

  //add category
  public addCategory(category: any) {
    return this.http.post(`${baseUrl}/category/`, category);
  }

  //delete category
  public deleteCategory(categoryID: any) {
    return this.http.delete(`${baseUrl}/category/${categoryID}`);
  }

  //update a category
  public updateCategory(category: any) {
    return this.http.put(`${baseUrl}/category/`, category);
  }
}
