import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.css'],
})
export class UpdateCategoryComponent {
  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  categoryID: any;
  categoryData: any = {
    categoryID: '',
    categoryName: '',
  };

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.categoryID = +params['cID'];

      this.categoryService.getCategory(this.categoryID).subscribe(
        (data: any) => {
          this.categoryData = data;
        },
        (error) => {
          console.log(error);
          this.snack.open('Error fetching category', 'OK', {
            duration: 3500,
            politeness: 'polite',
            panelClass: 'snack-bar-error',
          });
        }
      );
    });
  }

  //update category upon form submission
  handleSubmit() {
    if (
      this.categoryData.categoryName.trim() == '' ||
      this.categoryData.categoryDescription.trim() == ''
    ) {
      this.snack.open('Please fill out all the required fields.', 'OK', {
        duration: 3500,
        politeness: 'polite',
        panelClass: 'snack-bar-error',
      });
      return;
    }

    this.categoryService.updateCategory(this.categoryData).subscribe(
      (data: any) => {
        this.router.navigate(['/admin-dashboard/categories']);
        this.snack.open('Category updated successfully.', 'OK', {
          duration: 3500,
          politeness: 'polite',
          panelClass: 'snack-bar-error',
        });
      },
      (error) => {
        console.log(error);
        this.snack.open('Something went wrong. Please try again.', 'OK', {
          duration: 3500,
          politeness: 'polite',
          panelClass: 'snack-bar-error',
        });
      }
    );
  }
}
