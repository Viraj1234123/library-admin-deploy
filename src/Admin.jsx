import React, { useEffect, useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPause, faPlay, faHome, faBook, faChair, faUserPlus, faIdCard, faSignOutAlt, faStar, faBars , faComments, faNewspaper, faUniversity, faChevronUp, faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import './Admin.css';
import axios from 'axios';
import Complaints from "./Complaints";
import SeatBooking from "./AdminSeatBooking";
import Article from "./Article";
import ArticleManagement from "./ArticleManagement"
import Modal from 'react-modal'
import HomeBoxes from './HomeBoxes';
import UserIcon from './UserIcon';
import Announcements from "./Announcements";
Modal.setAppElement('#root'); // Or the ID of your root element

const Admin = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  // Add these near your other state declarations
const [selectedRoom, setSelectedRoom] = useState(null);
const [pausedSeats, setPausedSeats] = useState([]);
const [pauseForm, setPauseForm] = useState({
  seatId: '',
  fromTime: '',
  toTime: '',
  reason: ''
});
const [pauseModalData, setPauseModalData] = useState({
  type: '', // 'seat' or 'room'
  id: null, // seatId or room name
  fromTime: '',
  toTime: '',
  reason: '',
  isAvailable: true // Add this field
});
  const sectionEmojis = {
    home: '🏠',
    books: '📚',
    seats: '💺',
    students: '🎓',
    bookIssues: '📖',
    articles: '📰',
    'article-management': '✏️',
    complaints: '💬',
    'seat-booking': '🪑'
  };
  const [pausedRooms, setPausedRooms] = useState([]);
const [roomPauseModalIsOpen, setRoomPauseModalIsOpen] = useState(false);
const [roomPauseForm, setRoomPauseForm] = useState({
  room: '',
  fromTime: '',
  toTime: '',
  reason: ''
});
  const getIconForSection = (section) => {
    switch(section) {
      case 'home': return faHome;
      case 'books': return faBook;
      case 'seats': return faChair;
      case 'students': return faUserPlus;
      case 'bookIssues': return faBook;
      case 'articles': return faNewspaper;
      case 'article-management': return faNewspaper;
      case 'complaints': return faComments;
      case 'seat-booking': return faChair;
      default: return faHome;
    }
  };
  
  // Hardcoded current user for rating demonstration
  const currentUser = "admin";

  const [adminDetails, setAdminDetails] = useState({ username: '', email: '' });

  useEffect(() => {
    // Fetch admin details from the API when the component mounts
    axios.get(`${import.meta.env.VITE_API_BASE_URL}admins/current-admin`, { withCredentials: true })
      .then((response) => {
        const current_admin = response.data.data;
        setAdminDetails({ username: current_admin.username, email: current_admin.email });
      })
      .catch((error) => {
        console.error('Error fetching admin details:', error);
      });
  }, []);

  const [books, setBooks] = useState([]);  // Initialize as empty array

  useEffect(() => {
    // Fetch books data from the API when the component mounts
    axios.get(`${import.meta.env.VITE_API_BASE_URL}books/get-all-books`, { withCredentials: true }) // Replace with your API URL
      .then((response) => {
        setBooks(response.data.data);  // Set the fetched data to the state
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
      });
  }, []); 

  const [searchQuery, setSearchQuery] = useState("");
  const [bookModalIsOpen, setBookModalIsOpen] = useState(false);
  const [editBookId, setEditBookId] = useState(null);
  const [bookForm, setBookForm] = useState({ 
    title: '', 
    author: '', 
    subject: '', 
    coSubject: '', 
    total_copies: '', 
    available_copies: '', 
    description: '', 
    coverImage: '' 
  });
  
  const [seatModalIsOpen, setSeatModalIsOpen] = useState(false);
  const [editSeatId, setEditSeatId] = useState(null);
  const [seatForm, setSeatForm] = useState({
    seatType: 'cubicle',
  seatNumber: '',
  floor: 1,
  room: 'A',
  coordinates: {
    x: 0,
    y: 0
  }
  });
  const handleAddBook = () => {
    setEditBookId(null);
    setBookForm({
      title: '',
      author: '',
      subject: '',
      coSubject: '',
      total_copies: '',
      available_copies: '',
      description: '',
      coverImage: ''
    });
    setBookModalIsOpen(true);
  };
  
  const handleEditBook = (bookId) => {
    const bookToEdit = books.find(book => book._id === bookId);
    if (bookToEdit) {
      setEditBookId(bookId);
      setBookForm({
        title: bookToEdit.title,
        author: bookToEdit.author,
        subject: bookToEdit.subject,
        coSubject: bookToEdit.coSubject,
        total_copies: bookToEdit.total_copies,
        available_copies: bookToEdit.available_copies,
        description: bookToEdit.description,
        coverImage: bookToEdit.coverImage
      });
      setBookModalIsOpen(true);
    }
  };
  
  const handleBookSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editBookId) {
        const response = await axios.patch(
          `${import.meta.env.VITE_API_BASE_URL}books/${editBookId}`, 
          bookForm, 
          { withCredentials: true }
        );
        if (!response.data.success) throw new Error("Failed to update book.");
        alert("Book updated successfully!");
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}books/`, 
          bookForm, 
          { withCredentials: true }
        );
        if (!response.data.success) throw new Error("Failed to add book.");
        alert("Book added successfully!");
      }
      
      const booksResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}books/get-all-books`, 
        { withCredentials: true }
      );
      setBooks(booksResponse.data.data);
      setBookModalIsOpen(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Error processing request.");
    }
  };
  const handleClickOutside = (event) => {
    if (!event.target.closest(".profile-dropdown") && !event.target.closest(".user-icon")) {
      setActiveSection(null); // Close the user details only when clicking outside
    }
  };

  // const handleAddBook = async () => {
  //   const title = prompt("Enter book title:", "");
  //   const author = prompt("Enter author:", "");
  //   const subject = prompt("Enter subject for the new book:", "");
  //   const coSubject = prompt("Enter co-subject:", "");
  //   const total_copies = prompt("Enter total quantity for the new book:", "");
  //   const available_copies = prompt("Enter available quantity for the new book:", "");
  //   const description = prompt("Enter a description for the book");
  //   const coverImage = prompt("Enter image URL for the new book:", "");
  
  //   // Validate if title, author, and ISBN are provided
  //   if (title && author && subject && coSubject && total_copies && available_copies && description && coverImage) {
  //     const newBook = {
  //       title,
  //       author,
  //       subject,
  //       coSubject,
  //       total_copies,
  //       available_copies,
  //       description,
  //       coverImage
  //     };
  
  //     try {
  //       // Send POST request to API to create a new book
  //       const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}books/`, newBook, {withCredentials: true})
  //       if (response.data.statusCode!=201 && response.data.statusCode!=200) {
  //         throw new Error("Failed to add the book.");
  //       }
  
  //       // Parse the response to get the new book
  //       const addedBook = await response.data.data
  //       alert("Book added successfully!");
        
  //       // Optionally update the UI with the new book (if necessary)
  //       setBooks((prevBooks) => [...prevBooks, addedBook]);
  
  //     } catch (error) {
  //       console.error("Error adding book:", error);
  //       alert("There was an error adding the book.");
  //     }
  //   } else {
  //     alert("Please provide all required details for the book.");
  //   }
  // };
  
  const handleDeleteBook = async (bookId) => {
    try {
      // Ask for confirmation
      const isConfirmed = window.confirm("Are you sure you want to delete this book?");
      if (!isConfirmed) return; // Exit if the user cancels
  
      // Send DELETE request to API to delete the book
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}books/${bookId}`,
        { withCredentials: true }
      );
  
      if (!response.data.success) {
        throw new Error("Failed to delete the book.");
      }
  
      alert("Book deleted successfully!");
  
      // Fetch updated book list
      await axios
        .get(`${import.meta.env.VITE_API_BASE_URL}books/get-all-books`, { withCredentials: true })
        .then((response) => {
          setBooks(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching books:", error);
        });
  
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("There was an error deleting the book.");
    }
  };
  

  // const handleEditBook = async (bookId) => {
  //   const book = await axios.get(`${import.meta.env.VITE_API_BASE_URL}books/get-book/${bookId}`, {withCredentials: true});
  //   const title = prompt("Enter book title:", "");
  //   const author = prompt("Enter author:", "");
  //   const subject = prompt("Enter subject for the new book:", "");
  //   const coSubject = prompt("Enter co-subject:", "");
  //   const total_copies = prompt("Enter total quantity for the new book:", "");
  //   const available_copies = prompt("Enter available quantity for the new book:", "");
  //   const description = prompt("Enter a description for the book");
  //   const coverImage = prompt("Enter image URL for the new book:", "");
  
  //   // Validate if title, author, and ISBN are provided
  //   if (title || author || subject || coSubject || total_copies || available_copies || description || coverImage) {
  //     const editedBook = {
  //       title,
  //       author,
  //       subject,
  //       coSubject,
  //       total_copies,
  //       available_copies,
  //       description,
  //       coverImage
  //     };
  
  //     try {
  //       const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}books/${bookId}`, editedBook, {withCredentials: true})
  //       if (!response.data.success) {
  //         throw new Error("Failed to add the book.");
  //       }
  
  //       // Parse the response to get the new book
  //       const updatedBook = await response.data.data
  //       alert("Book updated successfully!");

  //       await axios.get(`${import.meta.env.VITE_API_BASE_URL}books/get-all-books`, { withCredentials: true })
  //       .then((response) => {
  //         setBooks(response.data.data);
  //       })
  //       .catch((error) => {
  //         console.error('Error fetching books:', error);
  //       });
  
  //     } catch (error) {
  //       console.error("Error updating book:", error);
  //       alert("There was an error updating the book.");
  //     }
  //   } else {
  //     alert("Please provide some details for updating.");
  //   }
  // };

  /* ----------------- Seats Booking & Management (Merged) ----------------- */
  
  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i}:00 - ${i + 1}:00`);

  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookingFilter, setBookingFilter] = useState({timeSlot: "",
    seatType: "",
    room: "",
    floor: "", seatNumber: "",});
  const [seatBookings, setSeatBookings] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  
  
  const [formData, setFormData] = useState({
    seatType: 'cubicle',
    seatNumber: 0,
    floor: 1,
    rollNo: '',
    startTime: 0
  });
  
  const fetchSeats = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}seats/get-all-seats`, { withCredentials: true });
      setSeats(response.data.data);
    } catch (error) {
      console.error("Error fetching seats:", error);
    }
  };
  
  useEffect(() => {
    fetchSeats();
  }, []);
  const fetchSeatBookings = async () => {
    try {
      const now = new Date();
      const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}seat-bookings/`,
        { 
          params: {
            startTime: now.toISOString(),
            endTime: twentyFourHoursLater.toISOString()
          },
          withCredentials: true 
        }
      );
      setSeatBookings(response.data.data);
    } catch (error) {
      console.error("Error fetching seats:", error);
    }
  };
  
  useEffect(() => {
    fetchSeatBookings();
  }, []);
  

  

  
  const handleBookSeat = async () => {
    const now = new Date();
    const currentHour = now.getHours();
    const bookingHour = parseInt(formData.startTime);
    
    // Calculate if the booking is within next 24 hours
    const isWithin24Hours = (bookingHour >= currentHour && bookingHour < currentHour + 24) || 
                           (bookingHour < (currentHour + 24) % 24);
  
    if (!isWithin24Hours) {
      alert("Seats can only be booked for up to 24 hours ahead of the current time.");
      return;
    }
  
    try {
      const bookedSeat = await axios.post(`${import.meta.env.VITE_API_BASE_URL}seat-bookings/book-seat-by-admin`, formData, { withCredentials: true });
      fetchSeats();
      fetchSeatBookings();
      alert(`Seat booked successfully`);
      setSelectedSeat(null);
      setSelectedSlot("");
    } catch (error) {
      alert("Error booking seat.");
      console.error("Error booking seat:", error);
    }
  };
  const getUniqueRooms = () => {
    const rooms = new Set();
    seats.forEach(seat => {
      if (seat.room) {
        rooms.add(seat.room);
      }
    });
    return Array.from(rooms).sort();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };
  const filteredSeats = seats.filter(seat => {
    // Room filter - show only seats in the selected room
    const roomMatch = selectedRoom ? seat.room === selectedRoom : true;
    
    // Other filters (seat type, floor, etc.)
    const seatTypeMatch = !bookingFilter.seatType || 
      seat.seatType.toLowerCase() === bookingFilter.seatType.toLowerCase();
    
    const floorMatch = !bookingFilter.floor || 
      seat.floor === parseInt(bookingFilter.floor);
    
    const seatNumberMatch = !bookingFilter.seatNumber || 
      seat.seatNumber.toString().includes(bookingFilter.seatNumber);
    
    // Roll number filter (only applies if searching by student)
    const rollNoMatch = !bookingFilter.rollNo || 
      seatBookings.some(booking => 
        booking.seatId._id === seat._id && 
        booking.studentId.rollNo.toLowerCase().includes(bookingFilter.rollNo.toLowerCase())
      );
    
    // If time slot is selected, we'll show all seats but indicate booking status in the table
    return (
      roomMatch &&
      seatTypeMatch &&
      floorMatch &&
      seatNumberMatch &&
      (bookingFilter.rollNo ? rollNoMatch : true)
    );
  });
  const filterCurrentBookings = (bookings) => {
    const now = new Date();
    const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    return bookings.filter(booking => {
      const bookingTime = new Date(booking.startTime);
      return bookingTime >= now && bookingTime <= twentyFourHoursLater;
    });
  };
// Calculate pagination based on filtered seats
// Calculate pagination based on filtered seats
const [isExpanded, setIsExpanded] = useState(false);
const seatsPerPage = 10;
const totalPages = Math.ceil(filteredSeats.length / seatsPerPage);
const indexOfLastSeat = currentPage * seatsPerPage;
const indexOfFirstSeat = indexOfLastSeat - seatsPerPage;
const currentSeats = filteredSeats.slice(indexOfFirstSeat, indexOfLastSeat);
  // Logic to handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Calculate total pages
// Calculate total pages based on filtered seats

  
  // Determine the range of page numbers to display (max 5 pages at a time)
  const pageNumbers = [];
  const range = 2; // Show 2 pages before and 2 pages after the current page

  // Function to get unique room names

  // Filter seats based on search input and filters

  // Pagination logic applied to filtered seats

  // const handleAddSeat = async () => {
  //   const seatType = prompt("Enter seat type:");
  //   const seatNumber = prompt("Enter seat number:");
  //   const floor = prompt("Enter floor number:");
  //   if (seatType && seatNumber && floor) {
  //     try {
  //       await axios.post(`${import.meta.env.VITE_API_BASE_URL}seats/`, { seatType, seatNumber, floor }, { withCredentials: true }); 
  //       alert("Seat added successfully!");
  //       fetchSeats();
  //     } catch (error) {
  //       alert("Error adding seat.");
  //       console.error("Error adding seat:", error);
  //     }
  //   }
  //   else {
  //     alert("Please provide all details for adding a seat.");
  //   }
  // };
  
  // const handleEditSeat = async (id) => {
  //   const seatType = prompt("Enter seat type:");
  //   const seatNumber = prompt("Enter seat number:");
  //   const floor = prompt("Enter floor number:");
  
  //   if (seatNumber || seatType || floor) {
  //     try {
  //       await axios.patch(`${import.meta.env.VITE_API_BASE_URL}seats/`, { seatType, seatNumber, floor, id }, { withCredentials: true });
  //       alert("Seat updated successfully!"); 
  //       fetchSeats();
  //     } catch (error) {
  //       alert("Error updating seat.");
  //       console.error("Error editing seat:", error);
  //     }
  //   }
  //   else{
  //     alert("Please provide some details for updating.");
  //   }
  // };
  
  // const handleDeleteSeat = async (id) => {
  //   try {
  //     const isConfirmed = window.confirm("Are you sure you want to delete this seat?");
  //     if (!isConfirmed) return;
      
  //     await axios.delete(`${import.meta.env.VITE_API_BASE_URL}seats/`, {
  //       data: { id },
  //       withCredentials: true,
  //     });
      
  //     alert("Seat deleted successfully!");
  //     fetchSeats();
  //   } catch (error) {
  //     alert("Error deleting seat.");
  //     console.error("Error deleting seat:", error);
  //   }
  // };
  // Add this function if missing
// Update handleDeleteSeat function
const handleDeleteSeat = async (id) => {
  try {
    const isConfirmed = window.confirm("Are you sure you want to delete this seat?");
    if (!isConfirmed) return;
    
    await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}seats/`,
      { 
        data: {id},  // Or whatever property name your API expects
        withCredentials: true 
      }
    );
    
    alert("Seat deleted successfully!");
    fetchSeats();
  } catch (error) {
    console.error("Error deleting seat:", error);
    alert("Error deleting seat.");
  }
};
// Simplified seat availability toggle
const handleToggleSeatAvailability = async (seatId, isAvailable) => {
  try {
    await axios.patch(
      `${import.meta.env.VITE_API_BASE_URL}seats/${seatId}/availability`,
      { isAvailable },
      { withCredentials: true }
    );
    fetchSeats();
    alert(`Seat ${isAvailable ? 'resumed' : 'paused'} successfully!`);
  } catch (error) {
    console.error("Error toggling seat availability:", error);
    alert("Error updating seat availability");
  }
};

