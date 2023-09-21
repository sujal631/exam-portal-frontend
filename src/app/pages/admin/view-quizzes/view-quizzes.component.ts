import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuizService } from 'src/app/service/quiz.service';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-quizzes',
  templateUrl: './view-quizzes.component.html',
  styleUrls: ['./view-quizzes.component.css'],
})
export class ViewQuizzesComponent {
  categoryID: any;
  categoryName: any;
  quizzes: any = [];

  pagedQuizzes: any = [];

  dataLoaded = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.categoryID = +params['cID'];
      this.categoryName = params['cName'];
      // console.log(this.quizID);
      // console.log(this.quizName);
    });

    this.quizService.getQuizzesFromCategory(this.categoryID).subscribe(
      (data: any) => {
        this.quizzes = data;
        this.paginator.length = this.quizzes.length;
        this.loadPage();
        // console.log(this.questions);
        this.dataLoaded = true;
      },
      (error) => {
        console.log(error);
        this.snack.open('Error fetching questions.', 'OK', {
          duration: 3500,
          politeness: 'polite',
        });
        this.dataLoaded = true;
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
    const pageSize = this.paginator ? this.paginator.pageSize : 5; // default page size
    this.pagedQuizzes = this.quizzes.slice(startIndex, startIndex + pageSize);
    window.scrollTo(0, 0);
  }

  deleteQuiz(quizID: any) {
    Swal.fire({
      title: 'Are you sure you want to delete this quiz?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.quizService.deleteQuiz(quizID).subscribe(
          (data: any) => {
            this.quizzes = this.quizzes.filter(
              (quiz: any) => quiz.quizID != quizID
            );
            this.paginator.length = this.quizzes.length;
            this.loadPage();
            this.snack.open('Quiz deleted successfully.', 'OK', {
              duration: 3500,
              politeness: 'polite',
            });
          },
          (error) => {
            console.log(error);
            this.snack.open('Error deleting this quiz.', 'OK', {
              duration: 3500,
              politeness: 'polite',
            });
          }
        );
      }
    });
  }
}
