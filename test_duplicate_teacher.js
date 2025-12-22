const STRAPI_URL = "http://localhost:1337";
const STRAPI_KEY =
  "32b911f09bb0024cc9eb395a92691c2cecd1446c5e2a59422bcb68716c1f7f961f6592bca90aab1e74149f4bb643e3d3f71c94191ab0e0dcc35b669ffc2826b89d8c4716e40a88f68ee21f34782d74907484e823093fdf9f553b4d56d3ad09188836b234f7b96d7bdb855793b064622563d34f17c4d5f66c9e744d7613d57c35";

async function testDuplicateTeacherId() {
  const url = `${STRAPI_URL}/api/teachers`;

  // بيانات تجريبية مع teacherId موجود مسبقًا
  const testData = {
    data: {
      userName: "testuser2",
      email: "test2@example.com",
      firstName: "Test",
      lastName: "User",
      teacherId: "65", // teacherId موجود في قاعدة البيانات
      phoneNumber: "1234567890",
      address: "Test Address",
      birthday: "1990-01-01",
      sex: "male",
      bloodType: "A+",
      classes: [],
      subjects: [],
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_KEY}`,
      },
      body: JSON.stringify(testData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log("=== Full Error Response ===");
      console.log(JSON.stringify(errorData, null, 2));

      console.log("\n=== Error Structure ===");
      console.log("Status:", errorData.error?.status);
      console.log("Name:", errorData.error?.name);
      console.log("Message:", errorData.error?.message);

      if (errorData.error?.details) {
        console.log("\n=== Error Details ===");
        console.log(JSON.stringify(errorData.error.details, null, 2));
      }
    } else {
      const data = await response.json();
      console.log("Success:", data);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testDuplicateTeacherId();