// Updated room pause function
const handlePauseRoom = async (room) => {
  try {
    const isConfirmed = window.confirm(`Are you sure you want to ${pausedRooms.some(r => r.room === room) ? 'resume' : 'pause'} Room ${room}?`);
    if (!isConfirmed) return;
    
    if (pausedRooms.some(r => r.room === room)) {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}rooms/resume/${room}`,
        {},
        { withCredentials: true }
      );
    } else {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}seat-bookings/pause-bookings-for-room`,
        {room,},
        { withCredentials: true }
      );
    }
    
    fetchPausedRooms();
    fetchSeats(); // Refresh seat data
  } catch (error) {
    console.error("Error toggling room pause:", error);
    alert("Error updating room status");
  }
};
const fetchPausedRooms = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}seat-bookings/get-upcoming-pause-bookings`,
      { withCredentials: true }
    );
    setPausedRooms(response.data.data);
  } catch (error) {
    console.error("Error fetching paused rooms:", error);
  }
};
  // Update your pagination controls to reset to page 1 when filters change
useEffect(() => {
  setCurrentPage(1);
}, [bookingFilter, selectedRoom]);
  // Add this to your useEffect that runs on component mount
  useEffect(() => {
    fetchPausedRooms();
  }, []);
  const handleAddSeat = () => {
    setEditSeatId(null);
    setSeatForm({
      seatType: 'cubicle',
      seatNumber: '',
      room: '1',
      floor: 1,
      coordinates: {
        x: 0,
        y: 0
      }
  
    });
    setSeatModalIsOpen(true);
  };
  const handleCancelBooking = async (bookingId) => {
    try {
      const isConfirmed = window.confirm("Are you sure you want to cancel this booking?");
      if (!isConfirmed) return;
      
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}seat-bookings/reject-booking`,
        { 
          data: { bookingId: bookingId },  // Or whatever property name your API expects
          withCredentials: true 
        }
      );
      alert("Booking cancelled successfully!");
      fetchSeatBookings();
      fetchSeats();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Error cancelling booking.");
    }
  };
  
