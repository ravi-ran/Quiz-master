import * as React from 'react';
import { withRouter } from 'react-router-dom';

import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import '../styles/WelcomeScreen.css'
import QuizService from '../services/QuizService';
import Auth from '../services/AuthService';

type State = {
    noOfQuestions: number;
    category: string;
    difficulty: string;
    amountValid: boolean;
    categoryValid: boolean;
    difficultyValid: boolean;
    btnEnabeld: boolean;
}

class WelcomeScreen extends React.Component<any,State> {

    
    constructor(props: any) {
        super(props);
        this.state = {
            noOfQuestions: 0,
            category: '',
            difficulty: '',
            amountValid: false,
            categoryValid: false,
            difficultyValid: false,
            btnEnabeld: false
        }

    }
    render() {
        return (
            <React.Fragment>
                <div className='p-grid p-justify-center wel-div'>
                    <div className='p-col-6 p-grid'>
                        <div className='p-col-12'>
                            <Card className='welcome-card' title='Design your Quiz!'>
                                
                                    <div className='p-col-12 amount'>
                                        <span className='p-float-label'>
                                            <InputText id='no-of-question' type='text' keyfilter='pint' value={this.state.noOfQuestions} onChange={(e) => this.validateAmount(e)} />
                                            <label htmlFor="no-of-question">Number of questions </label>
                                        </span>
                                    </div>
                                    <div className='p-col-12'>
                                        <label htmlFor="category">Select a category</label>
                                        <div id='category p-grid'>
                                            <div className='p-col-12'>
                                                <input type='radio' value='9' name='category' id='opt1' onChange={(e) => this.validateCategory(e)}></input>
                                                <label htmlFor="opt1" className='p-radiobutton-label'>General Knowledge</label>
                                            </div>
                                            <div className='p-col-12'>
                                                <input type='radio' value='10' name='category' id='opt2' onChange={(e) => this.validateCategory(e)}></input>
                                                <label htmlFor="opt2" className='p-radiobutton-label'>Books</label>
                                            </div>
                                            <div className='p-col-12'>
                                                <input type='radio' value='11' name='category' id='opt3' onChange={(e) => this.validateCategory(e)}></input>
                                                <label htmlFor="opt3" className='p-radiobutton-label'>Movies</label>
                                            </div>
                                            <div className='p-col-12'>
                                                <input type='radio' value='21' name='category' id='opt4' onChange={(e) => this.validateCategory(e)}></input>
                                                <label htmlFor="opt4" className='p-radiobutton-label'>Sports</label>
                                            </div>
                                            <div className='p-col-12'>
                                                <input type='radio' value='15' name='category' id='opt5' onChange={(e) => this.validateCategory(e)}></input>
                                                <label htmlFor="opt5" className='p-radiobutton-label'>Video Games</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='p-col-12'>
                                        <label htmlFor="difficulty">Select Difficulty</label>
                                        <div id='difficulty p-grid'>
                                            <div className='p-col-12'>
                                                <input type='radio' value='easy' name='difficulty' id='dOpt1' onChange={(e) => this.validateDifficulty(e)}></input>
                                                <label className='p-radiobutton-label' htmlFor="dOpt1">Easy</label>
                                            </div>
                                            <div className='p-col-12'>
                                                <input type='radio' value='medium' name='difficulty' id='dOpt2' onChange={(e) => this.validateDifficulty(e)}></input>
                                                <label className='p-radiobutton-label' htmlFor="dOpt2">Medium</label>
                                            </div>
                                            <div className='p-col-12'>
                                                <input type='radio' value='hard' name='difficulty' id='dOpt3' onChange={(e) => this.validateDifficulty(e)}></input>
                                                <label className='p-radiobutton-label' htmlFor="dOpt3">Hard</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='p-col-12 quiz-generator'>
                                        <Button disabled={!this.state.btnEnabeld} label='Lets GO' className='p-button-success p-button-raise p-button-rounded ' onClick={() => this.generateQuiz()}></Button>
                                    </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    /**
     * does an api call to fetch the quiz details
     */
    private async generateQuiz() {
        // const quizService = new QuizService({});
        let problems;
        await QuizService.fetchQuiz(this.state.noOfQuestions+1, this.state.category, this.state.difficulty)
        .then((success) => {
            problems = success.data.results;
            QuizService.problems = problems;
            Auth.authenticate(() => {
                console.log('inside authenticate');                
                this.props.history.push('/quiz');
            })
        },
            (failure) => {
                console.error('Failure while fetching quiz');
                console.error(failure);
            });

    }


    private async validateDifficulty(e: React.ChangeEvent<HTMLInputElement>) {
        await this.setState({ difficulty: e.target.value, difficultyValid: true });
        if (this.state.amountValid && this.state.categoryValid && this.state.difficultyValid) {
            this.setState({ btnEnabeld: true });
        } else {
            this.setState({ btnEnabeld: false })
        }
    }


    private async validateCategory(e: React.ChangeEvent<HTMLInputElement>) {
        await this.setState({ category: e.target.value, categoryValid: true });
        if (this.state.amountValid && this.state.categoryValid && this.state.difficultyValid) {
            this.setState({ btnEnabeld: true });
        } else {
            this.setState({ btnEnabeld: false })
        }
    }

    private async validateAmount(e: React.FormEvent<HTMLInputElement>) {
        let value = parseInt((e.target as HTMLInputElement).value);

        if (isNaN(value)) {
            await this.setState({
                noOfQuestions: 0,
                btnEnabeld: false,
                amountValid: false,

            });
        } else {
            await this.setState({ noOfQuestions: value, amountValid: true })
        }

        if (this.state.amountValid && this.state.categoryValid && this.state.difficultyValid) {
            this.setState({ btnEnabeld: true });
        } else {
            this.setState({ btnEnabeld: false })
        }

    }

}

export default withRouter(WelcomeScreen);