"use client"
import { useState, useEffect } from "react";
import axios from "axios";

export default function ProgressReport() {
  const [rateType, setRateType] = useState("");
  const [courseRatings, setCourseRatings] = useState("{}");
  const [avgScore, setAvgScore] = useState("{}");
  const [engagementReport, setEngagementReport] = useState("{}");

  const updateProgressBar = (id: string, percentage: number) => {
    const element = document.getElementById(id);
    if (element) {
      element.style.background = `conic-gradient(#fff 0% ${percentage}%, transparent ${percentage}% 100%)`;
    }
  };

  const calculateAverageScores = (response: any) => {
    let total = 0;
    let count = 0;
    for (const courseScore of response.data) {
      total += courseScore;
      count++;
    }
    return total / count;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const scores = await axios.get("http://localhost:3000/api/averageScore/instructor");
        const engagement = await axios.get("http://localhost:3000/api/studentEngagementReport?courseId=1");
        updateProgressBar("averageScores", calculateAverageScores(scores));
        updateProgressBar("engagementReport", engagement.data.average);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const updateInfo = (courseId: string) => {
   axios.get(`http://localhost:3000/api/course-rating?courseId=${courseId}`)
    .then((response: any) => {
      setCourseRatings(response.data.ratings);
      setAvgScore(response.data.avgScore);
      setEngagementReport(response.data.engagementReport);
    })
    .catch((error: any) => {
      console.error('Error fetching course data:', error);
    });
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Progress Report</h1>
      <div style={styles.grid}>
        <div style={styles.box}>
          <h2 style={styles.title}>Average Scores</h2>
          <div style={styles.progressBar} id="averageScores"></div>
        </div>
        <div style={styles.box}>
          <h2 style={styles.title}>Student Engagement Report</h2>
          <div style={styles.progressBar} id="engagementReport"></div>
        </div>
        <div style={styles.searchContainer}>
          <input
            type="text"
            id="courseId"
            placeholder="Enter Course ID"
            style={styles.input}
            onInput={(e) => updateInfo((e.target as HTMLInputElement).value)}
          />
        </div>
        <div style={styles.box}>
          <div style={styles.info}>
            <p>Course Ratings: {courseRatings}</p>
            <p>Average Score: {avgScore}</p>
            <p>Engagement Report: {engagementReport}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center" as "center",
    backgroundColor: "#0000ff",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
    minHeight: "100vh",
    padding: "20px",
  },
  header: {
    fontSize: "2rem",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },
  box: {
    backgroundColor: "#ff00ff",
    padding: "20px",
    borderRadius: "10px",
  },
  title: {
    fontSize: "1.5rem",
    marginBottom: "20px",
  },
  progressBar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    margin: "0 auto",
    background: "conic-gradient(#fff 0% 0%, transparent 0%)",
  },
  searchContainer: {
    gridColumn: "span 2",
    margin: "20px 0",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    width: "80%",
  },
  info: {
    textAlign: "left" as "left",
  },
  rateSection: {
    marginTop: "20px",
    gridColumn: "span 2",
  },
  buttons: {
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    margin: "5px",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  inputSmall: {
    padding: "10px",
    margin: "5px",
    borderRadius: "5px",
    border: "none",
    width: "calc(50% - 12px)",
  },
};