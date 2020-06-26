import { Component, OnInit } from '@angular/core';
import { IQuestion } from '../services/question.interface';
import { Question, QuestionService } from '../services/question';
@Component({
  selector: 'app-questions-editor',
  templateUrl: './questions-editor.component.html',
  styleUrls: ['./questions-editor.component.scss']
})
export class QuestionsEditorComponent implements OnInit {
  reader: FileReader;
  questions: IQuestion[] = [];

  constructor(private questionService: QuestionService) {
    this.reader = new FileReader();
    this.reader.onloadend = () => {
      this.onFileRead();
    }
  }

  ngOnInit(): void {
  }

  onFileUpload(event: any) {
    let file: File = event.target.files[0];
    this.reader.readAsText(file);
  }

  onFileRead() {
    let data = (<string>this.reader.result).split("\n");
    let rowData;
    for (let row of data) {
      rowData = row.split(";")
      this.questions.push(new Question(rowData[0], rowData[1]));
    }
  }
}
