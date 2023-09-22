import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from 'src/app/service/question.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css'],
})
export class AddQuestionComponent {
  public Editor = ClassicEditor;

  quizID: any;
  quizName: any;
  question = {
    quiz: {
      quizID: '',
      quizName: '',
    },
    questionContent: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    answer: '',
  };

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.quizID = +params['qID'];
      this.quizName = params['qName'];

      this.question.quiz.quizID = this.quizID;
      this.question.quiz.quizName = this.quizName;
    });
  }

  handleSubmit() {
    if (
      this.question.questionContent.trim() == '' ||
      this.question.option1.trim() == '' ||
      this.question.option2.trim() == '' ||
      this.question.answer.trim() == ''
    ) {
      this.snack.open('Please fill out all the required fields.', 'OK', {
        duration: 3500,
        politeness: 'polite',
        panelClass: 'snack-bar-error',
      });
      return;
    }

    this.questionService.addQuestionIntoQuiz(this.question).subscribe(
      (data: any) => {
        this.router.navigate([
          '/admin-dashboard/view-questions/' +
            this.quizID +
            '/' +
            this.quizName,
        ]);
        this.snack.open('Question added successfully.', 'OK', {
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
