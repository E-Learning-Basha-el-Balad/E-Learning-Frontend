"use client"
import { useState, useEffect } from "react";
import axios from "axios";

export default function ProgressReport() {
  const [courseId, setCourseId] = useState("");
  const [studentReport, setStudentReport] = useState<any>(null);
  const [courseRatings, setCourseRatings] = useState<any[]>([]);
  const [averageScores, setAverageScores] = useState<any[]>([]);

  const fetchStudentReport = (courseId: string) => {
    axios.get(`https://localhost:3000/progress/studentEngagementReport?courseId=${courseId}`)
      .then((response: any) => {
        setStudentReport(response.data);
      })
      .catch((error: any) => {
        console.error('Error fetching student report:', error);
      });
  };

  const fetchCourseRatings = () => {
    axios.get("https://localhost:3000/progress/course-rating")
      .then((response: any) => {
        setCourseRatings(response.data);
      })
      .catch((error: any) => {
        console.error('Error fetching course ratings:', error);
      });
  };

  const fetchAverageScores = () => {
    axios.get("https://localhost:3000/progress/averageScore/instructor")
      .then((response: any) => {
        setAverageScores(response.data);
      })
      .catch((error: any) => {
        console.error('Error fetching average scores:', error);
      });
  };

  useEffect(() => {
    fetchCourseRatings();
    fetchAverageScores();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Progress Report</h1>
      <div style={styles.grid}>
        <div style={styles.box}>
          <h2 style={styles.title}>Student Report</h2>
          <input
            type="text"
            placeholder="Enter Course ID"
            style={styles.input}
            onChange={(e) => setCourseId(e.target.value)}
          />
          <button style={styles.button} onClick={() => fetchStudentReport(courseId)}>
            Get Report
          </button>
          {studentReport && (
            <div style={styles.info}>
              <p>Number of enrolled students:</p>
              <ul>
                <li>Total: {studentReport["Number of enrolled students"].Total}</li>
                <li>Below Average: {studentReport["Number of enrolled students"]["Below Average"]}</li>
                <li>Average: {studentReport["Number of enrolled students"].Average}</li>
                <li>Above Average: {studentReport["Number of enrolled students"]["Above Average"]}</li>
              </ul>
              <p>Number of students who completed the course: {studentReport["Number of students who completed the course"]}</p>
              <p>Average Score: {studentReport["Average Score"]}</p>
            </div>
          )}
        </div>
        <div style={styles.box}>
          <h2 style={styles.title}>Course Ratings</h2>
          <ul>
            {courseRatings.map((rating) => (
              <li key={rating.course_id}>
                {rating.course_title}: {rating.averageRating}
              </li>
            ))}
          </ul>
        </div>
        <div style={styles.box}>
          <h2 style={styles.title}>Average Scores</h2>
          <ul>
            {averageScores.map((score) => (
              <li key={score.course}>
                {score.course}: {score.avg}
              </li>
            ))}
          </ul>
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
    gridTemplateColumns: "1fr",
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
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    width: "80%",
  },
  button: {
    padding: "10px 20px",
    margin: "10px 0",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  info: {
    textAlign: "left" as "left",
  },
};