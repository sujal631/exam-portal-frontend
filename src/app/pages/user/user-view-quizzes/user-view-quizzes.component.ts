import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { QuizService } from 'src/app/service/quiz.service';

@Component({
  selector: 'app-user-view-quizzes',
  templateUrl: './user-view-quizzes.component.html',
  styleUrls: ['./user-view-quizzes.component.css'],
})
export class UserViewQuizzesComponent {
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
        this.quizzes = data.filter((quiz: any) => quiz.active);
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
}
