import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/service/category.service';
import { QuizService } from 'src/app/service/quiz.service';

@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.css'],
})
export class AddQuizComponent {
  categories: any = [];

  quizData = {
    quizName: '',
    quizDescription: '',
    maxPoints: '',
    numberOfQuestions: '',
    active: true,
    category: {
      categoryID: '',
      categoryName: '',
    },
  };

  constructor(
    private categoryService: CategoryService,
    private snack: MatSnackBar,
    private quizService: QuizService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.categories().subscribe(
      (data: any) => {
        this.categories = data;
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

  handleSubmit() {
    if (
      this.quizData.quizName.trim() == '' ||
      this.quizData.quizDescription.trim() == '' ||
      this.quizData.numberOfQuestions.trim() == '' ||
      this.quizData.maxPoints.trim() == '' ||
      this.quizData.category == null
    ) {
      this.snack.open('Please fill out all the required fields.', 'OK', {
        duration: 3500,
        politeness: 'polite',
        panelClass: 'snack-bar-error',
      });
      return;
    }

    const numberOfQuestions = Number(this.quizData.numberOfQuestions);
    const maxPoints = Number(this.quizData.maxPoints);

    if (isNaN(numberOfQuestions) || numberOfQuestions <= 0) {
      this.snack.open('"Number of Questions" must be a positive number', 'OK', {
        duration: 3500,
        politeness: 'polite',
        panelClass: 'snack-bar-error',
      });
      return;
    }

    if (isNaN(maxPoints) || maxPoints <= 0) {
      this.snack.open('"Max Points" must be a positive number', 'OK', {
        duration: 3500,
        politeness: 'polite',
        panelClass: 'snack-bar-error',
      });
      return;
    }

    //call server to add quiz
    this.quizService.addQuiz(this.quizData).subscribe(
      (data: any) => {
        this.router.navigate([
          'admin-dashboard',
          'quizzes',
          this.quizData.category.categoryID,
          this.quizData.category.categoryName,
        ]);
        this.snack.open('Quiz added successfully.', 'OK', {
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
