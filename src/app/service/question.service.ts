import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(private http: HttpClient) {}

  //get questions from a quiz (all questions for admin)
  public getQuestionsFromQuiz(quizID: any) {
    return this.http.get(`${baseUrl}/question/quiz/all/${quizID}`);
  }

  //get questions from a quiz (only the number of questions that are allowed to be displayed for user)
  public getQuestionsFromQuizForUser(quizID: any) {
    return this.http.get(`${baseUrl}/question/quiz/${quizID}`);
  }

  //add question into a quiz
  public addQuestionIntoQuiz(question: any) {
    return this.http.post(`${baseUrl}/question/`, question);
  }

  //delete question based on question id
  public deleteQuestion(questionID: any) {
    return this.http.delete(`${baseUrl}/question/${questionID}`);
  }

  //load a question
  public getQuestion(questionID: any) {
    return this.http.get(`${baseUrl}/question/${questionID}`);
  }

  //update a question
  public updateQuestion(question: any) {
    return this.http.put(`${baseUrl}/question/`, question);
  }
}
