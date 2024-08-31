import React, { useContext, useEffect, useState } from "react";
import "./Coursedescription.css";
import { useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContextProvider, UserData } from "../../context/UserContext";
import Loading from "../../components/loading/Loading";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51OuvygSFotcfnJdUMBjwJSVXhD60OujHbkkmKi00tjDw5g6gk9PsONtcFLsCMc3nsjgR0Op2oynQgapS837kYGoO001zQv2ztC");

const CourseDescription = ({ user }) => {
    const params = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { fetchUser } = UserData();
    const { fetchCourse, course, fetchCourses, fetchMyCourse  } = CourseData();

    useEffect(() => {
        fetchCourse(params.id);
      }, []);

    

    const checkoutHandler = async () => {

        try {
            const token = localStorage.getItem("token");
            setLoading(true);
            console.log(token);
            
            // Make a request to your server to create a checkout session
            const response = await fetch(`${server}/api/course/checkout/${course._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${token}`, // Sending the token directly
                },
                redirect: 'follow'
            });

            // Check if the response is not ok
            if (!response.ok) {
                const errorText = await response.text(); // Read response text for debugging
                throw new Error(`Network response was not ok. Status: ${response.status}, ${errorText}`);
            }

            

            // Parse the JSON response
            const session = await response.json();
            console.log('Checkout session created:', session); // Debug: Log session details

            // Initialize Stripe and redirect to checkout
            const stripe = await stripePromise; // Use the stripePromise directly
            const result = await stripe.redirectToCheckout({
                sessionId: session.id,
            });

            // Handle any errors from Stripe
            if (result.error) {
                console.error('Stripe Checkout error:', result.error.message);
            } else {
                // Fetch the user's courses after successful checkout
                await fetchUser();
                await fetchCourses();
                await fetchMyCourse();
                // toast.success(data.message);
                setLoading(false);
            }
            
        } catch (error) {
            console.error('Error during checkout:', error);
            toast.error(`Error during checkout: ${error.message}`);
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <>
                    {course && (
                        <div className="course-description">
                            <div className="course-header">
                                <img
                                    src={`${server}/${course.image}`}
                                    alt={course.title}
                                    className="course-image"
                                />
                                <div className="course-info">
                                    <h2>{course.title}</h2>
                                    <p>Instructor: {course.createdBy}</p>
                                    <p>Duration: {course.duration} weeks</p>
                                </div>
                            </div>

                            <p>{course.description}</p>

                            <p>Let's get started with the course at ₹{course.price}</p>

                            {user && user.subscription.includes(course._id) ? (
                                <button
                                    onClick={() => navigate(`/course/study/${course._id}`)}
                                    className="common-btn"
                                >
                                    Study
                                </button>
                            ) : (
                                <button onClick={checkoutHandler} className="common-btn">
                                    Buy Now
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default CourseDescription;
