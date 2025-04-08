import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sampleNews = [
    { title: "New Research Lab Inaugurated", content: "The state-of-the-art AI research lab was opened today at IIT Ropar." },
    { title: "AI Workshop Next Week", content: "Join the upcoming AI workshop to learn about deep learning." },
    { title: "Library Timings Extended", content: "The library will now be open till 10 PM every day." },
    { title: "Blockchain in Education", content: "IIT Ropar to introduce blockchain-based certificate verification." },
    { title: "Sports Meet 2025 Announced", content: "Annual sports meet to be held next month. Get ready!" },
    { title: "IIT Ropar Ranked Among Top 10", content: "IIT Ropar has secured a spot in the top 10 engineering institutes in India." },
    { title: "New Book Arrivals", content: "Check out the latest books in the library, covering AI, ML, and cybersecurity." },
    { title: "Hackathon Winners Announced", content: "The winners of the annual coding hackathon were announced. Congratulations to all participants!" },
    { title: "Internship Fair 2025", content: "The Internship Fair will be held next month. Register to connect with top companies." },
    { title: "Startup Incubation Program", content: "IIT Ropar launches a startup incubation program for student entrepreneurs." },
    { title: "Alumni Success Story", content: "An IIT Ropar alum has been featured in Forbes 30 Under 30 for their contributions to AI research." },
    { title: "New Canteen Menu", content: "The canteen has introduced a new, healthier menu based on student feedback." },
    { title: "Annual Tech Fest Registrations Open", content: "Registrations for the annual tech fest 'TechVibes' are now open. Don't miss it!" },
    { title: "AI-Powered Library System Launched", content: "A new AI-powered book recommendation system has been integrated into the library portal." },
    { title: "Hostel Renovations Completed", content: "The newly renovated hostels are now open, featuring modern amenities." },
    { title: "Scholarships Announced", content: "New scholarships for outstanding research and academic excellence have been introduced." }
  ];
  
  const sampleNotifications = [
    { message: "📚 New books have been added to the library. Check them out!" },
    { message: "⏳ Reminder: Book return due date is approaching!" },
    { message: "✅ Seat bookings for next week are now open." },
    { message: "🚀 Internship applications open for summer 2025!" },
    { message: "📢 Your book reservation has been approved." },
    { message: "⚠️ Overdue Notice: Please return 'Introduction to AI' to avoid late fees." },
    { message: "🎓 Guest Lecture: Join Dr. XYZ for a talk on Quantum Computing this Friday." },
    { message: "🔬 Research Grant Applications are now open. Apply before April 15." },
    { message: "📅 Exam Schedule Released: Check the portal for details." },
    { message: "📌 Library Closed This Saturday for maintenance. Plan accordingly!" },
    { message: "🎭 Cultural Fest Registrations Open! Sign up for events now." },
    { message: "🎯 Coding Competition: Participate in the upcoming Hackathon." },
    { message: "💡 Tech Talk: AI & Ethics discussion happening in Seminar Hall 2 today." },
    { message: "🌟 Student Spotlight: Congratulations to John Doe for securing a research fellowship at MIT!" },
    { message: "🏆 Sports Tournament: Chess and Badminton registrations open." },
    { message: "📖 Study Group: Join the new study group for Data Structures & Algorithms." },
    { message: "🛑 Lost & Found: A blue backpack was found near the library entrance. Contact the help desk." },
    { message: "💬 Faculty Office Hours Updated: Check the portal for new timings." },
    { message: "🎊 Free Library Membership Extension for top academic performers!" }
  ];
  

const HomeBoxes = () => {
  const [newsIndex, setNewsIndex] = useState(0);
  const [notificationIndex, setNotificationIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setNewsIndex((prev) => (prev + 1) % (sampleNews.length - 2)); // Ensuring 3 items are always visible
      setNotificationIndex((prev) => (prev + 1) % (sampleNotifications.length - 2));
    }, 5000); // Slower transition for smoothness
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-boxes">
      {/* News Section */}
      <motion.div className="home-box news-box">
        <h3>📢 News</h3>
        <div className="news-list">
          <AnimatePresence mode="popLayout">
            {sampleNews.slice(newsIndex, newsIndex + 3).map((news, index) => (
              <motion.div
                key={`${news.title}-${index}`}
                className="news-item"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                layout
                transition={{ duration: 1, ease: "easeInOut" }} // Smoother transition
              >
                <h4>{news.title}</h4>
                <p>{news.content}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Notifications Section */}
      <motion.div className="home-box notifications-box">
        <h3>🔔 Notifications</h3>
        <div className="notifications-list">
          <AnimatePresence mode="popLayout">
            {sampleNotifications.slice(notificationIndex, notificationIndex + 3).map((notification, index) => (
              <motion.p
                key={`${notification.message}-${index}`}
                className="notification-item"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                layout
                transition={{ duration: 1, ease: "easeInOut" }} // Smoother transition
              >
                {notification.message}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default HomeBoxes;
