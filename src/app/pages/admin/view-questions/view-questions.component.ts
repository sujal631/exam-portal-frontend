import { Component, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from 'src/app/service/question.service';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-view-questions',
  templateUrl: './view-questions.component.html',
  styleUrls: ['./view-questions.component.css'],
})
export class ViewQuestionsComponent {
  quizID: any;
  quizName: any;
  questions: any = [];

  pagedQuestions: any = [];

  dataLoaded = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.quizID = +params['qID'];
      this.quizName = params['qName'];
      // console.log(this.quizID);
      // console.log(this.quizName);
    });

    this.questionService.getQuestionsFromQuiz(this.quizID).subscribe(
      (data: any) => {
        this.questions = data;
        this.paginator.length = this.questions.length;
        this.loadPage();
        // console.log(this.questions);
        this.dataLoaded = true;
      },
      (error) => {
        console.log(error);
        this.snack.open('Error fetching questions.', 'OK', {
          duration: 3500,
          politeness: 'polite',
          panelClass: 'snack-bar-error',
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
    this.pagedQuestions = this.questions.slice(
      startIndex,
      startIndex + pageSize
    );
    window.scrollTo(0, 0);
  }

  // delete question
  deleteQuestion(questionID: any) {
    Swal.fire({
      title: 'Are you sure you want to delete this question?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.questionService.deleteQuestion(questionID).subscribe(
          (data: any) => {
            this.questions = this.questions.filter(
              (question: any) => question.questionID != questionID
            );
            this.paginator.length = this.questions.length;
            this.loadPage();
            this.snack.open('Quiz deleted successfully.', 'OK', {
              duration: 3500,
              politeness: 'polite',
              panelClass: 'snack-bar-error',
            });
          },
          (error) => {
            console.log(error);
            this.snack.open('Error deleting this quiz.', 'OK', {
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
