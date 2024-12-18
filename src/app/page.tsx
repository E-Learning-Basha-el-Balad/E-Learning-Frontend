'use client'
import React from "react";
import axios from "axios";
import { useActionState, useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/ui/Nav";
import mongoose, { Schema, Document, Types } from 'mongoose';
import Image from 'next/image';
import { error } from "console";
import { Router } from "next/router";

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  gpa: number;
  enrolledCourses: Types.ObjectId[]; // Assuming this is an array of course IDs or names
  createdCourses: Types.ObjectId[];  // Same as above
  createdAt: string; // or Date, depending on how it's stored
  updatedAt: string; // or Date
  __v: number;
}



const HomePage = () => {
  const [email, setEmail] = useState<string>(); 
  const [role, setRole] = useState<string>();
  const [name, setName] = useState<string>();
  const[id,setId]= useState<string>();
  const[enrolledCourses,SetEnrolledCourses]= useState<Types.ObjectId[]>();
  const[createdCourses,SetCreatedCourses]= useState<Types.ObjectId[]>();
  const [guest, setGuest] = useState<boolean>(false);
  const router = useRouter();
  const svgUrl = process.env.REACT_APP_SVG_URL;

  let new_user;

  const setUser =(new_user:User)=>{
    setId(new_user._id)
    setName(new_user.name)
    setEmail(new_user.email)
    setRole(new_user.role)
    SetEnrolledCourses(new_user.enrolledCourses)
    SetCreatedCourses(new_user.createdCourses)

  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/userData", { withCredentials: true });
  
        if (response.status === 200) {
          const new_user = response.data;
          setUser(new_user);
          setGuest(false);
        }
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          setGuest(true);
          return;
        }
        console.error('Error fetching user data:', error.response?.data || error.message);
      }
    };
  
    fetchData();
  }, []); 

  const handleBrowseCourses = () => {

    if(guest == true){
      localStorage.setItem('isGuest','true')
    }
    else if(guest == false){
      localStorage.setItem('isGuest','false')
    }
    
    router.push('./Courses'); 
  };

  
  const handleBrowseInstrucotrs = () => {
    router.push('./Instructors'); 
  };
  
    

  return (
    <>
    <style>{`
      @font-face {
        font-family: 'CustomFont';
        src: url('/Bungee-Regular.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
      @font-face {
        font-family: 'CustomFont2';
        src: url('/Fredoka.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
      body {
      background-color: #31087b;
      background-image: url(svgUrl);
        font-family: 'CustomFont', sans-serif;
        background-color: #31087b; /* Page background color */
        margin: 0;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `}</style>

<div className="container">
  <NavBar isGuest={guest}  name={name} />
  <h1 className="title" style={{ color: 'white' }}>Welcome to Alpine Academy</h1>
  <p className="content" style={{ color: 'white' }}>
    Climb the Peaks of Knowledge with Us!
  </p>
  <br /><br />
  <p className="content" style={{ fontFamily: 'CustomFont2', color: 'white' }}>
    Just like every mountain has its summit, every learner has their potential waiting to be reached. At Alpine Academy, we’re here to help you scale those heights. Whether you're mastering new skills, exploring fresh topics, or forging your path to success, we've got your back every step of the way.
  </p>
  <br /><br />
  <p className="content" style={{ color: 'white' }}>
    Start your ascent today and reach new peaks in your learning journey!
  </p>
  <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <button
          className="btn btn-outline-primary rounded-pill"
          style={{
            backgroundColor: 'white',
            color: '#fa2fb5',
            borderColor: '#fa2fb5'
          }}
          onClick={handleBrowseCourses} // Add the navigation handler
        >
          Browse our course selection
          
        </button>
        <button
          className="btn btn-outline-primary rounded-pill"
          style={{
            backgroundColor: 'white',
            color: '#fa2fb5',
            borderColor: '#fa2fb5'
          }}
          onClick={handleBrowseInstrucotrs} // Add the navigation handler
        >
          Browse our Instructors selection
          
        </button>
      </div>
      
</div>
  </>
  );
};

export default HomePage;