// In your Admin.jsx component
const handleSeatPauseSubmit = async (e) => {
  e.preventDefault();
  
  try {
    await axios.patch(
      `${import.meta.env.VITE_API_BASE_URL}seats/`,
      { id : pauseModalData.id,
        isAvailable: !pauseModalData.isAvailable,
        
      },
      { withCredentials: true }
    );
    alert(`Seat successfully ${pauseModalData.isAvailable ? 'paused' : 'resumed'}.`);
    fetchSeats();
    setPauseModalData({ type: '', id: null });
  } catch (error) {
    console.error("Error toggling seat availability:", error);
    alert("Error processing the request");
  }
};

// Keep the original room pause handler
const handleRoomPauseSubmit = async (e) => {
  e.preventDefault();
  try {
    const fromTime = new Date(pauseModalData.fromTime).toISOString();
    const toTime = new Date(pauseModalData.toTime).toISOString();
    
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}seat-bookings/pause-bookings-for-room`,
      {
        room: pauseModalData.id,
        startTime: fromTime,
        endTime: toTime,
        reason: pauseModalData.reason
      },
      { withCredentials: true }
    );
    alert(`Room ${pauseModalData.id} successfully paused.`);
    setPauseModalData({ type: '', id: null });
    fetchPausedRooms();
    fetchSeats(); // Refresh seat data
  } catch (error) {
    console.error("Error pausing room:", error);
    alert("Error pausing room.");
  }
};

const handleResumeRoom = async (pauseId) => {
  try {
    const isConfirmed = window.confirm("Are you sure you want to resume this room pause?");
    if (!isConfirmed) return;
    
    await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}seat-bookings/resume-bookings-for-room/${pauseId}`,
      { withCredentials: true }
    );
    
    alert("Room pause resumed successfully!");
    fetchPausedRooms();
    fetchSeats();
  } catch (error) {
    console.error("Error resuming room pause:", error);
    alert("Error resuming room pause.");
  }
};

const handlePauseSubmit = async (e) => {
  e.preventDefault();
  

  try {
    const fromTime = new Date(pauseModalData.fromTime).toISOString();
    const toTime = new Date(pauseModalData.toTime).toISOString();
    console.log(pauseModalData.fromTime);
    
    if (pauseModalData.type === 'seat') {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}seats/change-seat-availability-for-room`,
        {
          seatId: pauseModalData.id,
          startTime: fromTime,
          endTime: toTime,
          reason: pauseModalData.reason,
          isAvailable: !pauseModalData.isAvailable
        },
        { withCredentials: true }
      );
      toast.success(`Seat ${pauseModalData.id} successfully ${pauseModalData.isAvailable ? 'paused' : 'resumed'}.`);
    } else if (pauseModalData.type === 'room') {
      console.log(new Date());
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}seat-bookings/pause-bookings-for-room`,
        {
          room: pauseModalData.id,
          startTime: fromTime,
          endTime: toTime,
          reason: pauseModalData.reason
        },
        { withCredentials: true }
      );
      toast.success(`Room ${pauseModalData.id} successfully paused.`);
    }
  } catch (error) {
    console.error("Error submitting pause:", error);
    alert("Error processing the pause request");
  }
};

