const login_form = document.getElementById("login_form");
const registerPage_btn = document.getElementById("registerPage_btn");

const loginUser = async (userData) => {
  const response = await fetch(
    "https://todoapp-api-9mvn.onrender.com/api/user/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    }
  );

  const result = await response.json();
  console.log(response);
  return result;
  // return await response.getHeaders();
};
login_form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const formProps = Object.fromEntries(formData);
  const { email, password } = formProps;
  const userData = {
    email,
    password,
  };
  console.log(userData);
  loginUser(userData)
    .then((result) => {
      console.log(result);

      if (result.success == true) {
        console.log(result, document.cookie);

        // window.location.href = "/app/main.html";
        window.location.assign("../index.html");
      } else {
        console.error(result);
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

registerPage_btn.addEventListener("click", () => {
  window.location.assign("../register_page/register.html");
});
