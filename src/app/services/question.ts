import { IQuestion } from './question.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export class Question implements IQuestion {
  text: string;
  answer: string;
  shared: boolean = true;

  constructor(text: string, answer: string) {
    this.text = text;
    this.answer = answer;
  }
}

@Injectable()
export class QuestionService {
  constructor(private http: HttpClient) {}

  saveAll(questions: IQuestion[]) {
    return this.http.post("http://localhost:3000/questions", {"questions": questions});

  }
}