// Update handleEditSeat function
const handleEditSeat = (seatId) => {
  const seatToEdit = seats.find(seat => seat._id === seatId);
  if (seatToEdit) {
    setEditSeatId(seatId);
    setSeatForm({
      seatType: seatToEdit.seatType,
      seatNumber: seatToEdit.seatNumber,
      floor: seatToEdit.floor,
      room: seatToEdit.room,
      coordinates: seatToEdit.coordinates || { x: 0, y: 0 }
    });
    setSeatModalIsOpen(true);
  }
};
  
 // Update the handleSeatSubmit function
const handleSeatSubmit = async (e) => {
  e.preventDefault();
  try {
    const seatData = {
      seatType: seatForm.seatType,
      seatNumber: seatForm.seatNumber,
      floor: seatForm.floor,
      room: seatForm.room,
      coordinates: seatForm.coordinates
    };

    if (editSeatId) {
      // For updating existing seat
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}seats/${editSeatId}`, 
        seatData, 
        { withCredentials: true }
      );
      alert("Seat updated successfully!");
    } else {
      // For creating new seat
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}seats`, 
        seatData, 
        { withCredentials: true }
      );
      alert("Seat added successfully!");
    }
    
    fetchSeats(); // Refresh the seats list
    setSeatModalIsOpen(false); // Close the modal
  } catch (error) {
    console.error("Error processing seat request:", error);
    alert(`Error: ${error.response?.data?.message || "Failed to process seat request"}`);
  }
};

  /* ----------------- Student Registrations & Approvals ----------------- */
  const [pendingStudents, setPendingStudents] = useState([]);
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    rollNo: '',
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
    gender: 'M',
    phoneNumber: '',
    department: '',
    degree: ''
  });

  useEffect(() => {
    // Fetch admin details from the API when the component mounts
    axios.get(`${import.meta.env.VITE_API_BASE_URL}admins/pending-student-registration-requests`, { withCredentials: true })
      .then((response) => {
        const pendingStudentRequests = response.data.data;
        setPendingStudents(pendingStudentRequests);
      })
      .catch((error) => {
        console.error('Error fetching pending student requests:', error);
      });
  }, []);

  const handleStudentRegistration = async (e) => {
    e.preventDefault();
  
    if (!newStudent.rollNo) {
      alert("Student ID is required.");
      return;
    }
  
    if (!newStudent.name) {
      alert("Name is required.");
      return;
    }
  
    if (!newStudent.email) {
      alert("Email is required.");
      return;
    }
  
    if (!newStudent.password) {
      alert("Password is required.");
      return;
    }
  
    if (!newStudent.dateOfBirth) {
      alert("Date of Birth is required.");
      return;
    }
  
    if (!newStudent.gender) {
      alert("Gender is required.");
      return;
    }
  
    if (!newStudent.phoneNumber || !/^\d{10}$/.test(newStudent.phoneNumber)) {
      alert("Phone Number is required and should be 10 digits.");
      return;
    }
  
    if (!newStudent.department) {
      alert("Department is required.");
      return;
    }
  
    if (!newStudent.degree) {
      alert("Degree is required.");
      return;
    }
  
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(newStudent.email)) {
      alert("Please enter a valid email address.");
      return;
    }
  
    if (newStudent.password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
  
    const newStudentData = {
      ...newStudent
    };
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}students/register`, newStudentData, {withCredentials: true});
  
      if (response.status === 200) {
        setPendingStudents([...pendingStudents, newStudentData]);
        setNewStudent({
          studentId: '',
          name: '',
          email: '',
          password: '',
          dateOfBirth: '',
          gender: 'M',
          phoneNumber: '',
          department: '',
          degree: ''
        });
        alert('Student registration submitted for approval!');
      } else {
        alert('Error in registering the student. Please try again.');
      }
    } catch (error) {
      console.error('Error registering student:', error);
      alert('An error occurred while registering the student. Please try again.');
    }
  };

  const handleAcceptStudent = async (studentId) => {
    try {
        const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}admins/approve-student-registration`, {studentId}, {withCredentials: true});
        if (!response.data.success) {
          throw new Error("Failed to approve student.");
        }
  
        // Parse the response to get the new book
        const approvedStudent = await response.data.data
        alert("student approved successfully!");

        axios.get(`${import.meta.env.VITE_API_BASE_URL}admins/pending-student-registration-requests`, { withCredentials: true })
      .then((response) => {
        const pendingStudentRequests = response.data.data;
        setPendingStudents(pendingStudentRequests);
      })
      .catch((error) => {
        console.error('Error fetching pending student requests:', error);
      });
  
      } catch (error) {
        console.error("Error approving request:", error);
        alert("There was an error while approving the student registration.");
      }
  };

  const handleRejectStudent = async (studentId) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}admins/reject-student-registration/${studentId}`, {withCredentials: true});
      if (!response.data.success) {
        throw new Error("Failed to reject student registration.");
      }

      // Parse the response to get the new book
      const approvedStudent = await response.data.data
      alert("student registration rejected successfully!");

      axios.get(`${import.meta.env.VITE_API_BASE_URL}admins/pending-student-registration-requests`, { withCredentials: true })
    .then((response) => {
      const pendingStudentRequests = response.data.data;
      setPendingStudents(pendingStudentRequests);
    })
    .catch((error) => {
      console.error('Error fetching pending student requests:', error);
    });

    } catch (error) {
      console.error("Error rejecting registration request:", error);
      alert("There was an error while rejecting the student registration.");
    }
  };

  /* ----------------- Book Issue Requests & Issued Books (Merged) ----------------- */
  const [bookIssueRequests, setBookIssueRequests] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);

  useEffect(() => {
    // Fetch admin details from the API when the component mounts
    axios.get(`${import.meta.env.VITE_API_BASE_URL}issue-books/get-all-details`, { withCredentials: true })
      .then((response) => {
        const bookIssues = response.data.data
        setBookIssueRequests(bookIssues);
      })
      .catch((error) => {
        console.error('Error fetching book issue requests:', error);
      });
  }, []);
  useEffect(() => {
    if (bookModalIsOpen) {
      document.getElementById("bookModalTitle")?.focus();
    }
  }, [bookModalIsOpen]);
  
  useEffect(() => {
    if (seatModalIsOpen) {
      document.getElementById("seatModalTitle")?.focus();
    }
  }, [seatModalIsOpen]);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setBookModalIsOpen(false);
        setSeatModalIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
    
  const handleAcceptBookRequest = async (bookbookingId) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}issue-books/approve-book-issue`, {bookbookingId}, {withCredentials: true});
      if (!response.data.success) {
        throw new Error("Failed to issue book.");
      }

      const issuedBookDetails = response.data.data;
      alert('Book issued successfully');

      await axios.get(`${import.meta.env.VITE_API_BASE_URL}issue-books/get-all-details`, { withCredentials: true })
      .then((response) => {
        const bookIssues = response.data.data
        setBookIssueRequests(bookIssues);
      })
      .catch((error) => {
        console.error('Error fetching book issue requests:', error);
      });

    } catch (error) {
      console.error("Error issuing book:", error);
      alert("There was an error while issuing the book");
    }
  };

  const handleRejectBookRequest = async (bookbookingId) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}issue-books/reject-book-issue/${bookbookingId}`, {withCredentials: true});
      if (!response.data.success) {
        throw new Error("Failed to reject request.");
      }

      alert('Book issue rejected successfully');

      await axios.get(`${import.meta.env.VITE_API_BASE_URL}issue-books/get-all-details`, { withCredentials: true })
      .then((response) => {
        const bookIssues = response.data.data
        setBookIssueRequests(bookIssues);
      })
      .catch((error) => {
        console.error('Error fetching book issue requests:', error);
      });

    } catch (error) {
      console.error("Error rejecting:", error);
      alert("There was an error while rejecting the book issue request.");
    }
  };

  const [issuedFilter, setIssuedFilter] = useState({ query: '' });
  const mergedBookIssues = [
    ...bookIssueRequests.map(r => ({ ...r, status: 'booked' })),
    ...issuedBooks.map(r => ({ ...r, status: 'issued' }))
  ];
  const filteredMergedBookIssues = mergedBookIssues.filter(ib => 
    ib.studentId.rollNo.includes(issuedFilter.query) ||
    ib.bookId.toString().includes(issuedFilter.query) ||
    (ib.studentName && ib.studentName.toLowerCase().includes(issuedFilter.query.toLowerCase()))
  );

  /* ----------------- Logout ----------------- */
  const handleLogout = async () => {
    try{
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}admins/logout`,{}, { withCredentials: true });
      if(!res.data.success){
        throw new error('Error logging out');
      }
      alert('Logged out');
      navigate('/');
    }
    catch(err){
      alert('Error logging out');
      console.error(err);
    }
    
  };

  /* ----------------- Render ----------------- */
  return (
    
    <div className="admin-page" inert={bookModalIsOpen || seatModalIsOpen}>
      {sidebarVisible ? (
  <div className="sidebar">
    <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1rem' }}>
      <FontAwesomeIcon 
        icon={faBars} 
        size="xl" 
        onClick={() => setSidebarVisible(false)}
        style={{ cursor: 'pointer', marginRight: '1rem' }}
      />
      <h2 className="sidebar-title" style={{ margin: 0 }}>Admin Panel</h2>
    </div>
    <ul className="nav flex-column">
      <li className="nav-item">
        <button className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
          onClick={() => setActiveSection('home')}>
          🏠 Home
        </button>
      </li>
      <li className="nav-item">
        <button className={`nav-link ${activeSection === 'books' ? 'active' : ''}`}
          onClick={() => setActiveSection('books')}>
          📖 Books
        </button>
      </li>
      <li className="nav-item">
        <button className={`nav-link ${activeSection === 'seats' ? 'active' : ''}`}
          onClick={() => setActiveSection('seats')}>
          💺 Seats Management
        </button>
      </li>
      <li className="nav-item">
        <button className={`nav-link ${activeSection === 'students' ? 'active' : ''}`}
          onClick={() => setActiveSection('students')}>
          🎓 Registrations
        </button>
      </li>
      <li className="nav-item">
  <button className={`nav-link ${activeSection === 'announcements' ? 'active' : ''}`}
    onClick={() => setActiveSection('announcements')}>
    📢 Announcements
  </button>
</li>
      <li className="nav-item">
        <button className={`nav-link ${activeSection === 'bookIssues' ? 'active' : ''}`}
          onClick={() => setActiveSection('bookIssues')}>
          📚 Book Issues
        </button>
      </li>
      <li className="nav-item">
        <button className={`nav-link ${activeSection === 'articles' ? 'active' : ''}`}
          onClick={() => setActiveSection('articles')}>
          📰 Articles Requests
        </button>
      </li>
      <li className="nav-item">
        <button className={`nav-link ${activeSection === 'article-management' ? 'active' : ''}`}
          onClick={() => setActiveSection('article-management')}>
          ✏️ Article Management
        </button>
      </li>
      <li className="nav-item">
        <button className={`nav-link ${activeSection === 'complaints' ? 'active' : ''}`}
          onClick={() => setActiveSection('complaints')}>
          💬 Complaints
        </button>
      </li>
    </ul>
    <button className="logout-btn" onClick={handleLogout}>
      <FontAwesomeIcon icon={faSignOutAlt} /> Logout
    </button>
  </div>
) : (
  <div className="sidebar-minimized">
    <div className="sidebar-toggle" onClick={() => setSidebarVisible(true)}>
      <FontAwesomeIcon icon={faBars} size="xl" style={{
        marginTop: '23px',
        marginLeft: '10px', 
        marginBottom: '15px'    // Slight right shift of the icon within button
      }} />
    </div>
    <ul className="nav flex-column">
    <li className="nav-item">
        <button className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
          onClick={() => setActiveSection('home')}>
          🏠
        </button>
      </li>
      <li className="nav-item">
        <button className={`nav-link ${activeSection === 'books' ? 'active' : ''}`}
          onClick={() => setActiveSection('books')}>
          📖
        </button>
      </li>
      <li className="nav-item">
        <button className={`nav-link ${activeSection === 'seats' ? 'active' : ''}`}
          onClick={() => setActiveSection('seats')}>
          💺
        </button>
      </li>
      <li className="nav-item">
        <button className={`nav-link ${activeSection === 'students' ? 'active' : ''}`}
          onClick={() => setActiveSection('students')}>
          🎓
        </button>
      </li>
      <li className="nav-item">
  <button className={`nav-link ${activeSection === 'announcements' ? 'active' : ''}`}
    onClick={() => setActiveSection('announcements')}>
    📢
  </button>
</li>
      <li className="nav-item">
        <button className={`nav-link ${activeSection === 'bookIssues' ? 'active' : ''}`}
          onClick={() => setActiveSection('bookIssues')}>
          📚
        </button>
      </li>
      <li className="nav-item">
        <button className={`nav-link ${activeSection === 'articles' ? 'active' : ''}`}
          onClick={() => setActiveSection('articles')}>
          📰
        </button>
      </li>
      <li className="nav-item">
        <button className={`nav-link ${activeSection === 'article-management' ? 'active' : ''}`}
          onClick={() => setActiveSection('article-management')}>
          ✏️
        </button>
      </li>
      <li className="nav-item">
        <button className={`nav-link ${activeSection === 'complaints' ? 'active' : ''}`}
          onClick={() => setActiveSection('complaints')}>
          💬
        </button>
      </li>
    </ul>
    <button className="logout-btn" onClick={handleLogout}>
      <FontAwesomeIcon icon={faSignOutAlt} />
    </button>
  </div>
)}

<UserIcon 
  setActiveSection={setActiveSection}
  activeSection={activeSection}
  userName={adminDetails.username}
  userEmail={adminDetails.email}
/>

{!sidebarVisible && (
  <div 
    className="sidebar-toggle" 
    onClick={() => setSidebarVisible(true)} 
    style={{ 
      position: 'fixed', 
      top: '20px', 
      left: '10px', 
      cursor: 'pointer',
      zIndex: 1000
    }}
  >

  </div>
)}

      <div className="content">
        {activeSection === 'home' && (
          <div 
            className="home-section"
            style={{
              backgroundImage: "url('/iitropar3.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              width: '100%',
              height: '100%',
              minHeight: '100%',
              padding: '2rem',
              color: '#fff',
              borderRadius: '10px'
            }}
          >
<h2 className="dashboard-heading">
  <FontAwesomeIcon icon={faUniversity} className="dashboard-icon" />
  Library Administration Dashboard
</h2>


<p style={{
  fontSize: '1.1rem',
  color: '#f5f5f5',
  textAlign: 'center',
  maxWidth: '600px', /* Limit width for readability */
  margin: '0 auto', /* Center align */
  lineHeight: '1.5'
}}>
  Welcome to your centralized control panel for managing books, seat bookings, and student registrations.
</p>

            <HomeBoxes />

          </div>
        )}

        {activeSection === 'books' && (
          <div className="books-section">
            <h3>📚 Books Management</h3>

            <div className="mb-3 d-flex align-items-center">
            <button className="btn btn-primary" onClick={handleAddBook}>Add Book</button>
              <input 
                type="text" 
                placeholder="Search Books..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control ml-3"
                style={{ maxWidth: '300px' }}
              />
            </div>
            <div className="books-container">
  {books
    .filter((book) => 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((book) => {
      const availableQuantity = book.available_copies;

      return (
        <div key={book.id} className="book-card">
          <div className="card h-100">
            <img 
              src={book.coverImage} 
              className="card-img-top" 
              alt={book.title} 
            />
            <div className="card-body">
              <h5 className="card-title">{book.title}</h5>
              <p className="card-text"><strong>Author:</strong> {book.author}</p>
              <p className="card-text"><strong>Subject:</strong> {book.subject}</p>
              <p className="card-text"><strong>Co-Subject:</strong> {book.coSubject}</p>
              <p className="card-text"><strong>Total Quantity:</strong> {book.total_copies}</p>
              <p className="card-text"><strong>Available:</strong> {availableQuantity}</p>
              
              {/* Overall Rating */}
              <div style={{ marginBottom: '10px' }}>
                <strong>Overall Rating: </strong>
                {book.rating ? parseFloat(book.rating).toFixed(2) : "N/A"}
              </div>
            </div>
            <div className="card-footer">
              <button className="btn btn-secondary btn-sm mr-2" onClick={() => handleEditBook(book._id)}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteBook(book._id)}>Delete</button>
            </div>
          </div>
        </div>
      );
    })}
</div>
          </div>
        )}
{activeSection === 'seats' && (
  <div className="seats-section">
    <h3>📖 Seats Management & Availability</h3>

    {/* Room Filter Buttons - Default to Room 1 */}
    <div className="mb-3 d-flex flex-wrap align-items-center gap-2">
    {getUniqueRooms().map(room => {
    const roomPauses = pausedRooms.filter(r => r.room === room);
    const hasActivePauses = roomPauses.length > 0;
    
    return (
      <div key={room} className="d-flex flex-column gap-1">
        <div className="d-flex align-items-center gap-1">
          <button 
            className={`btn ${selectedRoom === room ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSelectedRoom(room)}
          >
            Room {room}
          </button>
          <button 
            className="btn btn-warning btn-sm"
            onClick={() => setPauseModalData({
              type: 'room',
              id: room,
              fromTime: '',
              toTime: '',
              reason: ''
            })}
            title="Pause Room"
          >
            <FontAwesomeIcon icon={faPause} />
          </button>
        </div>
        
        {/* Show active pauses for this room */}
        {hasActivePauses && (
          <div className="p-2 border rounded mt-1">
          <div 
            className="d-flex justify-content-between align-items-center" 
            style={{ cursor: 'pointer' }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <small className="text-muted">Active Pauses ({roomPauses.length})</small>
            <FontAwesomeIcon 
              icon={isExpanded ? faChevronUp : faChevronDown} 
              size="xs"
            />
          </div>
          
          {isExpanded && roomPauses.map(pause => (
            <div key={pause._id} className="d-flex justify-content-between align-items-center mt-2 ps-2">
              <span className="small">
                {new Date(pause.pauseStartTime).toLocaleString()} - {new Date(pause.pauseEndTime).toLocaleString()}
                {pause.reason && (
                  <span className="d-block text-muted"><small>Reason: {pause.reason}</small></span>
                )}
              </span>
              <button 
                className="btn btn-success btn-sm"
                onClick={() => handleResumeRoom(pause._id)}
                title="Resume Room"
              >
                <FontAwesomeIcon icon={faPlay} size="xs" />
              </button>
            </div>
          ))}
        </div>
        )}
      </div>
    );
  })}
    </div>

    {/* Filters */}
    <div className="mb-4 p-3 border rounded">
      <h5>Filter Seats</h5>
      <div className="row">
       {/* Time Slot Filter - Updated to show availability */}
    <div className="col-md-6">
    <div className="form-group mb-3">
  <label htmlFor="filterTimeSlot">Time Slot</label>
  <select
    id="filterTimeSlot"
    className="form-control"
    value={bookingFilter.timeSlot}
    onChange={(e) => setBookingFilter({ ...bookingFilter, timeSlot: e.target.value })}
  >
    <option value="">All Time Slots</option>
    {Array.from({ length: 24 }, (_, i) => {
      const now = new Date();
      const currentHour = now.getHours();
      const startHour = (currentHour + i) % 24;
      const endHour = (startHour + 1) % 24;
      
      // Format the time display (handles overnight)
      const startDisplay = `${startHour.toString().padStart(2, '0')}:00`;
      const endDisplay = endHour === 0 ? '24:00' : `${endHour.toString().padStart(2, '0')}:00`;
      
      return (
        <option key={i} value={startHour}>
          {`${startDisplay}-${endDisplay}`}
        </option>
      );
    })}
  </select>
</div>
    </div>
        {/* Seat Type Filter */}
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label htmlFor="filterSeatType">Seat Type</label>
            <select
              id="filterSeatType"
              className="form-control"
              value={bookingFilter.seatType}
              onChange={(e) => setBookingFilter({ ...bookingFilter, seatType: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="cubicle">Cubicle</option>
              <option value="seat">Seat</option>
              <option value="GDTable">GD Table</option>
              <option value="technobooth">Technobooth</option>
            </select>
          </div>
        </div>

        {/* Floor Filter */}
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label htmlFor="filterFloor">Floor</label>
            <select
              id="filterFloor"
              className="form-control"
              value={bookingFilter.floor}
              onChange={(e) => setBookingFilter({ ...bookingFilter, floor: e.target.value })}
            >
              <option value="">All Floors</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>
        </div>

        {/* Seat Number Filter */}
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label htmlFor="filterSeatNumber">Seat Number</label>
            <input
              id="filterSeatNumber"
              type="text"
              className="form-control"
              value={bookingFilter.seatNumber}
              onChange={(e) => setBookingFilter({ ...bookingFilter, seatNumber: e.target.value })}
              placeholder="Enter seat number"
            />
          </div>
        </div>

        {/* Roll Number Filter - Fixed to work properly */}
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label htmlFor="filterRollNo">Student Roll No</label>
            <input
              id="filterRollNo"
              type="text"
              className="form-control"
              value={bookingFilter.rollNo}
              onChange={(e) => setBookingFilter({ ...bookingFilter, rollNo: e.target.value })}
              placeholder="Enter student roll number"
            />
          </div>
        </div>
      </div>
    </div>
              
    {/* Action Buttons */}
    <div className="mb-3">
      <button className="btn btn-primary me-2" onClick={handleAddSeat}>
        Add Seat
      </button>
      <button 
        className="btn btn-secondary" 
        onClick={() => {
          setBookingFilter({
            timeSlot: "",
            seatType: "",
            floor: "", 
            seatNumber: "",
            rollNo: ""
          });
          // Reset to Room 1 when clearing filters
        }}
      >
        Clear Filters
      </button>
    </div>

    {/* Seats Table */}
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Seat Number</th>
          <th>Type</th>
          <th>Floor</th>
          <th>Booked By (Roll No)</th>
          <th>Time Slot</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  {filteredSeats
    .slice(indexOfFirstSeat, indexOfLastSeat)
    .map(seat => {
      // Get all bookings for this seat
      const allBookingsForSeat = seatBookings.filter(
        booking => booking.seatId._id === seat._id
      );
      
      // Filter to only show current+24h bookings
      const currentBookingsForSeat = filterCurrentBookings(allBookingsForSeat);
      
      // Get current booking if time slot is filtered
      const currentBooking = bookingFilter.timeSlot 
        ? currentBookingsForSeat.find(booking => {
            const bookingHour = new Date(booking.startTime).getHours();
            return bookingHour === parseInt(bookingFilter.timeSlot);
          })
        : null;

      return (
        <tr key={seat._id} className={!seat.isAvailable ? "table-warning" : ""}>
          <td>{seat.seatNumber}</td>
          <td>{seat.seatType}</td>
          <td>{seat.floor}</td>
          
          <td>
            {currentBooking?.studentId?.rollNo || '-'}
          </td>
          
          <td>
          {bookingFilter.timeSlot ? (
    `${parseInt(bookingFilter.timeSlot)}:00-${(parseInt(bookingFilter.timeSlot) + 1) % 24}:00`
  ) : (
    currentBookingsForSeat.length > 0 ? 'Multiple bookings' : 'Available'
  )}
          </td>
          
          <td>
            {!seat.isAvailable ? (
              <span className="badge bg-warning text-dark">Paused</span>
            ) : currentBooking ? (
              <span className="badge bg-danger">Booked</span>
            ) : (
              <span className="badge bg-success">Available</span>
            )}
          </td>
          
          <td>
            <div className="d-flex gap-2">
              {currentBooking ? (
                <button 
                  className="btn btn-sm btn-danger"
                  onClick={() => handleCancelBooking(currentBooking._id)}
                >
                  Cancel Booking
                </button>
              ) : (
                <>
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => handleEditSeat(seat._id)}
                  >
                    Edit
                  </button>
                  <button 
  className="btn btn-sm btn-warning"
  onClick={() => setPauseModalData({
    type: 'seat',
    id: seat._id,
    reason: '',
    isAvailable: seat.isAvailable
  })}
>
  {seat.isAvailable ? 'Pause' : 'Resume'}
</button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteSeat(seat._id)}
                    
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </td>
        </tr>
      );
    })}
</tbody>
    </table>
       
    {/* Pagination Controls */}
    <nav>
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
        </li>
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          return (
            <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? "active" : ""}`}>
              <button className="page-link" onClick={() => paginate(pageNumber)}>
                {pageNumber}
              </button>
            </li>
          );
        })}
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  </div>
)}

        {activeSection === 'students' && (
          <div className="students-section">
            <h3>🎓 Student Registrations</h3>
            <form onSubmit={handleStudentRegistration} className="mb-4">
                <div className="form-group mb-3">
                  <label htmlFor="studentId" className="form-label">Student Roll Number</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="studentId" 
                    value={newStudent.rollNo} 
                    onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
                    required 
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="name" 
                    value={newStudent.name} 
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    required 
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="email" 
                    value={newStudent.email} 
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    required 
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="password" 
                    value={newStudent.password} 
                    onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                    required 
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    id="dateOfBirth" 
                    value={newStudent.dateOfBirth} 
                    onChange={(e) => setNewStudent({ ...newStudent, dateOfBirth: e.target.value })}
                    required 
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="gender" className="form-label">Gender</label>
                  <select 
                    className="form-control" 
                    id="gender" 
                    value={newStudent.gender} 
                    onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                    required
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="phoneNumber" 
                    value={newStudent.phoneNumber} 
                    onChange={(e) => setNewStudent({ ...newStudent, phoneNumber: e.target.value })}
                    required 
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="department" className="form-label">Department</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="department" 
                    value={newStudent.department} 
                    onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                    required 
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="degree" className="form-label">Degree</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="degree" 
                    value={newStudent.degree} 
                    onChange={(e) => setNewStudent({ ...newStudent, degree: e.target.value })}
                    required 
                  />
                </div>

                <button type="submit" className="btn btn-primary">Submit Registration</button>
              </form>


            <h4>Pending Registrations</h4>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Roll Number</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Depatment</th>
                  <th>Degree</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingStudents.map(student => (
                  <tr key={student.id}>
                    <td>{student.rollNo}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.department}</td>
                    <td>{student.degree}</td>
                    <td>
                      <button className="btn btn-success btn-sm mr-2" onClick={() => handleAcceptStudent(student._id)}>Accept</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleRejectStudent(student._id)}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
     {activeSection === "userDetails" && (
        <div
          className="profile-dropdown"
          style={{
            position: "absolute",
            top: "50px",
            right: "10px",
            backgroundColor: "white",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
            minWidth: "250px",
            zIndex: 1000,
          }}
          onClick={(event) => event.stopPropagation()} // Prevent closing when clicking inside
        >
          {/* User Details */}
          <div className="profile-card">
            <h5 className="profile-subtitle">Admin Details</h5>
            <p><strong>Name:</strong> {adminDetails.username}</p>
            <p><strong>Email:</strong> {adminDetails.email}</p>
            <p><strong>Role:</strong> Administrator</p>
          </div>
        </div>
      )}


        {activeSection === 'bookIssues' && (
          <div className="book-issues-section">
            <h3>📕 Book Issues</h3>
            <input 
              type="text" 
              placeholder="Filter by Student ID, Book ID, or Name" 
              value={issuedFilter.query}
              onChange={(e) => setIssuedFilter({ query: e.target.value })}
              className="form-control mb-3"
              style={{ maxWidth: '300px' }}
            />
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Student Roll Number</th>
                  <th>Student Name</th>
                  <th>Book ID</th>
                  <th>Book Title</th>
                  <th>Status</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookIssueRequests.map(issue => (
                  <tr key={issue.id}>
                    <td>{issue.studentId.rollNo}</td>
                    <td>{issue.studentId.name}</td>
                    <td>{issue.bookId._id}</td>
                    <td>{issue.bookId.title}</td>
                    <td>{issue.status}</td>
                    <td>{new Date(issue.issueDate).toLocaleDateString() || '-'}</td>
                    <td>{new Date(issue.returnDate).toLocaleDateString() || '-'}</td>

                    <td>
                      {issue.status === 'booked' && (
                        <>
                          <button className="btn btn-success btn-sm mr-2" onClick={() => handleAcceptBookRequest(issue._id)}>Accept</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleRejectBookRequest(issue._id)}>Reject</button>
                        </>
                      )}
                      {issue.status === 'issued' && <span>Issued</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeSection === 'complaints' && <Complaints userType="admin" />}
        {activeSection === 'articles' && <Article />}
        {activeSection === 'announcements' && <Announcements />}
        {activeSection === 'article-management' && <ArticleManagement />}
        {activeSection === 'seat-booking' && <SeatBooking />}
             {/* Book Modal */}
             <Modal
  isOpen={bookModalIsOpen}
  onRequestClose={() => setBookModalIsOpen(false)}
  contentLabel={editBookId ? "Edit Book" : "Add Book"}
  className="modal"
  overlayClassName="modal-overlay"
  ariaHideApp={false} // Disable automatic hiding
>
  
  <h2>{editBookId ? "Edit Book" : "Add Book"}</h2>
  <form onSubmit={handleBookSubmit}>
    <div className="form-group">
      <label>Title</label>
      <input
        type="text"
        className="form-control"
        value={bookForm.title}
        onChange={(e) => setBookForm({...bookForm, title: e.target.value})}
        required
      />
    </div>
    
    <div className="form-group">
      <label>Author</label>
      <input
        type="text"
        className="form-control"
        value={bookForm.author}
        onChange={(e) => setBookForm({...bookForm, author: e.target.value})}
        required
      />
    </div>
    
    <div className="form-group">
      <label>Subject</label>
      <input
        type="text"
        className="form-control"
        value={bookForm.subject}
        onChange={(e) => setBookForm({...bookForm, subject: e.target.value})}
        required
      />
    </div>
    
    <div className="form-group">
      <label>Co-Subject</label>
      <input
        type="text"
        className="form-control"
        value={bookForm.coSubject}
        onChange={(e) => setBookForm({...bookForm, coSubject: e.target.value})}
      />
    </div>
    
    <div className="form-group">
      <label>Total Copies</label>
      <input
        type="number"
        className="form-control"
        value={bookForm.total_copies}
        onChange={(e) => setBookForm({...bookForm, total_copies: e.target.value})}
        required
      />
    </div>
    
    <div className="form-group">
      <label>Available Copies</label>
      <input
        type="number"
        className="form-control"
        value={bookForm.available_copies}
        onChange={(e) => setBookForm({...bookForm, available_copies: e.target.value})}
        required
      />
    </div>
    
    <div className="form-group">
      <label>Description</label>
      <textarea
        className="form-control"
        value={bookForm.description}
        onChange={(e) => setBookForm({...bookForm, description: e.target.value})}
      />
    </div>
    
    <div className="form-group">
      <label>Cover Image URL</label>
      <input
        type="text"
        className="form-control"
        value={bookForm.coverImage}
        onChange={(e) => setBookForm({...bookForm, coverImage: e.target.value})}
      />
    </div>
    
    <div className="modal-actions">
      <button type="button" className="btn btn-secondary" onClick={() => setBookModalIsOpen(false)}>
        Cancel
      </button>
      <button type="submit" className="btn btn-primary">
        {editBookId ? "Update" : "Add"} Book
      </button>
    </div>
  </form>
</Modal>
{/* Seat Modal */}
<Modal
  isOpen={seatModalIsOpen}
  onRequestClose={() => setSeatModalIsOpen(false)}
  contentLabel={editSeatId ? "Edit Seat" : "Add Seat"}
  className="modal"
  overlayClassName="modal-overlay"
>
  <h2>{editSeatId ? "Edit Seat" : "Add Seat"}</h2>
  <form onSubmit={handleSeatSubmit}>
    <div className="form-group">
      <label>Seat Type</label>
      <select
        className="form-control"
        value={seatForm.seatType}
        onChange={(e) => setSeatForm({...seatForm, seatType: e.target.value})}
        required
      >
        <option value="cubicle">Cubicle</option>
        <option value="seat">Seat</option>
        <option value="GDTable">GD Table</option>
        <option value="technobooth">Technobooth</option>
      </select>
    </div>
    
    <div className="form-group">
      <label>Seat Number</label>
      <input
        type="text"
        className="form-control"
        value={seatForm.seatNumber}
        onChange={(e) => setSeatForm({...seatForm, seatNumber: e.target.value})}
        required
      />
    </div>
    
    <div className="form-group">
      <label>Room</label>
      <select
        className="form-control"
        value={seatForm.room}
        onChange={(e) => setSeatForm({...seatForm, room: e.target.value})}
        required
      >
        {getUniqueRooms().map(room => (
          <option key={room} value={room}>Room {room}</option>
        ))}
      </select>
    </div>
    
    <div className="form-group">
      <label>Floor</label>
      <select
        className="form-control"
        value={seatForm.floor}
        onChange={(e) => setSeatForm({...seatForm, floor: parseInt(e.target.value)})}
        required
      >
        <option value="1">1</option>
        <option value="2">2</option>
      </select>
    </div>
    
    <div className="form-group">
      <label>X Coordinate</label>
      <input
        type="number"
        className="form-control"
        value={seatForm.coordinates.x}
        onChange={(e) => setSeatForm({
          ...seatForm,
          coordinates: {
            ...seatForm.coordinates,
            x: parseInt(e.target.value)
          }
        })}
        required
      />
    </div>
    
    <div className="form-group">
      <label>Y Coordinate</label>
      <input
        type="number"
        className="form-control"
        value={seatForm.coordinates.y}
        onChange={(e) => setSeatForm({
          ...seatForm,
          coordinates: {
            ...seatForm.coordinates,
            y: parseInt(e.target.value)
          }
        })}
        required
      />
    </div>
    
    <div className="modal-actions">
      <button type="button" className="btn btn-secondary" onClick={() => setSeatModalIsOpen(false)}>
        Cancel
      </button>
      <button type="submit" className="btn btn-primary">
        {editSeatId ? "Update" : "Add"} Seat
      </button>
    </div>
  </form>
</Modal>
{/* Generic Pause Modal */}
{/* Seat Pause Modal (simple availability toggle) */}
<Modal
  isOpen={pauseModalData.type === 'seat'}
  onRequestClose={() => setPauseModalData({ type: '', id: null })}
  contentLabel={`${pauseModalData.isAvailable ? 'Pause' : 'Resume'} Seat`}
  className="modal"
  overlayClassName="modal-overlay"
>
  <h2>{pauseModalData.isAvailable ? 'Pause Seat' : 'Resume Seat'}</h2>
  <form onSubmit={handleSeatPauseSubmit}>
    <div className="form-group">
      <label>Reason (optional)</label>
      <input
        type="text"
        className="form-control"
        value={pauseModalData.reason}
        onChange={(e) => setPauseModalData({...pauseModalData, reason: e.target.value})}
      />
    </div>
    
    <div className="modal-actions">
      <button type="button" className="btn btn-secondary" onClick={() => setPauseModalData({ type: '', id: null })}>
        Cancel
      </button>
      <button type="submit" className="btn btn-primary">
        {pauseModalData.isAvailable ? 'Pause' : 'Resume'} Seat
      </button>
    </div>
  </form>
</Modal>

{/* Room Pause Modal (keep original with time slots) */}
<Modal
  isOpen={pauseModalData.type === 'room'}
  onRequestClose={() => setPauseModalData({ type: '', id: null })}
  contentLabel={`Pause Room ${pauseModalData.id}`}
  className="modal"
  overlayClassName="modal-overlay"
>
  <h2>Pause Room {pauseModalData.id}</h2>
  <form onSubmit={handleRoomPauseSubmit}>
    <div className="form-group">
      <label>From Time</label>
      <input
        type="datetime-local"
        className="form-control"
        value={pauseModalData.fromTime}
        onChange={(e) => setPauseModalData({...pauseModalData, fromTime: e.target.value})}
        required
      />
    </div>
    
    <div className="form-group">
      <label>To Time</label>
      <input
        type="datetime-local"
        className="form-control"
        value={pauseModalData.toTime}
        onChange={(e) => setPauseModalData({...pauseModalData, toTime: e.target.value})}
        required
      />
    </div>
    
    <div className="form-group">
      <label>Reason</label>
      <input
        type="text"
        className="form-control"
        value={pauseModalData.reason}
        onChange={(e) => setPauseModalData({...pauseModalData, reason: e.target.value})}
        required
      />
    </div>
    
    <div className="modal-actions">
      <button type="button" className="btn btn-secondary" onClick={() => setPauseModalData({ type: '', id: null })}>
        Cancel
      </button>
      <button type="submit" className="btn btn-primary">
        Pause Room
      </button>
    </div>
  </form>
</Modal>

      </div>
 
    </div>
  );
};

export default Admin;
