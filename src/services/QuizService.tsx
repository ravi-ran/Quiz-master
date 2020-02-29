import React from 'react';
import axios from 'axios';
import Environment from '../environment/environment';

class QuizService extends React.Component {

    problems: Array<any> = [];
    
    fetchQuiz(noOfQuestion: number, category: string, difficulty: string) {
        const environment = new Environment({});
        
        return axios.get(environment.apiEnvironmentUrls.host, {
            params: {
                amount: noOfQuestion,
                category: category,
                difficulty: difficulty,
                type: 'multiple'
            }
        });
    }
}

export default new QuizService({});