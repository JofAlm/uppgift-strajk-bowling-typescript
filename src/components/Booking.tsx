import axios from "axios";
import React, { useState } from "react";
import { BookingRequest, BookingResponse } from "../models/Booking";

const Booking: React.FC = () => {
  // State för att hålla bokningsdata som skickas till API:et
  const [bookingData, setBookingData] = useState<BookingRequest>({
    when: "", // Datum och tid i format YYYY-MM-DDTHH:MM
    lanes: 1, // Antal banor
    people: 1, // Antal spelare
    shoes: [], // Array för att hålla skostorlekar
  });

  // State för bekräftelsedata som returneras från API:et
  const [confirmation, setConfirmation] = useState<BookingResponse | null>(
    null
  );

  // State för att hantera eventuella felmeddelanden
  const [error, setError] = useState<string | null>(null);

  // State för att hantera om menyn är öppen eller stängd
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  /**
   * Hanterar ändring av datum och uppdaterar `when`-fältet i `bookingData`.
   */
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const date = e.target.value; // Datum från inputfältet
    setBookingData((prevData) => ({
      ...prevData,
      when: `${date}T${prevData.when.split("T")[1] || "00:00"}`, // Kombinerar datum med befintlig tid
    }));
  };

  /**
   * Hanterar ändring av tid och uppdaterar `when`-fältet i `bookingData`.
   */
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const time = e.target.value; // Tid från inputfältet
    setBookingData((prevData) => ({
      ...prevData,
      when: `${prevData.when.split("T")[0] || "1970-01-01"}T${time}`, // Kombinerar tid med befintligt datum
    }));
  };

  /**
   * Hanterar ändringar i antal spelare och banor, uppdaterar `bookingData`.
   * Skapar också skostorleksfält baserat på antal spelare.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setBookingData((prevData) => ({
      ...prevData,
      [name]: name === "people" || name === "lanes" ? parseInt(value) : value, // Hanterar nummerfält som heltal
    }));

    if (name === "people") {
      const newPeopleCount = Math.max(1, parseInt(value)); // Minst 1 spelare
      setBookingData((prevData) => ({
        ...prevData,
        people: newPeopleCount,
        shoes: Array(newPeopleCount).fill(0), // Uppdaterar skostorleksfält
      }));
    }
  };

  /**
   * Hanterar ändring av skostorlek för en specifik spelare.
   */
  const handleShoeSizeChange = (index: number, size: string): void => {
    const newShoes = [...bookingData.shoes]; // Skapar en kopia av skostorleksarrayen
    newShoes[index] = parseInt(size); // Uppdaterar skostorlek vid specifikt index
    setBookingData((prevData) => ({
      ...prevData,
      shoes: newShoes, // Sparar den uppdaterade arrayen
    }));
  };

  /**
   * Räknar ut totalpriset baserat på antal spelare och banor.
   */
  const calculateTotalPrice = (): number => {
    const pricePerPerson = 120; // Pris per spelare
    const pricePerLane = 100; // Pris per bana
    return (
      bookingData.people * pricePerPerson + bookingData.lanes * pricePerLane
    ); // Totalsumma
  };

  /**
   * Skickar bokningsdata till API:et och hanterar svaret eller eventuella fel.
   */
  const handleBookingSubmit = async (): Promise<void> => {
    console.log("Data to be sent:", bookingData); // Loggar bokningsdata för felsökning

    try {
      const response = await axios.post<BookingResponse>(
        "https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com", // API-endpoint
        JSON.stringify(bookingData), // Skickar data som JSON-sträng
        {
          headers: {
            "x-api-key": "738c6b9d-24cf-47c3-b688-f4f4c5747662", // API-nyckel
            "Content-Type": "text/plain", // Förhindrar CORS-problem
          },
        }
      );
      setConfirmation({ ...response.data, price: calculateTotalPrice() }); // Sparar bekräftelsen i state
      setError(null); // Nollställer eventuella tidigare fel
    } catch (error: any) {
      console.error("Booking failed:", error); // Loggar felet
      if (error.response) {
        console.error("Response data:", error.response.data); // Loggar mer specifika fel
        console.error("Status code:", error.response.status); // Loggar HTTP-status
      }
      setError("Failed to complete booking. Please try again."); // Visar felmeddelande
    }
  };

  /**
   * Återställer `confirmation` för att visa bokningsformuläret igen.
   */
  const handleGoToStart = (): void => {
    setConfirmation(null); // Rensa bekräftelsen
    setMenuOpen(false); // Stäng menyn
  };

  return (
    <div style={styles.container}>
      <img src="logo.png" alt="Strajk Bowling Logo" style={styles.logo} />
      <h2 style={styles.heading}>BOOKING</h2>

      {/* Navikon och meny */}
      <div style={styles.menuIcon} onClick={() => setMenuOpen(!menuOpen)}>
        ☰ {/* Enkel navikon */}
      </div>
      {menuOpen && (
        <div style={styles.menu}>
          <p
            onClick={handleGoToStart}
            style={{ cursor: "pointer", color: "#512da8" }}
          >
            Go to Start Page {/* Knapp för att återgå till startsidan */}
          </p>
          <p>Booking History</p>
          <p>Settings</p>
        </div>
      )}

      {/* Visa antingen bekräftelsesidan eller bokningsformuläret */}
      {confirmation ? (
        <div style={styles.confirmation}>
          <h2>See You Soon!</h2>
          <p>Booking Number: {confirmation.id}</p>
          <p>Total: {confirmation.price} SEK</p>
          <p>Date: {confirmation.when}</p>
          <p>Lanes: {confirmation.lanes}</p>
          <p>Players: {confirmation.people}</p>
        </div>
      ) : (
        <>
          <div style={styles.section}>
            <label style={styles.label}>DATE</label>
            <input
              type="date"
              name="date"
              onChange={handleDateChange}
              style={styles.input}
            />
          </div>

          <div style={styles.section}>
            <label style={styles.label}>TIME</label>
            <input
              type="time"
              name="time"
              onChange={handleTimeChange}
              style={styles.input}
            />
          </div>

          <div style={styles.section}>
            <label style={styles.label}>NUMBER OF AWESOME BOWLERS</label>
            <input
              type="number"
              name="people"
              value={bookingData.people}
              onChange={handleChange}
              min="1"
              style={styles.input}
            />
          </div>

          <div style={styles.section}>
            <label style={styles.label}>NUMBER OF LANES</label>
            <input
              type="number"
              name="lanes"
              value={bookingData.lanes}
              onChange={handleChange}
              min="1"
              style={styles.input}
            />
          </div>

          {bookingData.shoes.map((_, index) => (
            <div style={styles.section} key={index}>
              <label style={styles.label}>SHOE SIZE / PERSON {index + 1}</label>
              <input
                type="number"
                value={bookingData.shoes[index]}
                onChange={(e) => handleShoeSizeChange(index, e.target.value)}
                style={styles.input}
                min="30"
                max="50"
              />
            </div>
          ))}

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.button} onClick={handleBookingSubmit}>
            STRIIIIKE!
          </button>
        </>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "20px", maxWidth: "400px", margin: "0 auto" },
  logo: { display: "block", margin: "0 auto", width: "80px" },
  heading: {
    textAlign: "center" as const,
    fontSize: "32px",
    color: "#FF4965",
    marginTop: "10px",
    marginBottom: "20px",
  },
  menuIcon: {
    cursor: "pointer",
    fontSize: "24px",
    textAlign: "right" as const,
  },
  menu: {
    backgroundColor: "#f8f9fa",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "20px",
  },
  section: { marginBottom: "20px" },
  label: {
    fontSize: "14px",
    color: "#512da8",
    marginBottom: "5px",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #512da8",
  },
  button: {
    width: "100%",
    padding: "15px",
    fontSize: "18px",
    backgroundColor: "#FF4965",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  confirmation: { padding: "20px", textAlign: "center" as const },
  error: { color: "red", marginBottom: "20px" },
};

export default Booking;
