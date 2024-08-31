import React from "react";
import "./DashBoard.css";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/courseCard/CourseCard";

const Dashboard = () => {
  const { mycourse } = CourseData();
  console.log(mycourse);

  return (
    <div className="student-dashboard">
      <h2>All Enrolled Courses</h2>
      <div className="dashboard-content">
        {mycourse && mycourse.length > 0 ? (
          mycourse.map((e) => <CourseCard key={e._id} course={e} />)
        ) : (
          <p>No Course Enrolled Yet</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
