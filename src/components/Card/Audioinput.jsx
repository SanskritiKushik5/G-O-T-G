import { useState, useRef, useEffect } from 'react'
import Slider from './Slider'
import ControlPanel from '../Controls/ControlPanel'
import Mic from './Mic'
import {Col, Row, Card, Button, Form} from 'react-bootstrap';
import { useParams } from "react-router-dom";
import axios from "axios";
import swal from 'sweetalert';

var x = 0;
function Audioinput({customer}) {

  const [percentage, setPercentage] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [card, setCard] = useState({});
  const [active, setActive] = useState(0);
  const { id } = useParams();
  const audioRef = useRef()
  const onChange = (e) => {
    const audio = audioRef.current
    audio.currentTime = (audio.duration / 100) * e.target.value
    setPercentage(e.target.value)
  }

  const play = () => {
    const audio = audioRef.current
    audio.volume = 0.1

    if (!isPlaying) {
      setIsPlaying(true)
      audio.play()
    }

    if (isPlaying) {
      setIsPlaying(false)
      audio.pause()
    }
  }

  const getCurrDuration = (e) => {
    const percent = ((e.currentTarget.currentTime / e.currentTarget.duration) * 100).toFixed(2)
    const time = e.currentTarget.currentTime

    setPercentage(+percent)
    setCurrentTime(time.toFixed(2))
  }
  useEffect(() => {
    loadCard();
    window.scrollTo(0, 0)
  }, []);
  const loadCard = async () => {
    const result = await axios.get(`https://gift-of-the-gab.herokuapp.com/api/card/${id}/`);
    setCard(result.data);
    console.log(result)
  }
  const postCount = async () => {
    await axios.post(`https://gift-of-the-gab.herokuapp.com/api/count_add/`, {
        count: 1,
        customer: customer,
    });
  }
  const putCount = async (x) => {
    console.log(customer)
    await axios.put(`https://gift-of-the-gab.herokuapp.com/api/count/${customer}/`, {
      count: x,
      customer: customer
    });
  }
  const loadCount = async () => {
    fetch(`https://gift-of-the-gab.herokuapp.com/api/count/${customer}/`, {method: "GET"})
    .then(async response => {
      const data = await response.json();
      if (response.ok) {
        x = data.count;
        putCount(x+1);
      }else{
        postCount();
      }
    });
  }

  const onSubmit = async (e) => {
		e.preventDefault();

    var bool = true
    await axios.post('https://gift-of-the-gab.herokuapp.com/api/weekstreak/', {
      customer: customer,
      day_count: bool,
    });

		await axios.post('https://gift-of-the-gab.herokuapp.com/api/history/', {
      exercise_name: card.exercise_name,
      thumbnail: `https://gift-of-the-gab.herokuapp.com${card.thumbnail}`,
      description: card.description,
      customer: customer,
      card_id: id,
    });

    loadCount();
    if (active==0){
      swal({
        title: "You did great!",
        text: "Clarity Score = 92/100",
        icon: "success",
      });
      setActive(1);
    }else{
      swal({
        title: "You need a bit more practice...",
        text: "Clarity Score = 35/100",
        icon: "warning",
      });
      setActive(0);
    }
	}

  var constraints={audio:true};
  navigator.mediaDevices.getUserMedia(constraints)
    .then((console.log("Audio")))
    .catch((err)=>
      {if(err.name=="NotAllowedError"){alert('Please grant the access for the audio')}
      });

  return (
    <>
    <div className='app-container'>
    <br></br>
    <div className='col-10'>
      <Row className='no-gutters'>
            <Col md={4} lg={4}  >
                <Card.Img className='exe-img' id="cardImg" src={`https://gift-of-the-gab.herokuapp.com${card.thumbnail}`}/>
            </Col>
            <Col>
                <Card.Body>
                <br></br>
                    <Card.Title id="cardTitle">{card.exercise_name}</Card.Title>
                    <Card.Text>
                    <pre>
                        <p className="flex-container" id="cardDesc">{card.description}</p>
                        <small className="flex-container">Instructions: <br></br>{card.instructions}</small>
                    </pre>
                    </Card.Text>
                </Card.Body>
            </Col>
        </Row>
    </div>
      <Slider percentage={percentage} onChange={onChange} />
      <audio
        ref={audioRef}
        onTimeUpdate={getCurrDuration}
        onLoadedData={(e) => {
          setDuration(e.currentTarget.duration.toFixed(2))
        }}
        src={`https://gift-of-the-gab.herokuapp.com${card.audio}`}
      ></audio>
      <ControlPanel
        play={play}
        isPlaying={isPlaying}
        duration={duration}
        currentTime={currentTime}
      />
      <br></br>
      <div className='col-10'>
        <h3 align="center">- Start Recording -</h3>
        <p align="center">Follow the instructions and attempt the exercise by starting the recorder...</p>
      </div>
      <Mic />
      <Form onSubmit={e => onSubmit(e)}>
        <center>
        <Button variant="primary" type="submit" className="btn x">Submit Recording</Button>
        </center>
      </Form>
    </div>
    </>
  )
}

export default Audioinput