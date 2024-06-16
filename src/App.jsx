import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Confetti from 'react-confetti';
import './App.css';

const AppWrapper = styled.div`
  font-family: 'Poppins', sans-serif;
  max-width: 600px;
  margin: 3rem auto;
  padding: 8rem;
  background-color: #8f8ca752;
  color: white;
  text-align: center;
  border-radius: 45px;
  box-shadow: 0 0 10px rgb(0, 0, 0);
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (max-width: 768px) {
    padding-bottom: 10rem;
    padding-top: 10rem;
    padding: 3rem;
    margin: 5rem auto;
  }
`;

const Title = styled.h1`
  color: white;
  text-align: center;
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  margin: 20px;
  width: max-content;
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
  background-color: #000000;
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
  const [daysUntilBirthday, setDaysUntilBirthday] = useState(null);
  const audioRef = useRef(null);

  const handleInputChange = (e) => {
    setBirthdate(e.target.value);
    setError('');
  };

  const calculateAge = () => {
    if (!birthdate) {
      setError('Please enter a valid birthdate.');
      setAge(null);
      setDaysUntilBirthday(null);
      return;
    }

    const birthDate = new Date(birthdate);
    if (isNaN(birthDate.getTime())) {
      setError('Please enter a valid birthdate.');
      setAge(null);
      setDaysUntilBirthday(null);
      return;
    }

    const today = new Date();
    const maxAgeDate = new Date(today);
    maxAgeDate.setFullYear(maxAgeDate.getFullYear() - 120);

    if (birthDate > today) {
      setError('Birthdate cannot be in the future.');
      setAge(null);
      setDaysUntilBirthday(null);
      return;
    }

    if (birthDate < maxAgeDate) {
      setError('Age cannot be more than 120 years.');
      setAge(null);
      setDaysUntilBirthday(null);
      return;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    setAge(age);
    setError('');

    if (birthDate.getMonth() === today.getMonth() && birthDate.getDate() === today.getDate()) {
      setIsBirthday(true);
      playHappyBirthdaySong();
      setDaysUntilBirthday(0);
    } else {
      setIsBirthday(false);
      const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
      if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
      }
      const daysUntilBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
      setDaysUntilBirthday(daysUntilBirthday);
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
        <h2>Math Not Your Thing? Find Your Age Here!
        </h2>
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
            {!isBirthday && daysUntilBirthday !== null && (
              <AgeMessage>Days until your next birthday: {daysUntilBirthday}</AgeMessage>
            )}
            {isBirthday && (
              <>
                <AgeMessage>Happy Birthday!</AgeMessage>
                <Confetti />
                <AudioElement ref={audioRef} autoPlay>
                  <source src="/assets/Happy.mp3" type="audio/mpeg" />
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
