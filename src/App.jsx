import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Confetti from 'react-confetti';
import './App.css';

const AppWrapper = styled.div`
  font-family: 'Poppins', sans-serif;
  max-width: 600px;
  margin: 3rem auto;
  padding: 8rem;
  background-color: #0d009d53;
  color: white;
  text-align: center;
  border-radius: 45px;
  box-shadow: 0 0 10px rgb(0, 0, 0);
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (max-width: 768px) {
    padding: 3rem;
    margin: 5rem auto;
  }
`;

const Title = styled.h1`
  color: white;
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Label = styled.label`
  display: block;
  margin: 20px;
`;

const Input = styled.input`
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
  margin-left: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #ffffff;
  color: #000000;
  border: none;
  margin-top: 20px;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  width: 9rem;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 5px;
`;

const AgeMessage = styled.h2`
  margin-top: 20px;
  background-color: #4caf50;
  color: #fff;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
`;

const AudioElement = styled.audio`
  display: none;
`;

const App = () => {
  const [birthdate, setBirthdate] = useState('');
  const [age, setAge] = useState(null);
  const [error, setError] = useState('');
  const [isBirthday, setIsBirthday] = useState(false);
  const audioRef = useRef(null);

  const handleInputChange = (e) => {
    setBirthdate(e.target.value);
    setError('');
  };

  const calculateAge = () => {
    if (!birthdate) {
      setError('Please enter a valid birthdate.');
      setAge(null);
      return;
    }

    const birthDate = new Date(birthdate);
    if (isNaN(birthDate.getTime())) {
      setError('Please enter a valid birthdate.');
      setAge(null);
      return;
    }

    const today = new Date();
    const maxAgeDate = new Date(today);
    maxAgeDate.setFullYear(maxAgeDate.getFullYear() - 120);

    if (birthDate > today) {
      setError('Birthdate cannot be in the future.');
      setAge(null);
      return;
    }

    if (birthDate < maxAgeDate) {
      setError('Age cannot be more than 120 years.');
      setAge(null);
      return;
    }

    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }

    setAge(calculatedAge);
    setError('');

    if (birthDate.getMonth() === today.getMonth() && birthDate.getDate() === today.getDate()) {
      setIsBirthday(true);
      playHappyBirthdaySong();
    } else {
      setIsBirthday(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateAge();
  };

  const playHappyBirthdaySong = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <>
      <div className="wrapper">
        <h2>"Calculate Your Age, Not Your Calories - It's Free!"</h2>
      </div>
      <AppWrapper>
        <Title>AGE CALCULATOR</Title>
        <FormWrapper onSubmit={handleSubmit}>
          <Label>
            Enter your birthdate:
            <Input
              type="date"
              value={birthdate}
              onChange={handleInputChange}
              placeholder="YYYY-MM-DD"
            />
          </Label>
          <Button type="submit">Calculate Age</Button>
        </FormWrapper>

        {age !== null && !isNaN(age) && (
          <>
            <AgeMessage>Your age is: {age}</AgeMessage>
            {isBirthday && (
              <>
                <AgeMessage>Happy Birthday!</AgeMessage>
                <Confetti />
                <AudioElement ref={audioRef} autoPlay>
                  <source src="./src/assets/Happy Birthday - Stevie Wonder.mp3" type="audio/mpeg" />
                </AudioElement>
              </>
            )}
          </>
        )}
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </AppWrapper>
    </>
  );
};

export default App;
