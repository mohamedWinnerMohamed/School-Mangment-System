const STRAPI_URL = "http://localhost:1337";
const STRAPI_KEY = "32b911f09bb0024cc9eb395a92691c2cecd1446c5e2a59422bcb68716c1f7f961f6592bca90aab1e74149f4bb643e3d3f71c94191ab0e0dcc35b669ffc2826b89d8c4716e40a88f68ee21f34782d74907484e823093fdf9f553b4d56d3ad09188836b234f7b96d7bdb855793b064622563d34f17c4d5f66c9e744d7613d57c35";

async function getTeachers() {
  const url = `${STRAPI_URL}/api/teachers?populate=*`;
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_KEY}`,
    },
  };

  try {
    const res = await fetch(url, options);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

getTeachers();
