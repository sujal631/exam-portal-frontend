import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from 'src/app/service/question.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-update-question',
  templateUrl: './update-question.component.html',
  styleUrls: ['./update-question.component.css'],
})
export class UpdateQuestionComponent {
  public Editor = ClassicEditor;

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  questionID: any;
  questionData: any = {
    questionContent: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    answer: '',
    quiz: {
      quizID: '',
      quizName: '',
    },
  };

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.questionID = +params['quesID'];
    });

    this.questionService.getQuestion(this.questionID).subscribe(
      (data: any) => {
        this.questionData = data;
        console.log(this.questionData);
      },
      (error) => {
        console.log(error);
        this.snack.open('Error fetching data.', 'OK', {
          duration: 3500,
          politeness: 'polite',
        });
      }
    );
  }

  handleSubmit() {
    if (
      this.questionData.questionContent.trim() == '' ||
      this.questionData.option1.trim() == '' ||
      this.questionData.option2.trim() == '' ||
      this.questionData.answer.trim() == ''
    ) {
      this.snack.open('Please fill out all the required fields.', 'OK', {
        duration: 3500,
        politeness: 'polite',
      });
      return;
    }
    this.questionService.updateQuestion(this.questionData).subscribe(
      (data: any) => {
        this.router.navigate([
          '/admin-dashboard/view-questions/' +
            this.questionData.quiz.quizID +
            '/' +
            this.questionData.quiz.quizName,
        ]);
        this.snack.open('Question updated successfully.', 'OK', {
          duration: 3500,
          politeness: 'polite',
        });
      },
      (error) => {
        console.log(error);
        this.snack.open('Something went wrong. Please try again.', 'OK', {
          duration: 3500,
          politeness: 'polite',
        });
      }
    );
  }
}
