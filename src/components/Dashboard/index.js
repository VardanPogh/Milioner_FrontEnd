import React, {useEffect, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import {API_URL} from "../../config";

const useStyles = makeStyles(_ => ({
    rightAnswer: {
        background: 'green',
    },
    wrongAnswer: {
        background: 'red'
    },
    pointsP: {
        fontSize: 30,
        margin: 'auto',
        marginTop: 38,
        color: 'red',
    }
}))


export default function Dashboard() {
    const classes = useStyles();
    const [points, setPoints] = useState();
    const [trueAnswer, setTrueAnswer] = useState(0);
    const [wrongAnswer, setWrongAnswer] = useState(0);
    const [question, setQuestion] = useState({
        id: 112,
        description: "A question",
        answers: [
            {
                id: 1,
                answer: 'a question 1',
                isTrue: 0,
            },
            {
                id: 2,
                answer: 'a question 2',
                isTrue: 1,
            },
            {
                id: 3,
                answer: 'a question 3',
                isTrue: 0,

            },
            {
                id: 4,
                answer: 'a question 4',
                isTrue: 0,
            },
        ]
    });

    const checkAnswer = (answer_id) => {
        const session_id = sessionStorage.getItem('session_id');
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(API_URL + "check_answer/" + session_id + '/' + question.id + '/' + answer_id, requestOptions)
            .then(response => response.text())
            .then(result => {
                const res = JSON.parse(result);
                if (res.is_true === 1) {  //true answer
                    setTrueAnswer(answer_id);
                } else {                //wrong anser
                    setWrongAnswer(answer_id);
                    setTrueAnswer(res.right_answer_id);
                }
                if (res.points) {
                    setPoints(res.points)
                } else {
                    setTimeout(function () {
                        setQuestion(res.newQuestion)
                    }, 3000);
                }
            })
            .catch(error => console.log('error', error));
    };

    const getFirstQuestion = () => {
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(API_URL + "get_first_question", requestOptions)
            .then(response => response.text())
            .then(result => {
                const res = JSON.parse(result);
                setQuestion(res.question);
                sessionStorage.setItem('session_id', res.id);
            })
            .catch(error => console.log('error', error));
    };

    useEffect(() => {
        sessionStorage.removeItem('session_id');
        getFirstQuestion();
    }, []);

    window.onbeforeunload = function () {
        return "Game will be restart!";
    };

    return (
        <>
            <Grid container component="main">
                {question && (
                    <Grid item sm={12}>
                        <div>
                            <h1>{question.description}</h1>
                        </div>
                    </Grid>
                )}

                {question && question.answers.map((answer, index) => (
                    <Grid item xs={12} sm={6} key={index}
                          className={trueAnswer === answer.id ? classes.rightAnswer : ' ' && wrongAnswer === answer.id ? classes.wrongAnswer : ''}>
                        <Button onClick={() => checkAnswer(answer.id)}>
                            <h3>{answer.answer}</h3>
                        </Button>
                    </Grid>
                ))}

                {points && (
                    <Grid item sm={12}>
                        <p className={classes.pointsP}><b>Final Points : </b> {points}</p>
                    </Grid>
                )}
            </Grid>
        </>
    );
}
