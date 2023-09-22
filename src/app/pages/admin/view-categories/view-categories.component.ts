import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from 'src/app/service/category.service';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-categories',
  templateUrl: './view-categories.component.html',
  styleUrls: ['./view-categories.component.css'],
})
export class ViewCategoriesComponent {
  categories: any = [];

  pagedCategories: any = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private categoryService: CategoryService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.categoryService.categories().subscribe(
      (data: any) => {
        this.categories = data;
        this.paginator.length = this.categories.length;
        this.loadPage();
        // console.log(this.categories);
      },
      (error) => {
        console.log(error);
        this.snack.open('Error fetching categories.', 'OK', {
          duration: 3500,
          politeness: 'polite',
          panelClass: 'snack-bar-error',
        });
      }
    );
  }
  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.loadPage())).subscribe();
  }

  loadPage() {
    const startIndex = this.paginator
      ? this.paginator.pageIndex * this.paginator.pageSize
      : 0;
    const pageSize = this.paginator ? this.paginator.pageSize : 3; // default page size
    this.pagedCategories = this.categories.slice(
      startIndex,
      startIndex + pageSize
    );
    window.scrollTo(0, 0);
  }

  deleteCategory(categoryID: any) {
    Swal.fire({
      title: 'Are you sure you want to delete this category?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(categoryID).subscribe(
          (data: any) => {
            this.categories = this.categories.filter(
              (category: any) => category.categoryID != categoryID
            );
            this.paginator.length = this.categories.length;
            this.loadPage();
            this.snack.open('Category deleted successfully.', 'OK', {
              duration: 3500,
              politeness: 'polite',
              panelClass: 'snack-bar-error',
            });
          },
          (error) => {
            console.log(error);
            this.snack.open('Error deleting this category.', 'OK', {
              duration: 3500,
              politeness: 'polite',
              panelClass: 'snack-bar-error',
            });
          }
        );
      }
    });
  }
}
