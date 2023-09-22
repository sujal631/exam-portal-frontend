import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/service/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css'],
})
export class AddCategoryComponent {
  category = {
    categoryName: '',
    categoryDescription: '',
  };

  constructor(
    private categoryService: CategoryService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  handleSubmit() {
    if (
      this.category.categoryName.trim() == '' ||
      this.category.categoryName.trim() == null ||
      this.category.categoryDescription.trim() == '' ||
      this.category.categoryDescription.trim() == null
    ) {
      this.snack.open('Please fill out all the required fields.', 'OK', {
        duration: 3500,
        politeness: 'polite',
        panelClass: 'snack-bar-error',
      });
      return;
    }

    this.categoryService.addCategory(this.category).subscribe(
      (data: any) => {
        this.router.navigate(['/admin-dashboard/categories']);
        this.snack.open('Category added successfully.', 'OK', {
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
