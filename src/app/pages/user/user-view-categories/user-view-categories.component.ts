import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-user-view-categories',
  templateUrl: './user-view-categories.component.html',
  styleUrls: ['./user-view-categories.component.css'],
})
export class UserViewCategoriesComponent {
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
}
