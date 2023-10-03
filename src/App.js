import React, { useState } from "react";

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between", // Add spacing between cards
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f7f7f7",
    padding: "20px", // Add padding to the container
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    width: "45%", // Adjusted card width
    aspectRatio: "1/1", // Make the card square
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  },
  input: {
    padding: "15px",
    marginBottom: "15px",
    border: "none",
    backgroundColor: "#f2f2f2",
    color: "#000",
    borderRadius: "5px",
    width: "100%",
    fontSize: "16px",
  },
  fileInput: {
    padding: "15px",
    marginBottom: "15px",
    border: "none",
    backgroundColor: "#f2f2f2",
    color: "#000",
    borderRadius: "5px",
    width: "100%",
    display: "none",
  },
  fileInputLabel: {
    padding: "15px",
    marginBottom: "15px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "5px",
    width: "100%",
    textAlign: "center",
    cursor: "pointer",
    fontSize: "16px",
  },
  button: {
    padding: "15px 30px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  meanText: {
    color: "red",
    fontSize: "16px",
  },
  notMeanText: {
    color: "green",
    fontSize: "16px",
  },
  fileText: {
    fontWeight: "bold",
    fontSize: "16px",
  },
  wordList: {
    listStyle: "none",
    padding: 0,
  },
};

function App() {
  const [inputText, setInputText] = useState(""); // State to store input text
  const [isMean, setIsMean] = useState(null); // State to store whether the text is mean or not
  const [fileData, setFileData] = useState(""); // State to store file data
  const [wordResponses, setWordResponses] = useState([]); // State to store responses for each word

  // Function to handle text submission
  const handleSubmit = async () => {
    try {
      // Send an API request with the inputText
      const response = await fetch("http://127.0.0.1:5000/check-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (response.ok) {
        const data = await response.json();
        // Check if the API response indicates the text is mean (true)
        
        setIsMean(data.ans === "true");
      } else {
        // Handle API error here
        console.error("API request failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  // Function to handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = async (event) => {
        const content = event.target.result;
        setFileData(content);

        // Split the file content into words
        const words = content.split(/\s+/);
        const responses = [];

        // Make API calls for each word
        for (const word of words) {
          try {
            const response = await fetch("http://127.0.0.1:5000/check-text", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ text: word }),
            });

            if (response.ok) {
              const data = await response.json();
              responses.push({ word, isMean: data.ans === "true" });
            } else {
              // Handle API error here
              console.error("API request failed");
            }
          } catch (error) {
            console.error("An error occurred:", error);
          }
        }

        // Set the responses for each word
        setWordResponses(responses);
      };
      fileReader.readAsText(file);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Enter text"
            style={styles.input}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button style={styles.button} onClick={handleSubmit}>
            Submit
          </button>
        </div>
        {isMean !== null && (
          <p style={isMean ? styles.meanText : styles.notMeanText}>
            {isMean ? "This text is mean." : "This text is not mean."}
          </p>
        )}
      </div>
      <div style={styles.card}>
        <div style={styles.inputContainer}>
          <label htmlFor="fileInput" style={styles.fileInputLabel}>
            Upload .txt File
          </label>
          <input
            type="file"
            id="fileInput"
            accept=".txt"
            style={styles.fileInput}
            onChange={handleFileUpload}
          />
        </div>
        {wordResponses.length > 0 && (
          <div>
            <p style={styles.fileText}>Word Responses:</p>
            <ul style={styles.wordList}>
              {wordResponses.map((response, index) => (
                <li
                  key={index}
                  style={response.isMean ? styles.meanText : styles.notMeanText}
                >
                  {response.word} - {response.isMean ? "Bad" : "Good"}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
