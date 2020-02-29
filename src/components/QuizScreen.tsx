import React, { Component, Suspense } from 'react';
import { withRouter } from 'react-router-dom';

import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

import QuizService from '../services/QuizService';
import '../styles/QuizScreen.css'
import Auth from '../services/AuthService';
type State = {
    currentQuestion: number
    currentProblem: {
        question: string,
        correctAnswer: string,
        wrongAnswer: []
    },
    problems: Array<any>
}

class QuizScreen extends Component<any, State> {

    public selectedAnswer: string;
    public correctAnswerCount: number;
    public timeElapsed: number;
    public timer: any;
    constructor(props: any) {
        super(props);
        // const quizService = new QuizService({});
        // console.log(QuizService.problems);
        console.log('Inside quiz screen');
        
        this.state = {
            currentQuestion: 0,
            currentProblem: {
                question: '',
                correctAnswer: '',
                wrongAnswer: []
            },
            problems: QuizService.problems
        };
        this.selectedAnswer = '';
        this.correctAnswerCount = 0;
        this.timeElapsed = 0;
        this.timer = 0;
        
    }

    componentDidMount() {
        this.timer = setInterval(() => {
            this.timeElapsed += 1;
        }, 1000);
    }



    /**
     * Calls the respective card generator
     * @param currentIndex : current index of question
     */
    generateQuizCard(currentIndex: number) {
        if (this.state.problems !== undefined) {
            if (this.state.problems[currentIndex] !== undefined) {
                let options = this.state.problems[currentIndex].incorrect_answers;
                options.push(this.state.problems[currentIndex].correct_answer);
                let shuffledOptions = this.shuffleArray(options);
                if (this.state.currentQuestion !== this.state.problems.length-1) {
                    return (this.generateQuizQuestionCard(currentIndex, shuffledOptions));
                } else {
                    return (this.generateQuizResponseCard());
                }
            }
        }

    }

    /**
     * generates card with mulitple choice questions
     *
     * @param currentIndex : current index of question to be displayed
     * @param shuffledOptions : randomly generated array of strings
     */
    generateQuizQuestionCard(currentIndex: number, shuffledOptions: Array<string>) {
        return (
            <React.Fragment>
                <Card className='quiz-question'>
                    <div>
                        <label>{this.state.problems[currentIndex].question}</label>
                    </div>
                    <div className='p-grid'>
                        <div className='p-col-6'>
                            <input type='radio' id='opt1' value={shuffledOptions[0]} name="choices" onChange={(e) => this.changeAnswer(e)}></input>
                            <label htmlFor="opt1" className='p-radiobutton-label'>{shuffledOptions[0]}</label>
                        </div>
                        <div className='p-col-6'>
                            <input type='radio' id='opt2' value={shuffledOptions[1]} name="choices" onChange={(e) => this.changeAnswer(e)}></input>
                            <label htmlFor="opt2" className='p-radiobutton-label'>{shuffledOptions[1]}</label>
                        </div>
                        <div className='p-col-6'>
                            <input type='radio'  id='opt3' value={shuffledOptions[2]} name="choices" onChange={(e) => this.changeAnswer(e)}></input>
                            <label htmlFor="opt3" className='p-radiobutton-label'>{shuffledOptions[2]}</label>
                        </div>
                        <div className='p-col-6'>
                            <input type='radio'  id='opt4' value={shuffledOptions[3]} name="choices" onChange={(e) => this.changeAnswer(e)}></input>
                            <label htmlFor="opt4" className='p-radiobutton-label'>{shuffledOptions[3]}</label>
                        </div>
                    </div>
                    <div className = 'submit'>
                        <Button label='Submit' className='p-button-success p-button-raise p-button-rounded' onClick={() => this.validateResult()}></Button>
                    </div>
                </Card>
            </React.Fragment>
        )
    }

    
    changeAnswer(e: React.SyntheticEvent<HTMLInputElement, Event>){
        this.selectedAnswer = (e.target as HTMLInputElement).value;        
    }

    /**
     * Generate response card after quiz has been completed
     */
    generateQuizResponseCard() {
        let timeTaken: string;
        this.correctAnswerCount+=1;
        clearInterval(this.timer);
        if (this.timeElapsed > 60) {
            let mins = this.timeElapsed / 60;
            if (mins > 60) {
                let hours = mins / 60;
                mins = mins % 60;
                timeTaken = hours.toString().split('.')[0] + ' hour ' + mins.toString() + ' mins';
            } else {
                let secs = this.timeElapsed % 60;
                timeTaken = mins.toString().split('.')[0] + ' mins ' + secs.toString() + ' sec';
            }
        } else {
            timeTaken = this.timeElapsed.toString() + ' sec';
        }
        const incorrect_count = (this.state.problems.length-1) - this.correctAnswerCount;
        const overall_grade = (this.correctAnswerCount/(this.state.problems.length-1))*100 + '%';
        return (
            <React.Fragment>
                <Card title='Quiz Completed' className = 'quiz-completed'>
                <div className = 'p-grid'>
                    <div className = 'p-col-8'>
                    <div>
                        Correct Answer : {this.correctAnswerCount}
                    </div>
                    <div>
                        Incorrect Answers : {incorrect_count}
                    </div>
                    <div>
                        Time taken : {timeTaken}
                    </div>
                    <div>
                        Overall Grade: {overall_grade}
                    </div>
                    </div>
                    <div className = 'p-col-4 p-justify-center'>
                    <Button label='Start Again' className='p-button-danger p-button-raise p-button-rounded' onClick={() => this.startQuizAgain()}></Button>
                    </div>
                </div>
                </Card>
            </React.Fragment>
        )
    }


    startQuizAgain() {
        Auth.deAuthenticate( () => {
            console.log('INside deauth');
            
            this.props.history.push('/');
        });
    }

    async validateResult() {
        await this.setState({
            currentProblem: {
                question: this.state.problems[this.state.currentQuestion].question,
                correctAnswer: this.state.problems[this.state.currentQuestion].correct_answer,
                wrongAnswer: this.state.problems[this.state.currentQuestion].incorrect_answers,
            },
            currentQuestion: this.state.currentQuestion + 1,
        });
        console.log('CQ in validate-' + this.state.currentQuestion);
        // if(this.state.currentQuestion === this.state.problems.length) {
        //     this.generateQuizResponseCard();
        // }
        
        console.log('correct answer-' + this.state.currentProblem.correctAnswer);
        console.log('selected answer -' + this.selectedAnswer);
        
        
        if (this.state.currentProblem.correctAnswer === this.selectedAnswer) {
            this.correctAnswerCount += 1;
            console.log(this.correctAnswerCount);
            
        }



    }


    shuffleArray(options: Array<string>): Array<string> {
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        return options;
    }


    render() {
        return (
            <React.Fragment>
                <div className='p-grid p-justify-center wel-div1'>
                    <div className='p-col-6'>
                        <Suspense fallback={<div>Loading..</div>}>
                            {this.generateQuizCard(this.state.currentQuestion)}
                        </Suspense>
                    </div>

                </div>
            </React.Fragment>
        )
    }
}


export default withRouter(QuizScreen);