import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  constructor(private http: HttpClient) {}

  //load all quizzes
  public quizzes() {
    return this.http.get(`${baseUrl}/quiz/`);
  }

  //add a quiz
  public addQuiz(quiz: any) {
    return this.http.post(`${baseUrl}/quiz/`, quiz);
  }

  //delete quiz based on quiz id
  public deleteQuiz(quizID: any) {
    return this.http.delete(`${baseUrl}/quiz/${quizID}`, {
      responseType: 'text',
    });
  }

  //load one quiz
  public getQuiz(quizID: any) {
    return this.http.get(`${baseUrl}/quiz/${quizID}`);
  }

  //update quiz
  public updateQuiz(quiz: any) {
    return this.http.put(`${baseUrl}/quiz/`, quiz);
  }

  //get quizzes from a category
  public getQuizzesFromCategory(categoryID: any) {
    return this.http.get(`${baseUrl}/quiz/category/${categoryID}`);
  }

  // evaluate quiz
  public evaluateQuiz(questions: any) {
    return this.http.post(`${baseUrl}/quiz/evaluate-quiz`, questions);
  }
}
