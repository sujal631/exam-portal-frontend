import { LocationStrategy } from '@angular/common';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from 'src/app/service/question.service';
import { QuizService } from 'src/app/service/quiz.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-start-quiz',
  templateUrl: './start-quiz.component.html',
  styleUrls: ['./start-quiz.component.css'],
})
export class StartQuizComponent {
  quizID: any;
  quizName: any;
  questions: any;

  currentQuestionIndex = 0;

  pointsScored = 0;
  correctAnswers = 0;
  questionsAttempted = 0;

  isSubmitted = false;

  timer: any;

  startTime: any;
  timeTaken: any;

  constructor(
    private route: ActivatedRoute,
    private locationStrategy: LocationStrategy,
    private questionService: QuestionService,
    private snack: MatSnackBar,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.quizID = +param['qID'];
      this.quizName = param['qName'];
      this.loadQuestions();
    });
    this.disableBackButton();
    this.disableRefreshButton();
    // this.disableRightClick();
    this.disableTextSelection();
  }

  loadQuestions() {
    this.questionService.getQuestionsFromQuizForUser(this.quizID).subscribe(
      (data: any) => {
        this.questions = data;
        this.questions.forEach((q: any) => {
          if (!q.selectedAnswer) {
            q.selectedAnswer = '';
          }
        });

        this.startTime = new Date().getTime();

        this.timer = this.questions.length * 1 * 60;
        this.startTimer();

        // console.log(this.questions);
      },
      (error) => {
        console.error('Error submitting quiz:', error);
        this.snack.open('Error loading questions.', 'OK', {
          duration: 3500,
          politeness: 'polite',
        });
      }
    );
  }

  // back button is disabled
  disableBackButton() {
    history.pushState(null, '', location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, '', location.href);
    });
  }

  //refresh button is disabled
  disableRefreshButton() {
    window.addEventListener('beforeunload', (event) => {
      event.preventDefault();
      event.returnValue =
        'Are you sure you want to refresh? All progress will be lost!';
    });
  }

  // right click is disabled
  disableRightClick() {
    window.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });
  }

  // text selection is disabled
  disableTextSelection() {
    document.onselectstart = function () {
      return false;
    };
    document.onmousedown = function () {
      return false;
    };
  }

  //moving to next question
  nextQuestion() {
    console.log(this.questions[this.currentQuestionIndex + 1].selectedAnswer);
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }

  submitQuiz() {
    // console.log(this.questions);
    Swal.fire({
      title: 'Submit quiz "' + this.questions[0].quiz.quizName + '"?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit quiz!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirmSubmitQuiz();
      }
    });
  }

  confirmSubmitQuiz() {
    // this.isSubmitted = true;
    // this.questions.forEach((question: any) => {
    // calculating total correct answers and points scored
    //   if (question.selectedAnswer == question.answer) {
    //     this.correctAnswers++;
    //     let pointsForEachQuestion =
    //       this.questions[0].quiz.maxPoints / this.questions.length;
    //     this.pointsScored += pointsForEachQuestion;
    //   }
    // calculating how many questions were attempted
    //   if (question.selectedAnswer.trim() != '') {
    //     this.questionsAttempted++;
    //   }
    // });
    // console.log('Correct Answers:' + this.correctAnswers);
    // console.log('Points Scored:' + this.pointsScored);
    // calling server to evaluate quiz

    const endTime = new Date().getTime();
    const duration = endTime - this.startTime;
    const minutesTaken = Math.floor(duration / (60 * 1000));
    const secondsTaken = Math.floor((duration % (60 * 1000)) / 1000);
    this.timeTaken = `${minutesTaken} min : ${secondsTaken} sec`;

    this.isSubmitted = true;

    this.quizService.evaluateQuiz(this.questions).subscribe(
      (data: any) => {
        // console.log(data);
        this.pointsScored = parseFloat(Number(data.pointsScored).toFixed(2));
        this.correctAnswers = data.correctAnswers;
        this.questionsAttempted = data.questionsAttempted;
      },
      (error) => {
        console.log(error);
        this.snack.open('Error submitting quiz.', 'OK', {
          duration: 3500,
          politeness: 'polite',
        });
      }
    );
  }

  startTimer() {
    let t = window.setInterval(() => {
      if (this.timer <= 0) {
        this.confirmSubmitQuiz();
        clearInterval(t);
      } else {
        this.timer--;
      }
    }, 1000);
  }

  getFormattedTime() {
    let minutes = Math.floor(this.timer / 60);
    let seconds = this.timer - minutes * 60;
    return `${minutes} min : ${seconds} sec`;
  }

  printResult() {
    window.print();
  }
}
