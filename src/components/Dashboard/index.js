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

    const checkAnswer = (id) => {
        let selectedQuestion = question.answers.find(obj => {
            return obj.id === id
        });
        let session_id = sessionStorage.getItem('session_id');
        if (selectedQuestion.is_true === 1) {
            let newPoint = question.points;
            setTrueAnswer(id);
            getQuestion(session_id, newPoint);
        } else {
            setWrongAnswer(id);
            setTrueAnswer(question.answers.find(obj => {
                return obj.is_true === 1;
            }).id);
            setTimeout(function () {
                getQuestion(session_id, 0);
            }, 1000);
        }
    };

    const getQuestion = (session_id, point) => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(API_URL + "question/" + session_id + "/" + point, requestOptions)
            .then(response => response.text())
            .then(result => {
                let res = JSON.parse(result);
                if (res.points) {
                    setPoints(res.points)
                } else {
                    setQuestion(res.question);
                    sessionStorage.setItem('session_id', res.id)
                }
            })
            .catch(error => console.log('error', error));
    };

    useEffect(() => {
        sessionStorage.removeItem('session_id');
        getQuestion(0, 0);
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
