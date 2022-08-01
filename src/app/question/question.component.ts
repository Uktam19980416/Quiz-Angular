import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../service/question.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  public name: string = "";
  public questionList: any = [];
  public currentQuestion: number = 0;
  public points: number = 0;
  counter: number = 60;
  correctAnswer: number = 0;
  inCorrectAnswer: number = 0;
  interval$: any;
  progress: string = "0";
  isQuizCompleted: boolean = false;

  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem("name")!;
    this.getAllQuestions();
    this.startCounter();
  }

  getAllQuestions() {
    this.questionService
      .getQuestionJson()
      .subscribe(data => {
        this.questionList = data.question;
      }
    );
  }

  nextQuestion() {
    if (this.currentQuestion < this.questionList.length - 1) {
      this.currentQuestion++;
    }
  }

  previousQuestion() {
    this.currentQuestion--;
  }

  answer(currQue: number, option: any) {
    if (currQue === this.questionList.length - 1) {
      setTimeout(() => {
        this.isQuizCompleted = true;
      }, 1000);
      this.stopCounter();
    }
    if (option.correct) {
      this.points += 10;
      this.correctAnswer++;
      setTimeout(() => {
        this.currentQuestion++
        this.resetCounter();
        this.getProgress();
      }, 500);
    } else {
      this.inCorrectAnswer++;
      setTimeout(() => {
        this.currentQuestion++;
        this.resetCounter();
        this.getProgress();
      }, 500)
      this.points -= 10;
    }
  }

  startCounter() {
    this.interval$ = interval(1000)
      .subscribe(x => {
        this.counter--;
        if (this.counter === 0) {
          this.currentQuestion++;
          this.points -= 10;
          this.counter = 60;
        }
      });
    setTimeout(() => {
      this.interval$.unsubscribe();
    }, 60000);
  }

  stopCounter() {
    this.interval$.unsubscribe();
    this.counter = 0;
  }

  resetCounter() {
    this.stopCounter();
    this.counter = 60;
    this.startCounter()
  }

  resetGame() {
    this.resetCounter();
    this.points = 0;
    this.getAllQuestions();
    this.counter = 60;
    this.currentQuestion = 0;
    this.progress = "0";
  }

  getProgress() {
    this.progress = (this.currentQuestion / this.questionList.length) * 100 + "%";
  }
}
