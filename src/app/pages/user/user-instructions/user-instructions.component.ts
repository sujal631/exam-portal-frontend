import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from 'src/app/service/quiz.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-instructions',
  templateUrl: './user-instructions.component.html',
  styleUrls: ['./user-instructions.component.css'],
})
export class UserInstructionsComponent {
  quizID: any;
  quizName: any;

  quizData: any = {
    quizID: '',
    quizName: '',
    quizDescription: '',
    maxPoints: '',
    numberOfQuestions: '',
    active: '',
    category: {
      categoryID: '',
      categoryName: '',
      categoryDescription: '',
    },
  };

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.quizID = +params['qID'];
      this.quizName = params['qName'];
      // console.log(this.quizID);
      // console.log(this.quizName);
    });

    this.quizService.getQuiz(this.quizID).subscribe(
      (data: any) => {
        this.quizData = data;
        // console.log(this.quizData);
      },
      (error) => {
        console.log(error);
        this.snack.open('Error starting this quiz.', 'OK', {
          duration: 3500,
          politeness: 'polite',
        });
      }
    );
  }

  confirmStartQuiz(quizID: any, quizName: any) {
    Swal.fire({
      title: 'Are you sure you want to start this quiz?',
      text: "You won't be able to pause and resume later!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, start it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const url = `/start-quiz/${this.quizID}/${this.quizName}`;
        window.open(url, '_blank');
      }
    });
  }
}
