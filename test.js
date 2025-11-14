// testClient.js
const API_URL = "https://2a92vvdql8.execute-api.us-east-1.amazonaws.com/prod/follower/status"; // your API Gateway endpoint

const testRequest = {
  token: "fake-token",
  user: {
    firstName: "Alice",
    lastName: "Anderson",
    alias: "@alice",
    imageUrl: "https://example.com/alice.png"
  },
  selectedUser: {
    firstName: "Bob",
    lastName: "Brown",
    alias: "@bob",
    imageUrl: "https://example.com/bob.png"
  }
};

async function testLambdaCall() {
  try {
    console.log("Sending request to server:", testRequest);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(testRequest)
    });

    if (!response.ok) {
      console.error("Server returned an error:", response.status, response.statusText);
      const text = await response.text();
      console.log("Response body:", text);
      return;
    }

    const data = await response.json();
    console.log("Response from server:", data);
  } catch (err) {
    console.error("Error calling server:", err);
  }
}

testLambdaCall();
