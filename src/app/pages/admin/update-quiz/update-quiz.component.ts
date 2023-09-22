import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/service/category.service';
import { QuizService } from 'src/app/service/quiz.service';

@Component({
  selector: 'app-update-quiz',
  templateUrl: './update-quiz.component.html',
  styleUrls: ['./update-quiz.component.css'],
})
export class UpdateQuizComponent {
  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private categoryService: CategoryService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  quizID = 0;
  quizData: any;

  categories: any = [];

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.quizID = +params['qID'];

      this.quizService.getQuiz(this.quizID).subscribe(
        (data: any) => {
          this.quizData = data;
          //console.log(this.quizData);
        },
        (error) => {
          console.log(error);
          this.snack.open('Error fetching quiz.', 'OK', {
            duration: 3500,
            politeness: 'polite',
            panelClass: 'snack-bar-error',
          });
        }
      );
    });

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

  //update quiz on form submit
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

    this.quizService.updateQuiz(this.quizData).subscribe(
      (data: any) => {
        this.router.navigate([
          '/admin-dashboard/quizzes/' +
            this.quizData.category.categoryID +
            '/' +
            this.quizData.category.categoryName,
        ]);
        this.snack.open('Quiz updated successfully.', 'OK', {
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
