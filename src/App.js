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
};

function App() {
  const [inputText, setInputText] = useState(""); // State to store input text
  const [isMean, setIsMean] = useState(null); // State to store whether the text is mean or not
  const [fileData, setFileData] = useState(""); // State to store file data
  const [sentenceResults, setSentenceResults] = useState([]); // State to store results for each sentence
  const [type, setType] = useState("");
  
  // Function to handle text submission
  const handleSubmit = async () => {
    try {
      // Send an API request with the inputText
      const response = await fetch("https://a8k7ok1hmc.execute-api.ca-central-1.amazonaws.com/cyberbullyingpredict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (response.ok) {
	console.log("hey");      
        const data = await response.json();
          console.log(data);       
        // Check if the API response indicates the text is mean (true)
	      setIsMean(data.body.result === "true");
        setType(data.body.type);
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

        // Split the content into sentences separated by periods (.)
        const sentences = content.split(".");

        // Loop through the sentences and make API calls for each
        const results = [];
        for (const sentence of sentences) {
          const trimmedSentence = sentence.trim(); // Remove leading/trailing spaces
          if (trimmedSentence) {
            try {
              const response = await fetch("https://a8k7ok1hmc.execute-api.ca-central-1.amazonaws.com/cyberbullyingpredict", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: trimmedSentence }),
              });

              if (response.ok) {
                const data = await response.json();
                setType(data.body.type);
                results.push({ sentence: trimmedSentence, isMean: data.body.result === "true" });
              } else {
                // Handle API error here
                console.error("API request failed");
              }
            } catch (error) {
              console.error("An error occurred:", error);
            }
          }
        }

        // Set the results for each sentence
        setSentenceResults(results);
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
          <h1 style={isMean ? styles.meanText : styles.notMeanText}>
            {isMean ? "This text is mean." : "This text is not mean."}
          </h1>
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
        {sentenceResults.length > 0 && (
          <div>
            <p style={styles.fileText}>Sentence Results:</p>
            <ul style={styles.wordList}>
              {sentenceResults.map((result, index) => (
                <li
                  key={index}
                  style={result.isMean ? styles.meanText : styles.notMeanText}
                >
		       {result.sentence} - {result.isMean ? "Mean" : "Not Mean"}
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
